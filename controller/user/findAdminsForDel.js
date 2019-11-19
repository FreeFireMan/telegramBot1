const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid').v1();

const database = require('../../database').getInstance();

module.exports = async () => {
    try {
        const UserModel = database.getModel('User');
        let findedUser = await UserModel.findAll({where: {is_admin: true}});
        let adminsAre = [];
        for (let i = 0; i < findedUser.length; i++) {
            adminsAre.push({
                first_name : findedUser[i].dataValues.first_name,
                last_name : findedUser[i].dataValues.last_name,
                phone_number : findedUser[i].dataValues.phone_number,
                user_id: findedUser[i].dataValues.data_id
            })
        }
        return adminsAre;
    } catch (e) {
        console.log(e.message);
    }
};