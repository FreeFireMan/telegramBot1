const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid').v1();

const database = require('../../database').getInstance();

module.exports = async (chat_id) => {
    try {
        console.log("deleteUserByIdTelegram :");
        console.log(chat_id);
        const ChatModel = database.getModel('Chat');
        let result = await ChatModel.destroy({where: {chat_id}});
        if (result) {
            console.log(`User ${chat_id} destroyed!!!`);
        } else {
            console.log(`Something went wrong in delete user ${chat_id}`);
        }
    } catch (e) {
        console.log(e.message);
    }
};