const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid').v1();

const database = require('../../database').getInstance();

module.exports = async () => {
    try {
        const ChatModel = database.getModel('Chat');
        const chatsArray = await ChatModel.findAll()
                .map(i=>i.dataValues);
        return chatsArray;
    } catch (e) {
        console.log(e.message);
    }
};
