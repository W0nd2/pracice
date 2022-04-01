import chai from "chai";
import chaiHttp from 'chai-http';
import app from '../index';

chai.should();

chai.use(chaiHttp);

let userToken: string;
let adminToken: string;

let userId = 2;

let managerRegBody ={
    id: 3,
    reason: 'Test'
}

describe('MANAGER + ADMIN ROUT', () => {

    before('get user token', (done) => {
        let userEmail = 'user@gmail.com';
        let userPassword = "123456789";

        const userBody = {
            email: userEmail,
            password: userPassword
        }

        chai.request(app)
            .post('/api/auth/login')
            .send(userBody)
            .end((err, res) => {
                userToken = res.body.token;
                done();
            })
    })

    before('get admin token', (done) => {

        let adminEmail = 'admin@gmail.com';
        let userPassword = "123456789";

        const adminBody = {
            email: adminEmail,
            password: userPassword
        }

        chai.request(app)
            .post('/api/auth/login')
            .send(adminBody)
            .end((err, res) => {
                adminToken = res.body.token;
                done();
            })
    })
    /**
     * queue
     * declineByManager
     * confirmMember
     * confirmToAnotherTeam
     * declineToAnotherTeam
     */

    describe('User by Id', () => {

        it('Should NOT return user by id without admin token', (done) => {
            chai.request(app)
                .get(`/api/admin/userById?id=${userId}`)
                .set("authorization", `Bearer ${userToken}`)
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                })
        })

        it('Should NOT return user by id without correct admin token', (done) => {
            chai.request(app)
                .get(`/api/admin/userById?id=${userId}`)
                .set("authorization", `Bearer ${adminToken}test`)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                })
        })

        it('Should return user by id', (done) => {
            chai.request(app)
                .get(`/api/admin/userById?id=${userId}`)
                .set("authorization", `Bearer ${adminToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').equal(userId);
                    res.body.should.have.property('email');
                    res.body.should.have.property('login');
                    done();
                })
        })
    })

    describe('Manager by id', () => {

        it('Should NOT return manager by id without admin token', (done) => {
            let managerId = '1';
            chai.request(app)
                .get(`/api/admin/managerByID?id=${managerId}`)
                .set("authorization", `Bearer ${userToken}`)
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                })
        })

        it('Should NOT return manager by id without correct admin token', (done) => {
            let managerId = '1';
            chai.request(app)
                .get(`/api/admin/managerByID?id=${managerId}`)
                .set("authorization", `Bearer ${adminToken}test`)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                })
        })

        it('Should return message that there is no manager by such Id', (done) => {
            let managerId = '1';
            chai.request(app)
                .get(`/api/admin/managerByID?id=${managerId}`)
                .set("authorization", `Bearer ${adminToken}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Пользователь не являеться MANAGER');
                    done();
                })
        })

        //сделать возврат менеджеров

        it('Should return manager by Id', (done)=>{
            let managerId = 3;
            chai.request(app)
                .get(`/api/admin/managerByID?id=${managerId}`)
                .set("authorization", `Bearer ${adminToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').equal(managerId);
                    res.body.should.have.property('login').equal('manager');
                    done();
                })
        })
    })

    describe('Get all managers', () => {
        it('Should NOT return managers without admin token', (done) => {
            chai.request(app)
                .get(`/api/admin/allManagers`)
                .set("authorization", `Bearer ${userToken}`)
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                })
        })

        it('Should NOT return managers without correct admin token', (done) => {
            chai.request(app)
                .get(`/api/admin/allManagers`)
                .set("authorization", `Bearer ${adminToken}test`)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                })
        })

        it('Should return all managers', (done) => {
            chai.request(app)
                .get(`/api/admin/allManagers`)
                .set("authorization", `Bearer ${adminToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })
        })
    })

    describe('Confirm manager registration', ()=>{

        it('Should NOT confirm manager with user token', (done)=>{
            chai.request(app)
                .patch(`/api/admin/confirmManager`)
                .set("authorization", `Bearer ${userToken}`)
                .send(managerRegBody)
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                })
        })

        it('Should NOT confirm manager with incorrect admin token', (done)=>{
            chai.request(app)
                .patch(`/api/admin/confirmManager`)
                .set("authorization", `Bearer ${adminToken}test`)
                .send(managerRegBody)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                })
        })

        it('Should NOT confirm user with incorrect role', (done)=>{

            let wrongManager ={
                id:2,
                reason:'TEST'
            }

            chai.request(app)
                .patch(`/api/admin/confirmManager`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(wrongManager)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Пользователь не являеться MANAGER');
                    done();
                })
        })

        it('Should NOT confirm manager with incorrect id', (done)=>{

            let wrongManager ={
                id:-1,
                reason:'TEST'
            }

            chai.request(app)
                .patch(`/api/admin/confirmManager`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(wrongManager)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Пользователя с таким id не существует');
                    done();
                })
        })

        it('Should confirm manager', (done)=>{
            chai.request(app)
                .patch(`/api/admin/confirmManager`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(managerRegBody)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').equal(managerRegBody.id);
                    res.body.should.have.property('managerActive').equal(true);
                    done();
                })
        })

        it('Should NOT confirm manager with active manager account', (done)=>{
            chai.request(app)
                .patch(`/api/admin/confirmManager`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(managerRegBody)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Пользователь уже являеться MANAGER');
                    done();
                })
        })
    })
})