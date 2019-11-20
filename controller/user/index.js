const createUser = require('./createUser');
const findUser = require('./findUser');
const permisionAdmin = require('./persmisionAdmin');
const findUserWithAdmin = require('./findUserWithAdmin');
const findAllUserWithAdmin = require('./findAllUsersWithAdmin');
const findAdminsForDel = require('./findAdminsForDel');
const deleteUserByIdTelegram = require('./deleteUserByIdTelegram');
const usersPagination = require('./usersPagination');

module.exports = {
    createUser,
    findUser,
    permisionAdmin,
    findUserWithAdmin,
    findAllUserWithAdmin,
    findAdminsForDel,
    deleteUserByIdTelegram,
    usersPagination
};
