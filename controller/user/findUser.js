const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid').v1();

const database = require('../../database').getInstance();

module.exports = async (userId) => {
    try {
        const UserModel = database.getModel('User');
        let findedUser = await UserModel.findOne({where: {data_id: userId}});
        if (findedUser.data_id !== userId) {
            throw new Error('error')
        }
        console.log('finded');
    } catch (e) {
        console.log(e.message);
    }
};
