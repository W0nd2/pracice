import chai from "chai";
import chaiHttp from 'chai-http';
import '../socket/appSocket';
import * as uuid from 'uuid';
import request from './request';
chai.should();

chai.use(chaiHttp);

let userToken: string;
let adminToken: string;

let userId = 1;

let managerRegBody = {
    id:String,
    reason: 'Test'
}

let loginBody ={
    email: 'user@gmail.com',
    password: "123456789"
}

before(async () => {
    let userRes = await request.makeRequest('post','/api/auth/login',``, loginBody);
    userToken = userRes.body.token;
    loginBody.email ='admin@gmail.com';
    let adminRes = await request.makeRequest('post','/api/auth/login',``, loginBody);
    adminToken = adminRes.body.token;
    let managerEmail = `${uuid.v4()}manager@gmail.com`;
    let res = await request.makeRequest('post','/api/auth/registration','', {email: managerEmail,password: '123456789',login: 'test',role: 2});
    managerRegBody.id = res.body.id;
})

describe('MANAGER + ADMIN ROUT', () => {

    it('Should NOT return user by id without admin token', async () => {
        let res = await request.makeRequest('get',`/api/admin/userById?id=${userId}`,`${userToken}`,{})
        res.should.have.status(403);
    })

    it('Should NOT return user by id without correct admin token', async () => {
        let res = await request.makeRequest('get',`/api/admin/userById?id=${userId}`,`${adminToken}test`,{})
        res.should.have.status(401);
    })

    it('Should return user by id', async () => {
        let res = await request.makeRequest('get',`/api/admin/userById?id=${userId}`,`${adminToken}`,{})
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id').equal(userId);
        res.body.should.have.property('email');
        res.body.should.have.property('login');
    })

    it('Should NOT return manager by id without admin token', async () => {
        let managerId = 1;
        let res = await request.makeRequest('get',`/api/admin/managerByID?id=${managerId}`,`${userToken}`,{})
        res.should.have.status(403);
    })

    it('Should NOT return manager by id without correct admin token', async () => {
        let managerId = 1;
        let res = await request.makeRequest('get',`/api/admin/managerByID?id=${managerId}`,`${adminToken}test`,{})
        res.should.have.status(401);
    })

    it('Should return message that there is no manager by such Id', async () => {
        let managerId = 1;
        let res = await request.makeRequest('get',`/api/admin/managerByID?id=${managerId}`,`${adminToken}`,{})
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Пользователь не являеться MANAGER');
    })

    it('Should return manager by Id', async () => {
        let managerId = managerRegBody.id;
        let res = await request.makeRequest('get',`/api/admin/managerByID?id=${managerId}`,`${adminToken}`,{})
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id').equal(managerId);
        res.body.should.have.property('login').equal('test');
    })

    it('Should NOT return managers without admin token', async () => {
        let res = await request.makeRequest('get',`/api/admin/allManagers`,`${userToken}`,{})
        res.should.have.status(403);
    })

    it('Should NOT return managers without correct admin token', async () => {
        let res = await request.makeRequest('get',`/api/admin/allManagers`,`${adminToken}test`,{})
        res.should.have.status(401);
    })

    it('Should return all managers', async () => {
        let res = await request.makeRequest('get',`/api/admin/allManagers`,`${adminToken}`,{})
        res.should.have.status(200);
        res.body.should.be.a('array');
    })

    it('Should NOT confirm manager with user token', async () => {
        let res = await request.makeRequest('patch',`/api/admin/confirmManager`,`${userToken}`, managerRegBody)
        res.should.have.status(403);
    })

    it('Should NOT confirm manager with incorrect admin token', async () => {
        let res = await request.makeRequest('patch',`/api/admin/confirmManager`,`${adminToken}test`, managerRegBody)
        res.should.have.status(401);
    })

    it('Should NOT confirm user with incorrect role', async () => {

        let wrongManager = {
            id: 1,
            reason: 'TEST'
        }
        let res = await request.makeRequest('patch',`/api/admin/confirmManager`,`${adminToken}`, wrongManager)
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Пользователь не являеться MANAGER');
    })

    it('Should NOT confirm manager with incorrect id', async () => {

        let wrongManager = {
            id: -1,
            reason: 'TEST'
        }
        let res = await request.makeRequest('patch',`/api/admin/confirmManager`,`${adminToken}`, wrongManager);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Пользователя с таким id не существует');
    })

    it('Should confirm manager', async () => {
        let res = await request.makeRequest('patch',`/api/admin/confirmManager`,`${adminToken}`, managerRegBody);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id').equal(managerRegBody.id);
        res.body.should.have.property('managerActive').equal(true);
    })

    it('Should NOT confirm manager with active manager account', async () => {
        let res = await request.makeRequest('patch',`/api/admin/confirmManager`,`${adminToken}`, managerRegBody);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Пользователь уже являеться MANAGER');
    })

})