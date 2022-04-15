import chai from "chai";
import chaiHttp from 'chai-http';
import User from './userdto';
import request from './request';
chai.should();

chai.use(chaiHttp);

let userToken: string;
let adminToken: string;

let blockBody = {
    id: '',
    reason: 'Spam',
    blockFlag: true
}

let unBlockUser = {
    id: '',
    reason: '',
    blockFlag: false
}

let loginBody ={
    email: 'user@gmail.com',
    password: "123456789"
}

before('get user token', async () => {
    let userRes = await request.makeRequest('post','/api/auth/login','', loginBody);
    userToken = userRes.body.token;
    loginBody.email = 'admin@gmail.com';
    let adminRes = await request.makeRequest('post','/api/auth/login','', loginBody);
    adminToken = adminRes.body.token;
})

describe('Block service', () => {
    

    it('Should NOT block user without admin token', async () => {
        let res = await request.makeRequest('patch',`/api/admin/blockUser`,`${userToken}`,blockBody);
        res.should.have.status(403);
    })

    it('Should NOT block user with incorrect admin token', async () => {
        let res = await request.makeRequest('patch',`/api/admin/blockUser`,`${adminToken}test`,blockBody);
        res.should.have.status(401);
    })

    it('Should block user', async () => {
        blockBody.id = User.userId;
        let res = await request.makeRequest('patch',`/api/admin/blockUser`,`${adminToken}`,blockBody);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('userId').equal(blockBody.id);
        res.body.should.have.property('reason').equal(blockBody.reason);
        res.body.should.have.property('isBlocked').equal(blockBody.blockFlag);
    })

    it('Should NOT block user with block status', async () => {
        let res = await request.makeRequest('patch',`/api/admin/blockUser`,`${adminToken}`,blockBody);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Пользователь уже находиться в блокировке или разблокирован');
    })

    it('Should NOT unblock user without admin token', async () => {
        let res = await request.makeRequest('patch',`/api/admin/unblockUser`,`${userToken}`,unBlockUser);
        res.should.have.status(403);
    })

    it('Should NOT unblock user with incorrect admin token', async () => {
        let res = await request.makeRequest('patch',`/api/admin/unblockUser`,`${adminToken}test`,unBlockUser);
        res.should.have.status(401);
    })

    it('Should unblock user', async () => {
        unBlockUser.id = User.userId;
        let res = await request.makeRequest('patch',`/api/admin/unblockUser`,`${adminToken}`,unBlockUser);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('userId').equal(unBlockUser.id);
        res.body.should.have.property('reason').equal(unBlockUser.reason);
        res.body.should.have.property('isBlocked').equal(unBlockUser.blockFlag);
    })

    it('Should NOT unblock user without block status', async () => {
        let res = await request.makeRequest('patch',`/api/admin/unblockUser`,`${adminToken}`,unBlockUser);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('message').equal('Пользователь уже находиться в блокировке или разблокирован');
    })

})