const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid').v1();

const database = require('../../database').getInstance();

module.exports = async (userId, isAdmin) => {
    try {
        const UserModel = database.getModel('User');
        await UserModel.update({is_admin: isAdmin}, {where: {data_id: userId}});
        let findedUser = await UserModel.findOne({where: {data_id: userId}});
        if (findedUser.dataValues.is_admin === true) {
            console.log(`User: "${findedUser.dataValues.first_name} ${findedUser.dataValues.last_name}" with number: ${findedUser.dataValues.phone_number} - is a Admin`);
        } else if (findedUser.dataValues.is_admin === false) {
            console.log(`User: "${findedUser.dataValues.first_name} ${findedUser.dataValues.last_name}" with number: ${findedUser.dataValues.phone_number} - is NOT Admin`);
        }
    } catch (e) {
        console.log(e.message);
    }
};
