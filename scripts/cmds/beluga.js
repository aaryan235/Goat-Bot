const axios = require('axios');
const fs = require('fs');

module.exports.config = {
  name: "genix", 
  version: "1.0.0", 
  role: 2,
  author: "Dipto",
  description: "prompt to photo, photo to photo",
  usePrefix: false, 
  category: "image generator", 
  guide: {en:"prompt | reply a photo"},
  coolDowns: 10
};

module.exports.onReply = async function ({ api, event , args}) {
  if (event.type == "message_reply") {
    let mod = args[0] || "1";
    let prompt = args.slice(1).join(" ").toLowerCase() || "anime type";
    const url = event.messageReply.attachments[0].url;
    if (isNaN(url)) {
      try {
        api.setMessageReaction("🐤", event.messageID, (err) => {}, true);
        const response = await axios.get(`https://noobs-api.onrender.com/dipto/genix?url=${encodeURIComponent(url)}&prompt=${encodeURIComponent(prompt)}&model=${mod}`);
        const data = response.data.data;
        await api.sendMessage({ 
          body: "Here's your photo", 
          attachment: await global.utils.getStreamFromURL(data)
        }, event.threadID, (error, info) => {
global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: 'reply',
            messageID: info.messageID,
            author: event.senderID,
            link: data
          });
        }, event.messageID);
      } catch (error) {
        console.log(error);
      }
    }
  }
};

module.exports.onStart = async function ({ api, args, event }) {
  try {
    let mod = args[0] || "1";
    let prompt = args.slice(1).join(" ").toLowerCase() || "anime type";
    if (event.type === "message_reply") {
      const url = event.messageReply.attachments[0].url;
const wait = api.sendMessage("wait baby <😘", event.threadID);
      try {
        const response = await axios.get(`https://noobs-api.onrender.com/dipto/genix?url=${encodeURIComponent(url)}&prompt=${prompt}&model=${mod}`);
        const link = response.data.data;
        await api.sendMessage({ 
          body: "Here's your photo", 
          attachment: await global.utils.getStreamFromURL(link)
        }, event.threadID, (error, info) => {
global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: 'reply',
            messageID: info.messageID,
            author: event.senderID,
            link: link
          });
        }, event.messageID);
        api.unsendMessage(wait.messageID);
      } catch (e) {
        console.log(e);
      }
    } else if (prompt) {
      const wait = api.sendMessage("wait baby <😘", event.threadID);
      const response = await axios.get(`https://noobs-api.onrender.com/dipto/genix?prompt=${encodeURIComponent(prompt)}`);
      const link = response.data.data;
      const filePath = __dirname + `/cache/jini.png`;
      const respo = await axios.get(link, { responseType: 'stream' });
      const writer = fs.createWriteStream(filePath);
      respo.data.pipe(writer);
      writer.on('finish', async () => {
        await api.sendMessage({ 
          body: "Here's your photo", 
          attachment: fs.createReadStream(filePath)
        }, event.threadID, (error, info) => {
global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: 'reply',
            messageID: info.messageID,
            author: event.senderID,
            link: link
          });
        }, event.messageID);
        api.unsendMessage(wait.messageID);
        fs.unlinkSync(filePath);
      });
    }
  } catch (error) {
    console.error(`Failed to generate: ${error.message}`);
    api.sendMessage(`${error.message}.\nAn error`, event.threadID, event.messageID);
  }
};