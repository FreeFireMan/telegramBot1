const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid').v1();

const database = require('../../database').getInstance();

module.exports = async (user_id) => {
    try {
        console.log("deleteUserByIdTelegram :");
        console.log(user_id);
        /*const UserModel = database.getModel('User');
        await UserModel.delete({is_admin: isAdmin}, {where: {phone_number: phoneNumber}});
        let findedUser = await UserModel.findOne({where: {phone_number: phoneNumber}});
        if (findedUser.dataValues.is_admin === true) {
            console.log(`User: "${findedUser.dataValues.first_name} ${findedUser.dataValues.last_name}" with number: ${findedUser.dataValues.phone_number} - is a Admin`);
        } else if (findedUser.dataValues.is_admin === false) {
            console.log(`User: "${findedUser.dataValues.first_name} ${findedUser.dataValues.last_name}" with number: ${findedUser.dataValues.phone_number} - is NOT Admin`);
        }*/
    } catch (e) {
        console.log(e.message);
    }
};