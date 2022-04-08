require('dotenv').config();
import db from "../database";
import AproveList from '../models/aprovelistModel';
import Banlist from '../models/banlistModel';
import UserComand from '../models/usercomandModel';
import User from '../models/userModel'
import {Op} from 'sequelize'

(async () => {
    console.log('Reseting the DB...');
    await db.authenticate();
    await AproveList.truncate({cascade:true});
    await Banlist.truncate({cascade:true});
    await UserComand.truncate({cascade:true});
    await User.destroy({
        where:{
            id:{
                [Op.ne]: 1,
            }
        }
    });
})();