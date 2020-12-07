const Discord = require('discord.js');
const bot = new Discord.Client();

const fetch = require('node-fetch');
require('dotenv').config();

// environment variables add them later
const prefix = process.env.PREFIX;
const giphyToken = process.env.GIPHY_TOKEN;
const token = process.env.DISCORD_TOKEN;

const password = process.env.PASSWORD;

// My expressions
//const exps = require('./exps.js');
const scraper = require('./scraper.js');

// getting the giphy sdk to work, I think I could use the API instead
let GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient(giphyToken);

// doing the "kremala" thing
// let onGame = false;

// runs only once when the bot starts
bot.once('ready', () => {
    console.log('Xasiwths mphke sto mathima...');
    bot.user.setActivity('with tornos', { type: 'PLAYING' });
});

// simple messages
bot.on('message', message => {

    // make him not reply on his own messages
    if (message.author.id == '784899005985325086') {
        return;
    }

    // kalhmera ?
    if (/(kalhmera|kalumera)\s*(kurie|kyrie)?\s*?/gi.test(message.content)) {
        message.reply("Kalhmera paidia");
    }

    // bot's activity 
    if (message.content.startsWith(`${prefix} set`)) {
        // configuring the arguements
        let args = message.content.split('_');
        if (args[1] == 'help') {
            message.channel.send('-set_action_thing \n actions: PLAYING, WATCHING, LISTENING');
        } else {
            bot.user.setActivity(args[2], { type: args[1] });
        }
    }

    // na kanw to botaki na stelnei dika mou mnmta voithia
    if (message.content == `${prefix} message_help`) {

        message.channel.send(`${prefix} message_actualMessage_channelID_serverID or \n ${prefix} message_gamers_actualMessage`);

    } else if (message.content.startsWith(`${prefix} message_gamers`)) {

        let arts = message.content.split('_');
        bot.guilds.get('598644805865832467').channels.get('598644806847168697').send(arts[2]);

    } else if (message.content.startsWith(`${prefix} message`)) {

        let args = message.content.split('_');
        bot.guilds.get(args[3]).channels.get(args[2]).send(args[1]);

    }

    // reactions 
    // egw  80% pithanothta na antidrasei
    if (message.author.id == '396103155672154123') {

        let chance = Math.floor((Math.random() * 10) + 1);

        if (chance >= 1 && chance < 4) {
            message.react('👍');
        } else if (chance >= 4 && chance <= 5) {
            message.react('❤️');
        } else if (chance == 6) {
            message.react('😍');
        } else if (chance == 7) {
            message.react('😂');
        } else if (chance == 8) {
            message.react('🔫');
        }
    }
});

// messages with simple fetching
bot.on('message', async message => {

    // make him not reply on his own messages
    if (message.author.id == '784899005985325086') {
        return;
    }

    if (message.content == `${prefix} ta nea`) {
        scraper.scrap('nea', message);
    }

    if (message.content == `${prefix} tis anakoinwseis`) {
        scraper.scrap('ana', message);
    }

    if (message.content == `${prefix} tis ekdhlwseis`) {
        scraper.scrap('ekd', message);
    }

});

bot.on('message', message => {

    // make him not reply on his own messages
    if (message.author.id == '784899005985325086') {
        return;
    }

    // sending available meme formats
    if (message.content == `${prefix} memesf`) {
        // fetching the memes and filtering those with the 2 boxes
        fetch("https://api.imgflip.com/get_memes")
            .then(response => response.json())
            .then(data => {
                let memes = data.data.memes.filter(meme => meme.box_count == 2);
                let msg1 = '';
                for (let i = 0; i < 40; i++) {
                    msg1 += memes[i].name + "  --id:" + memes[i].id + "\n";
                }
                let msg2 = '';
                for (let i = 40; i < memes.length; i++) {
                    msg2 += memes[i].name + "  --id:" + memes[i].id + "\n";
                }
                message.channel.send(msg1);
                message.channel.send(msg2);
            })
            .catch(err => console.log(err));
    } else if (message.content == `${prefix} memes-help`) {

        message.channel.send(`${prefix} meme-id-text1-text2 or \n${prefix} meme-id-text1-text2-channelID-serverID or \n${prefix} meme-id-text1-text2-gamers`);

    } else if (message.content.startsWith(`${prefix} meme`)) {

        // doing the meme by this stupid website
        let msg = message.content.split('-');
        let id = msg[1];
        let text0 = msg[2];
        let text1 = msg[3];
        let channelID = msg[4];
        let serverID = msg[5];
        fetch(`https://api.imgflip.com/caption_image?template_id=${id}&username=danikas&password=${password}&text0=${text0}&text1=${text1}`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let url = data.data.url;

                if (channelID == 'gamers') {
                    bot.guilds.get('598644805865832467').channels.get('598644806847168697').send('lol', {
                        files: [url]
                    })
                } else if (channelID === undefined || serverID === undefined) {
                    message.channel.send("LOL...", {
                        files: [url]
                    });
                } else {
                    bot.guilds.get(serverID).channels.get(channelID).send('lol', {
                        files: [url]
                    });
                }
            })
            .catch(err => {
                console.log(err);
                message.channel.send('Ti les mwre ... Grapse kalutero mnm');
            });
    }
});

bot.on('message', message => {
    if (message.content == `${prefix} xasiwth`) {
        message.channel.send(`Eimai akoma under construction mono ta parakatw douleuoun: \n ${prefix} memesf \n ${prefix} meme-id-text1-text2 \n ${prefix} meme-id-text1-text2-channelID-serverID \n ${prefix} ta nea \n ${prefix} tis anakoinwseis \n ${prefix} tis ekdhlwseis`);
    }
});


bot.login(token); //it's gonna work