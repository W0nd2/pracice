import chai from "chai";
import chaiHttp from 'chai-http';
import * as uuid from 'uuid';
import User from './userdto';
import request from './request';
chai.should();

chai.use(chaiHttp);

let regBody = {
    email: '',
    password: '123456789',
    login: 'test',
    role: 2
}

let loginBody ={
    email: 'user@gmail.com',
    password: "123456789",
    login: 'test'
}

before( async () => {
    await request.makeRequest('post','/api/auth/registration','',loginBody);
})

describe('AUTHROUT', () => {

    it('Should reg new user', async () => {
        let userEmail = `${uuid.v4()}@gmail.com`;
        regBody.email = userEmail;
        regBody.role = 1;
        let res = await request.makeRequest('post','/api/auth/registration','',regBody);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('login').equal(`${regBody.login}`);
        res.body.should.have.property('email').equal(`${userEmail}`);
        res.body.should.have.property('password');
        User.userId = res.body.id;
        User.email = res.body.email;
        User.login = res.body.login;
        User.role = res.body.role;
    })

    it('Should NOT reg new user with incorrect password', async () => {
        let userEmail = `${uuid.v4()}@gmail.com`;
        regBody.email = userEmail;
        regBody.password = '1111'
        let res = await request.makeRequest('post','/api/auth/registration','',regBody);
        res.should.have.status(400);
    })

    it('Should NOT reg new user with incorrect email', async () => {
        let userEmail = `${uuid.v4()}`;
        regBody.email = userEmail;
        regBody.password = '123456789';
        let res = await request.makeRequest('post','/api/auth/registration','',regBody);
        res.should.have.status(400);
    })

    it('Should NOT reg new user with incorrect login', async () => {
        let userEmail = `${uuid.v4()}@gmail.com`;
        regBody.email = userEmail;
        regBody.login = '';
        let res = await request.makeRequest('post','/api/auth/registration','',regBody);
        res.should.have.status(400);
    })

    it('Should login user', async () => {
        let res = await request.makeRequest('post','/api/auth/login','',loginBody);
        res.should.have.status(200);
        res.body.should.have.property('token').be.a('string');
    })

    it('Should NOT login user with incorrect password', async () => {
        loginBody.password = '1234567890'
        let res = await request.makeRequest('post','/api/auth/login','',loginBody);
        res.should.have.status(400);
    })

    it('Should NOT login user with incorrect email', async () => {
        loginBody.email = 'user@gmail'
        loginBody.password = '123456789'
        let res = await request.makeRequest('post','/api/auth/login','',loginBody);
        res.should.have.status(400);
    })
})