const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid').v1();

const database = require('../../database').getInstance();

module.exports = async (page,lim) => {
    try {

        const ChatModel = database.getModel('Chat');
        const count = await ChatModel.count();
        const pageCount = Math.ceil(count/lim);
        const pageArray = await ChatModel
            .findAll({limit: lim,offset: ((page-1)*lim)})
            .map(i=>i.dataValues);
        console.log("pageArray");
        console.log(pageArray);
        return {
                pageCount: pageCount,
                objects: pageArray
            }
    } catch (e) {
        console.log(e.message);
    }
};