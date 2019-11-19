const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid').v1();

const database = require('../../database').getInstance();

module.exports = async (page,limit) => {
    try {

        const UserModel = database.getModel('User');
        const result = await UserModel.count({});
        const pageCount = result/limit;

        if (result) {
            console.log(`pageCount ${pageCount} `);
            return result;
        } else {
            console.log(`Something went wrong in delete user ${user_id}`);
        }
    } catch (e) {
        console.log(e.message);
    }
};