let token = require('./token.js');
let db = require('./database').getInstance();
db.setModels();

let https = require('https');
let controller = require('./controller');
let TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(token, {polling: true});

// User Registration in database
bot.onText(/\/regme/, function (msg, match) {
    var option = {
        parse_mode: "Markdown",
        reply_markup: {
            one_time_keyboard: true,
            keyboard: [
                [{
                    text: "My phone number",
                    request_contact: true
                }],
                [{
                    text: "Cancel",
                }]
            ]
        }
    };
    bot.sendMessage(msg.chat.id, "Send your contact?", option).then(() => {
        bot.once("contact", async (msg) => {
            let {user_id, first_name, last_name, phone_number} = msg.contact;
            await controller.user.createUser(user_id, first_name, last_name, phone_number);
            bot.sendMessage(msg.chat.id,
                `Thank you ${first_name} ${last_name} with phone ${phone_number} for registration!`,
                {
                    reply_markup: {
                        remove_keyboard: true
                    }
                }
            );
        });
        bot.once("text", (message, metadata) => {
            bot.sendMessage(msg.chat.id, `Registration is cancel`, {
                reply_markup: {
                    remove_keyboard: true
                }
            })
        });
    });
});

// User Accept to admin
bot.onText(/\/adminadd (.+)/, async (msg, match) => {
    let id = msg.from.id;
    let isAdmin = await controller.user.findUserWithAdmin(id);
    if (isAdmin) {
        let phoneNumber = match[1];
        await controller.user.permisionAdmin(phoneNumber, true);
        bot.sendMessage(msg.chat.id, `Admin ${phoneNumber} added!`);
    } else {
        bot.sendMessage(msg.chat.id, `Sorry, ${msg.from.first_name} ${msg.from.last_name} ${msg.from.phone_number} ${msg.from.username} you don't have permisions on this operation!`);
    }
});

// User Delete from admin
bot.onText(/\/admindel (.+)/, async (msg, match) => {
    let id = msg.from.id;
    let isAdmin = await controller.user.findUserWithAdmin(id);
    if (isAdmin) {
        let phoneNumber = match[1];
        await controller.user.permisionAdmin(phoneNumber, false);
        bot.sendMessage(msg.chat.id, `Admin ${phoneNumber} deleted!`);
    } else {
        bot.sendMessage(msg.chat.id, `Sorry, ${msg.from.first_name} ${msg.from.last_name} ${msg.from.phone_number} ${msg.from.username} you don't have permisions on this operation!`);
    }
});

// All User show admin
bot.onText(/\/adminshow/, async (msg, match) => {
    let id = msg.from.id;
    let isAdmin = await controller.user.findUserWithAdmin(id);
    if (isAdmin) {
        let admins = await controller.user.findAllUserWithAdmin();
        bot.sendMessage(msg.chat.id, admins);
    } else {
        bot.sendMessage(msg.chat.id, `Sorry, ${msg.from.first_name} ${msg.from.last_name} ${msg.from.phone_number} ${msg.from.username} you don't have permisions on this operation!`);
    }
});

// Chat Registration
bot.onText(/\/chatreg/, async (msg, match) => {
    let id = msg.from.id;
    let isAdmin = await controller.user.findUserWithAdmin(id);
    if (isAdmin) {
        const chatId = msg.chat.id;
        const chatTitle = msg.chat.title;
        let chatCreated = await controller.chat.createChat(chatId, chatTitle);
        if (chatCreated) {
            bot.sendMessage(msg.chat.id, `Chat with NAME: "${chatTitle}" and ID: "${chatId}" is created!`);
        } else {
            bot.sendMessage(msg.chat.id, `Chat with NAME: "${chatTitle}" and ID: "${chatId}" is NOT created!`);
        }
    } else {
        bot.sendMessage(msg.chat.id, `Sorry, ${msg.from.first_name} ${msg.from.last_name} ${msg.from.phone_number} ${msg.from.username} you don't have permisions on this operation!`);
    }
});
// Chat Delete
// All Chat Show and send message


let options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Кнопка 1', callback_data: 'some 1'}],
            [{text: 'Кнопка 2', callback_data: 'data 2'}],
            [{text: 'Кнопка 3', callback_data: 'text 3'}]
        ]
    })
};
bot.onText(/\/createUser (.+)/, async (msg, match) => {
    let userId = msg.from.id;
    let userIdForRegistration = match[1];
    console.log('start');
    let answer = await controller.user.findUser(userId);
    console.log(answer);
    console.log('zxc');
    // if (msg.from.id === +'130059762') {
    // if (msg.from.id === +'471460368') {
    //     let id = match[1];
    //     user.createUser(id);
    //     console.log('done');
    // }
    // 642077111
});
bot.onText(/\/owu/, (msg, match) => {
    if (msg.from.id === +'130059762') {
        // if (msg.from.id === +'642077111') {
        let messagePromise = bot.sendMessage(msg.chat.id, 'Take option:', options);
        // text = 'Hello world adada google.com';
        // https.get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat1}&text=${text}`, res => {
        //     console.log('sended');
        // });
        // https.get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat2}&text=Hello+World`, res => {
        //     console.log('sended');
        // });
    }
});
bot.onText(/\/del/, async (msg, match) => {
    let id = msg.from.id;
    let isAdmin = await controller.user.findUserWithAdmin(id);
    if (isAdmin) {
       // let admins = await controller.user.findAdminsForDel();
        let currentPage = 1;
        const limitItems = 5;
        let result = await controller.user.usersPagination(currentPage,limitItems);
        let delUserOption = await getUserWithPagination(result.objects);

        bot.sendMessage(msg.chat.id,"Choice why must died",{
            reply_markup:{
                inline_keyboard: delUserOption
            }
        });
        bot.on('callback_query',async (query)=>{
            console.log('query : ',query);
            let id = msg.from.id;
            let parseData = JSON.parse(query.data);
            switch (parseData.whatDo) {
                case "delUser": {
                    let resultDel = await controller.user.deleteUserByIdTelegram(parseData.id);
                    bot.sendMessage(msg.chat.id, `You delete a : ${parseData.title}`);
                    let newPageArray = await controller.user.usersPagination(currentPage,limitItems);
                    let nextPageOption = await getUserWithPagination(newPageArray.objects);
                    bot.editMessageReplyMarkup(
                        {
                            inline_keyboard: nextPageOption
                        },
                        {
                            chat_id: query.message.chat.id,
                            message_id: query.message.message_id
                        }
                    )

                }
                    break;
                    case "nextPage":
                        if (currentPage < result.pageCount){
                            let newPageArray = await controller.user.usersPagination(++currentPage,limitItems);
                            console.log("newPageArray");
                            console.log(newPageArray);
                            let nextPageOption = await getUserWithPagination(newPageArray.objects);
                            bot.editMessageReplyMarkup(
                                {
                                    inline_keyboard: nextPageOption
                                },
                                {
                                    chat_id: query.message.chat.id,
                                    message_id: query.message.message_id
                                }
                            )
                        }
                        break;
                        case "prevPage":
                            if (currentPage>1) {
                                let newPageArray = await controller.user.usersPagination(--currentPage,limitItems);
                                console.log("newPageArray");
                                console.log(newPageArray);
                                let nextPageOption = await getUserWithPagination(newPageArray.objects);
                                bot.editMessageReplyMarkup(
                                    {
                                        inline_keyboard: nextPageOption
                                    },
                                    {
                                        chat_id: query.message.chat.id,
                                        message_id: query.message.message_id
                                    }
                                )
                            }
                                break;
                default:
                    console.log("Something went wrong in switch case");
                    bot.sendMessage(msg.chat.id,"Something went wrong")
            }

        });
    } else {
        bot.sendMessage(msg.chat.id, `Sorry, ${msg.from.first_name} ${msg.from.last_name} ${msg.from.phone_number} ${msg.from.username} you don't have permisions on this operation!`);
    }
});
bot.onText(/\/count/, async (msg, match) =>{
    let result = await controller.user.UsersPagination(1,3);
    console.log('result');
    console.log(result);
})
bot.onText(/\/stic/, async (msg, match) =>{
    bot.sendSticker(msg.chat.id,'CAADBQADewIAAp_oJQq2s6621ylQxBYE');
    console.log('result');
    let result = await bot.getStickerSet('cindypack2');
    console.log(result);


})
bot.on("message", msg=>{
    console.log(msg);
});
/*
bot.editMessageText()*/
function getUserWithPagination(users) {
    let navigation = [
        {
            text: `<<`,
            callback_data: JSON.stringify(
                {
                    id: null,
                    title: null,
                    whatDo : 'prevPage'
                })
        },
        {
            text: `>>`,
            callback_data: JSON.stringify(
                {
                    id: null,
                    title: null,
                    whatDo : 'nextPage'
                })
        },
    ]

    let delUserOption = users.map(item=>{
        return [
            {
                text: `Delete ${item.first_name} ${item.last_name?item.last_name:""} ${item.phone_number}`,
                callback_data: JSON.stringify(
                    {
                        id: item.data_id,
                        title: `${item.first_name} ${item.last_name?item.last_name:""}`,
                        whatDo : 'delUser'
                    })
            }
        ]
    });
    delUserOption.push(navigation);
    return delUserOption;
}
