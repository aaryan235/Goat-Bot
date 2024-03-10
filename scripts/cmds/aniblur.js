module.exports = {
  config: {
    name: "reactunsend",
    version: "1.0",
    author: "Samir Œ",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Toggle unsend on reaction"
    },
    longDescription: {
      en: "Toggle unsend on reaction and react with 🙂 to unsend messages."
    },
    category: "Settings",
    guide: {
      en: "{prefix}unsend [on/off]"
    }
  },

  onStart: async function ({ api, event, args, threadsData, getLang }) {
   
  },

  onChat: async function ({ api, event, message, threadsData }) {

      global.GoatBot.onReaction.set(event.messageID, {
        type: "🙂",
        commandName: "reactunsend",
        messageID: event.messageID,
        authorID: event.senderID
      });
    },
  

  onReaction: async function ({ message, threadsData, event }) {
    const { type, commandName, messageID, authorID } = global.GoatBot.onReaction.get(event.messageID) || {};

    if (type === "🙂" && commandName === "reactunsend" && event.userID === authorID) {
      await message.unsend(event.messageID);
    }
      global.GoatBot.onReaction.set(event.messageID, {
        type: "🙂",
        commandName: "reactunsend",
        messageID: event.messageID,
        authorID: event.senderID
      });
    },
  
};