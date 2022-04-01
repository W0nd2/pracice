import chai from "chai";
import chaiHttp from 'chai-http';
import app from '../index';

chai.should();

chai.use(chaiHttp);

let userToken: string;
let adminToken: string;

let blockBody = {
    id: 2,
    reason: 'Spam',
    blockFlag: true
}

let unBlockUser = {
    id: 2,
    reason: '',
    blockFlag: false
}

describe('Block service', () => {

    before('get user token', (done) => {

        const userBody = {
            email: 'user@gmail.com',
            password: "123456789"
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

        const adminBody = {
            email: 'admin@gmail.com',
            password: "123456789"
        }

        chai.request(app)
            .post('/api/auth/login')
            .send(adminBody)
            .end((err, res) => {
                adminToken = res.body.token;
            done();
        })
    })

    describe('Block user', () => {
        
        it('Should NOT block user without admin token', (done) => {
            chai.request(app)
                .patch(`/api/admin/blockUser`)
                .set("authorization", `Bearer ${userToken}`)
                .send(blockBody)
                .end((err, res) => {
                    res.should.have.status(403);
                done();
            })
        })

        it('Should NOT block user with incorrect admin token', (done) => {
            chai.request(app)
                .patch(`/api/admin/blockUser`)
                .set("authorization", `Bearer ${adminToken}test`)
                .send(blockBody)
                .end((err, res) => {
                    res.should.have.status(401);
                done();
            })
        })

        it('Should block user', (done) => {
            chai.request(app)
                .patch(`/api/admin/blockUser`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(blockBody)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('userId').equal(blockBody.id);
                    res.body.should.have.property('reason').equal(blockBody.reason);
                    res.body.should.have.property('isBlocked').equal(blockBody.blockFlag);
                done();
            })
        })

        it('Should NOT block user with block status', (done) => {
            chai.request(app)
                .patch(`/api/admin/blockUser`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(blockBody)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Пользователь уже находиться в блокировке или разблокирован');
                done();
            })
        })
    })

    describe('Unblock user', () => {

        it('Should NOT unblock user without admin token', (done) => {
            chai.request(app)
                .patch(`/api/admin/unblockUser`)
                .set("authorization", `Bearer ${userToken}`)
                .send(unBlockUser)
                .end((err, res) => {
                    res.should.have.status(403);
                done();
            })
        })

        it('Should NOT unblock user with incorrect admin token', (done) => {
            chai.request(app)
                .patch(`/api/admin/unblockUser`)
                .set("authorization", `Bearer ${adminToken}test`)
                .send(unBlockUser)
                .end((err, res) => {
                    res.should.have.status(401);
                done();
            })
        })

        it('Should unblock user', (done) => {
            chai.request(app)
                .patch(`/api/admin/unblockUser`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(unBlockUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('userId').equal(unBlockUser.id);
                    res.body.should.have.property('reason').equal(unBlockUser.reason);
                    res.body.should.have.property('isBlocked').equal(unBlockUser.blockFlag);
                done();
            })
        })

        it('Should NOT unblock user without block status', (done) => {
            chai.request(app)
                .patch(`/api/admin/unblockUser`)
                .set("authorization", `Bearer ${adminToken}`)
                .send(unBlockUser)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Пользователь уже находиться в блокировке или разблокирован');
                done();
            })
        })
    })
})