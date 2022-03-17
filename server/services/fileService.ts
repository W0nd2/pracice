import path from 'path';
import * as uuid from 'uuid';

class FileService{

    //если не разберусь то уточнить за то как взять файл
    uploadFile(avatar:any){
        let fileName = uuid.v4() + ".jpg";
        console.log(typeof(avatar))
        avatar.mv(path.resolve(__dirname, '..', 'static', fileName));
        return fileName;
    }

}

export default new FileService()