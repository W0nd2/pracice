import path from 'path';
import * as uuid from 'uuid';

class FileService{
    uploadFile(avatar:any){
        let fileName = uuid.v4() + ".jpg";
        avatar.mv(path.resolve(__dirname, '..', 'static', fileName));
        return fileName;
    }

}

export default new FileService()