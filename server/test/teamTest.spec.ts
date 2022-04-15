import chai from "chai";
import chaiHttp from 'chai-http';
import '../socket/appSocket';
import User from "./userdto";
import request from './request';
chai.should();

chai.use(chaiHttp);

let userToken: string;
let adminToken: string;

const userBody = {
    email: 'user@gmail.com',
    password: "123456789"
}

const adminBody = {
    email: 'admin@gmail.com',
    password: "123456789"
}

let userReq ={
    userId: 1, 
    comandId: 1 
}

before(async () => {
    let res = await request.makeRequest('post','/api/auth/login',``, userBody);
    userToken = res.body.token;
    let adminRes = await request.makeRequest('post','/api/auth/login',``, adminBody);
    adminToken = adminRes.body.token;
    await request.makeRequest('post','/api/user/newTeamMember',`${adminToken}`, {comandId: 1});
})

describe('TEAM test', () => {
    
    it('Should NOT return all users requests for join team without admin or manager token', async () => {
        let res = await request.makeRequest('get',`/api/admin/queue`,`${userToken}`,{});
        res.should.have.status(403);
    })

    it('Should NOT return all users requests for join team without correct admin or manager token', async () => {
        let res = await request.makeRequest('get',`/api/admin/queue`,`${adminToken}test`,{});
        res.should.have.status(401);
    })

    it('Should return all users requests for join team', async () => {
        let res = await request.makeRequest('get',`/api/admin/queue`,`${adminToken}`,{});
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('queue').be.a('array');
    })

    it('Should return that no such member on queue', async () => {
        let res = await request.makeRequest('delete',`/api/admin/declineByManager`,`${adminToken}`, {userId: 3});
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Пользователь с таким ID не состоит в очереди');
    })

    it('Should NOT decline member registration with user token', async () => {
        let res = await request.makeRequest('delete',`/api/admin/declineByManager`,`${userToken}`, {userId: 3});
        res.should.have.status(403);
    })

    it('Should NOT decline member registration without correct admin or manager token', async () => {
        let res = await request.makeRequest('delete',`/api/admin/declineByManager`,`${adminToken}test`, {userId: 1});
        res.should.have.status(401);
    })

    it('Should decline member registration', async () => {
        let userId = 1;
        let res = await request.makeRequest('delete',`/api/admin/declineByManager`,`${adminToken}`, {userId});
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal(`Пользователь ${userId} удален с очереди менеджером`);
    })
    
    it('Should NOT confirm member registration with user token', async () => {
        await request.makeRequest('post','/api/user/newTeamMember',`${adminToken}`, {comandId: 1});
        let res = await request.makeRequest('post',`/api/admin/confirmMember`,`${userToken}`, userReq);
        res.should.have.status(403);
    })

    it('Should NOT confirm member registration without correct admin or manager token', async () => {
        let res = await request.makeRequest('post',`/api/admin/confirmMember`,`${adminToken}test`, userReq);
        res.should.have.status(401);
    })

    it('Should return that there are no such person', async () => {
        userReq.userId = -1;
        let res = await request.makeRequest('post',`/api/admin/confirmMember`,`${adminToken}`, userReq);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Пользователя с таки ID не существует');
    })

    it('Should return that no such person on queue', async () => {
        userReq.userId = Number(User.userId);
        let res = await request.makeRequest('post',`/api/admin/confirmMember`,`${adminToken}`, userReq);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Пользователь с таки ID не состоит в очереди, возможно его уже добавили в команду');
    })

    it('Should return that no such team', async () => {
        userReq.userId = 1;
        userReq.comandId = 22;
        let res = await request.makeRequest('post',`/api/admin/confirmMember`,`${adminToken}`, userReq);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Данной команды не существует');
    })

    it('Should confirm member registration', async () => {
        userReq.comandId = 1
        let res = await request.makeRequest('post',`/api/admin/confirmMember`,`${adminToken}`, userReq);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('userId').equal(userReq.userId);
        res.body.should.have.property('comandId').equal(userReq.comandId);
    })
})