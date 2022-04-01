import chai from "chai";
import chaiHttp from 'chai-http';
import app from '../index'
import * as uuid from 'uuid'
import bcrypt from 'bcrypt';

chai.should();

chai.use(chaiHttp);

let token:string;
//let adminToken:string;

describe('USERROUT', ()=>{

    before((done)=>{
        let userEmail = 'user@gmail.com';
        let adminEmail = 'admin@gmail.com';
        let userPassword = "123456789";
        
        const userBody ={
            email: userEmail,
            password: userPassword
        }

        chai.request(app)
            .post('/api/auth/login')
            .send(userBody)
            .end((err, res)=>{
                token = res.body.token;
            done();
        })
    })

    describe('Profile', ()=>{

        it('Should return profile', (done) => {
            chai.request(app)
                .get('/api/user/profile')
                .set("authorization", `Bearer ${token}`)
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('login');
                    res.body.should.have.property('email');
                done();
            })
        })

        it('Should NOT return profile with incorrect token', (done) => {
            chai.request(app)
                .get('/api/user/profile')
                .set("authorization", `Bearer ${token}test`)
                .end((err, res)=>{
                    res.should.have.status(401);
                done();
            })
        })
    })


    describe('Change login', ()=>{

        it('Should return profile with new login', (done) => {
            let newUserLogin = 'newLogin';
            let body = {
                newLogin: newUserLogin
            }
            chai.request(app)
                .patch('/api/user/login/change')
                .set("authorization", `Bearer ${token}`)
                .send(body)
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('login').equal(`${newUserLogin}`);
                    res.body.should.have.property('email');
                done();
            })
        })

        it('Should NOT return profile with new login without correct token', (done) => {
            let newUserLogin = 'newLogin';
            let body = {
                newLogin: newUserLogin
            } 
            chai.request(app)
                .patch('/api/user/login/change')
                .set("authorization", `Bearer ${token}test`)
                .send(body)
                .end((err, res)=>{
                    res.should.have.status(401);
                done();
            })
        })

        it('Should NOT return profile with new login without correct login', (done) => {
            let newUserLogin = 'ts';
            let body = {
                newLogin: newUserLogin
            } 
            chai.request(app)
                .patch('/api/user/login/change')
                .set("authorization", `Bearer ${token}`)
                .send(body)
                .end((err, res)=>{
                    res.should.have.status(400);
                done();
            })
        })
    })

    describe('Change password', ()=>{

        it('Should change password', (done) => {
            let newPassword = '123456789';
            let body = {
                password: newPassword
            }
            chai.request(app)
                .patch('/api/user/password')
                .set("authorization", `Bearer ${token}`)
                .send(body)
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('email');
                    let pasCompare = bcrypt.compareSync(newPassword,res.body.password)
                    pasCompare.should.be.equal(true); 
                done();
            })
        })

        it('Should NOT change password with incorrect password', (done) => {
            let newPassword = '12';
            let body = {
                password: newPassword
            }
            chai.request(app)
                .patch('/api/user/password')
                .set("authorization", `Bearer ${token}`)
                .send(body)
                .end((err, res)=>{
                    res.should.have.status(400);
                done();
            })
        })

        it('Should NOT change password with incorrect token', (done) => {
            let newPassword = '12345678';
            let body = {
                password: newPassword
            }
            chai.request(app)
                .patch('/api/user/password')
                .set("authorization", `Bearer ${token}test`)
                .send(body)
                .end((err, res)=>{
                    res.should.have.status(401);
                done();
            })
        })

    })
    
    describe('New team member', ()=>{

        it('New member should NOT sent team req with incorrect token', (done)=>{
            let body = {
                comandId: 1
            }
            chai.request(app)
                .post('/api/user/newTeamMember')
                .set("authorization", `Bearer ${token}test`)
                .send(body)
                .end((err, res)=>{
                    res.should.have.status(401);
                done();
            })
        })

        it('New member should NOT sent team req with incorrect team id', (done)=>{
            let body = {
                comandId: 3
            }
            chai.request(app)
                .post('/api/user/newTeamMember')
                .set("authorization", `Bearer ${token}`)
                .send(body)
                .end((err, res)=>{
                    //console.log(res);
                    res.should.have.status(400);
                done();
            })
        })

        it('New member should sent team req',(done)=>{
            let body = {
                comandId: 1
            }
            chai.request(app)
                .post('/api/user/newTeamMember')
                .set("authorization", `Bearer ${token}`)
                .send(body)
                .end((err, res)=>{
                    //console.log(res);
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.body.should.have.property('userId');
                    res.body.should.have.property('comandId').equal(body.comandId);
                done();
            })
        })
    })

    describe('Decline team req', ()=>{

        it('Should Not decline team req with incorrect token', (done)=>{
            chai.request(app)
                .delete('/api/user/declineQueue')
                .set("authorization", `Bearer ${token}test`)
                .end((err, res)=>{
                    res.should.have.status(401);
                done();
            })
        })

        it('Should decline team req', (done)=>{
            chai.request(app)
                .delete('/api/user/declineQueue')
                .set("authorization", `Bearer ${token}`)
                .end((err, res)=>{
                    //console.log(res)
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.body.should.have.property('queue').equal('Пользователь удален с очереди');
                done();
            })
        })
    })

    describe('Team members',()=>{
        it('Should return team members',(done)=>{
            let comandId = '1';
            chai.request(app)
                .get(`/api/user/teamMembers?comandId=${comandId}`)
                .set("authorization", `Bearer ${token}`)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('team');
                done();
            })
        })

        it('Should NOT return team members with incorrect token',(done)=>{
            let comandId = '1';
            chai.request(app)
                .get(`/api/user/teamMembers?comandId=${comandId}`)
                .set("authorization", `Bearer ${token}test`)
                .end((err,res)=>{
                    res.should.have.status(401);
                done();
            })
        })

        it('Should NOT return team members with incorrect team id',(done)=>{
            let comandId = '3';
            chai.request(app)
                .get(`/api/user/teamMembers?comandId=${comandId}`)
                .set("authorization", `Bearer ${token}`)
                .end((err,res)=>{
                    res.should.have.status(400);
                done();
            })
        })
    })

    describe('All members from 2 teames', ()=>{

        it('Should return all members from 2 teames',(done)=>{
            chai.request(app)
                .get('/api/user/allMembers')
                .set("authorization", `Bearer ${token}`)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('teams').be.a('array');
                done();
            })
        })

        it('Should NOT return all members from 2 teames with incorrect token',(done)=>{
            chai.request(app)
                .get('/api/user/allMembers')
                .set("authorization", `Bearer ${token}test`)
                .end((err,res)=>{
                    res.should.have.status(401);
                done();
            })
        })
    })
})