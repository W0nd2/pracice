import chai from "chai";
import chaiHttp from 'chai-http';
import app from '../index';
import bcrypt from 'bcrypt';
import request from './request';
chai.should();

chai.use(chaiHttp);
let token: string;
//let adminToken:string;

before( async () => {
    //let res = await postReq('/api/auth/login',``, {email: 'user@gmail.com',password: "123456789"});
    let res =await request.makeRequest('post','/api/auth/login',``, {email: 'user@gmail.com',password: "123456789"});
    token = res.body.token;
})

async function postReq(url:string,userToken:string, body:any){
    const res = await chai.request(app).post(url).send(body).set("authorization", `Bearer ${userToken}`)
    return res;
}

describe('USERROUT', () => {

    it('Should return profile', async () => {
        let res =await request.makeRequest('get','/api/user/profile',`${token}`,{});
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('login');
        res.body.should.have.property('email');
    })

    it('Should NOT return profile with incorrect token', async () => {
        let res = await request.makeRequest('get','/api/user/profile',`${token}test`,{});
        res.should.have.status(401); 
    })

    it('Should return profile with new login', async () => {
        let body = {
            newLogin: 'newLogin'
        }
        let res = await request.makeRequest('patch','/api/user/login/change',`${token}`,body);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('login').equal(body.newLogin);
        res.body.should.have.property('email');
    })

    it('Should NOT return profile with new login without correct token', async () => {
        let body = {
            newLogin: 'newLogin'
        }
        let res = await request.makeRequest('patch','/api/user/login/change',`${token}test`,body);
        res.should.have.status(401);
    })

    it('Should NOT return profile with new login without correct login', async () => {
        let body = {
            newLogin: 'ts'
        }
        let res = await request.makeRequest('patch','/api/user/login/change',`${token}`,body);
        res.should.have.status(400);
    })

    it('Should change password', async () => {
        let body = {
            password: '123456789'
        }
        let res = await request.makeRequest('patch','/api/user/password',`${token}`,body);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('email');
        let pasCompare = bcrypt.compareSync(body.password, res.body.password)
        pasCompare.should.be.equal(true);
    })

    it('Should NOT change password with incorrect password', async () => {
        let body = {
            password: '12'
        }
        let res = await request.makeRequest('patch','/api/user/password',`${token}`,body);
        res.should.have.status(400);
    })

    it('Should NOT change password with incorrect token', async () => {
        let body = {
            password: '123456789'
        }
        let res = await request.makeRequest('patch','/api/user/login/change',`${token}test`,body);
        res.should.have.status(401);
    })

    it('New member should NOT sent team req with incorrect token', async () => {
        let body = {
            comandId: 1
        }
        let res = await request.makeRequest('post','/api/user/newTeamMember',`${token}token`,body);
        res.should.have.status(401);
    })

    it('New member should NOT sent team req with incorrect team id', async () => {
        let body = {
            comandId: 3
        }
        let res = await request.makeRequest('post','/api/user/newTeamMember',`${token}`,body);
        res.should.have.status(400);
    })

    it('New member should sent team req', async () => {
        let body = {
            comandId: 1
        }
        let res = await request.makeRequest('post','/api/user/newTeamMember',`${token}`,body);
        res.should.have.status(200);
        res.body.should.be.a('object')
        res.body.should.have.property('userId');
        res.body.should.have.property('comandId').equal(body.comandId);
    })

    it('Should Not decline team req with incorrect token', async () => {
        let res = await request.makeRequest('delete','/api/user/declineQueue',`${token}test`,{});
        res.should.have.status(401);
    })

    it('Should decline team req', async () => {
        let res = await request.makeRequest('delete','/api/user/declineQueue',`${token}`,{});
        res.should.have.status(200);
        res.body.should.be.a('object')
        res.body.should.have.property('queue').equal('Пользователь удален с очереди');
    })

    it('Should return team members', async () => {
        let comandId = '1';
        let res = await request.makeRequest('get',`/api/user/teamMembers?comandId=${comandId}`,`${token}`,{});
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('team');
    })

    it('Should NOT return team members with incorrect token', async () => {
        let comandId = '1';
        let res = await request.makeRequest('get',`/api/user/teamMembers?comandId=${comandId}`,`${token}test`,{});
        res.should.have.status(401);
    })

    it('Should NOT return team members with incorrect team id', async () => {
        let comandId = '3';
        let res = await request.makeRequest('get',`/api/user/teamMembers?comandId=${comandId}`,`${token}`,{});
        res.should.have.status(400);
    })

    it('Should return all members from 2 teames', async () => {
        let res = await request.makeRequest('get','/api/user/allMembers',`${token}`,{});
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('teams').be.a('array');
    })

    it('Should NOT return all members from 2 teames with incorrect token', async () => {
        let res = await request.makeRequest('get','/api/user/allMembers',`${token}test`,{});
        res.should.have.status(401);
    })
    
})