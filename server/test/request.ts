import chai from "chai";
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

class Req{

    private async getReq(url:string,userToken:string){
        const res = await chai.request(app).get(url).set("authorization", `Bearer ${userToken}`)
        return res;
    }

    private async postReq(url:string, userToken:string, body:object){
        const res = await chai.request(app).post(url).send(body).set("authorization", `Bearer ${userToken}`)
        return res;
    }

    private async patchReq(url:string, userToken:string, body:object){
        const res = await chai.request(app).patch(url).send(body).set("authorization", `Bearer ${userToken}`)
        return res;
    }

    private async deleteReq(url:string,userToken:string,body:object){
        const res = await chai.request(app).delete(url).send(body).set("authorization", `Bearer ${userToken}`)
        return res;
    }

    public makeRequest(method:string,url:string,userToken:string, body:object){
        if(method == 'get'){
            const res = this.getReq(url,userToken);
            return res;
        }
        else if(method == 'post'){
            const res = this.postReq(url,userToken,body);
            return res;
        }
        else if(method == 'patch'){
            const res = this.patchReq(url,userToken,body);
            return res;
        }
        else if(method == 'delete'){
            const res = this.deleteReq(url,userToken,body);
            return res;
        }
    }
}

export default new Req();