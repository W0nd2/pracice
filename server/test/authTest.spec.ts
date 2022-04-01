import chai from "chai";
import chaiHttp from 'chai-http';
import app from '../index'
import * as uuid from 'uuid';

chai.should();

chai.use(chaiHttp);


//сделать регистрацию менеждеров

//describe('STRIKEBALL', () => {
    describe('AUTHROUT', () => {

        before((done)=>{
            const test ={
                email: "user@gmail.com",
                password: '123456789',
                login: 'test'
            }

            chai.request(app)
                .post('/api/auth/registration')
                .send(test)
                .end((err, response)=>{
            done();
            })
        })

        describe('Registration', () => {

            it('Should reg new manager', (done) => {
                let managerEmail = `${uuid.v4()}@gmail.com`;
                const body ={
                    email: managerEmail,
                    password: '123456789',
                    login: 'manager',
                    role: 2
                }

                chai.request(app)
                    .post('/api/auth/registration')
                    .send(body)
                    .end((err, response)=>{
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('id');
                        response.body.should.have.property('login').equal(`${body.login}`);
                        response.body.should.have.property('email').equal(`${managerEmail}`);
                        response.body.should.have.property('password');
                    done();
                })
            })

            it('Should reg new user', async () => {

                let userEmail = `${uuid.v4()}@gmail.com`;
                const body ={
                    email: userEmail,
                    password: '123456789',
                    login: 'test'
                }
                
                chai.request(app)
                    .post('/api/auth/registration')
                    .send(body)
                    .end((err, response)=>{
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('id');
                        response.body.should.have.property('login').equal(`${body.login}`);
                        response.body.should.have.property('email').equal(`${userEmail}`);
                        response.body.should.have.property('password');
                    //done();
                })
            })

            it('Should NOT reg new user with incorrect password', async () => {
                let userEmail = `${uuid.v4()}@gmail.com`;
                const body ={
                    email: userEmail,
                    password: '1111',
                    login: 'test'
                }
                
                chai.request(app)
                    .post('/api/auth/registration')
                    .send(body)
                    .end((err, res)=>{
                        res.should.have.status(400);
                    //done();
                })
            })

            it('Should NOT reg new user with incorrect email',  async() => {
                let userEmail = `${uuid.v4()}`;
                const body ={
                    email: userEmail,
                    password: '123456789',
                    login: 'test'
                }
                
                chai.request(app)
                    .post('/api/auth/registration')
                    .send(body)
                    .end((err, res)=>{
                        res.should.have.status(400);
                    //done();
                })
            })

            it('Should NOT reg new user with incorrect login',  async() => {
                let userEmail = `${uuid.v4()}@gmail.com`;
                const body ={
                    email: userEmail,
                    password: '123456789',
                    login: ''
                }
                
                chai.request(app)
                    .post('/api/auth/registration')
                    .send(body)
                    .end((err, res)=>{
                        res.should.have.status(400);
                    //done();
                })
            })

        })

        describe('Login', () => {

            it('Should login user', async () => {
                const body ={
                    email: 'user@gmail.com',
                    password: "123456789"
                }
                chai.request(app)
                    .post('/api/auth/login')
                    .send(body)
                    .end((err, res)=>{
                        res.should.have.status(200);
                        res.body.should.have.property('token').be.a('string');
                    //done();
                })
            })

            it('Should NOT login user with incorrect password', () => {
                const body ={
                    email: 'user@gmail.com',
                    password: "1234567890"
                }
                chai.request(app)
                    .post('/api/auth/login')
                    .send(body)
                    .end((err, res)=>{
                        res.should.have.status(400);
                })
            })

            it('Should NOT login user with incorrect email', () => {
                const body ={
                    email: 'user@gmail',
                    password: "1234567890"
                }
                chai.request(app)
                    .post('/api/auth/login')
                    .send(body)
                    .end((err, res)=>{
                        res.should.have.status(400);
                })
            })
        })
    })


//})