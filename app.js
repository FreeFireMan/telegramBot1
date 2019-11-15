let db = require('./database').getInstance();
db.setModels();
let https = require('https');

let controller = require('./controller');

let TelegramBot = require('node-telegram-bot-api');
let token = '1006075112:AAFGjaFlDEFcOkgNmlJN4CIohcANkv-dqD8';
const chat1 = '-362169744';
const chat2 = '-348731507';

const bot = new TelegramBot(token, {polling: true});

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
            let userId = msg.contact.user_id;
            let firstName = msg.contact.first_name;
            let lastName = msg.contact.last_name;
            let phoneNumber = msg.contact.phone_number;
            await controller.user.createUser(userId, firstName, lastName, phoneNumber);
            bot.sendMessage(msg.chat.id,
                `Thank you ${firstName} ${lastName} with phone ${phoneNumber} for registration!`,
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


bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

let options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Кнопка 1', callback_data: 'some 1'}],
            [{text: 'Кнопка 2', callback_data: 'data 2'}],
            [{text: 'Кнопка 3', callback_data: 'text 3'}]
        ]
    })
};
bot.onText(/\/hello (.+)/, (msg, match) => {
    // console.log(msg.from);
    // console.log(msg.chat);
    bot.sendMessage(msg.chat.id, match[1]);
    controller.user.addAdminUser(130059762, true);
});
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
