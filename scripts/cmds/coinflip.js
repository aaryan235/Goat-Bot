const axios = require('axios');
const tracker = {};

module.exports = {
  config: {
    name: "bard",
    version: "1.0",
    author: "Samir Œ",
    countDown: 5,
    role: 0,
    longDescription: "gpt",
    category: "𝗔𝗜",
    guide: { en: "{pn} <query>" },
  },
  clearHistory: function () {
    global.GoatBot.onReply.clear();
  },
  onStart: async function ({ message, event, args, usersData }) {
    const prompt = args.join(' ');
    const userName = await usersData.getName(event.senderID);
    const userID = event.senderID;

    if (!args[0]) return message.reply('Please enter a query.');

    if (args[0] === 'clear') {
      this.clearHistory();
      const c = await clean(userID);
      if (c) return message.reply('Conversation history cleared.');
    }
    // Use command name directly from the config object
    await gpt(prompt, userID, message, userName, this.config.name.toLowerCase());
  },

  onReply: async function ({ Reply, message, event, args, getLang, usersData }) {
    const { author } = Reply;
    if (author !== event.senderID) return;
    const prompt = args.join(' ');
    const userID = event.senderID;
    const userName = await usersData.getName(event.senderID);
    await gpt(prompt, userID, message, userName, this.config.name.toLowerCase());
  }
};

async function clean(userID) {
  if (tracker[userID]) {
    delete tracker[userID];
    return true;
  }
  return false;
}

async function gpt(text, userID, message, userName, commandName) {
  if (!tracker[userID]) {
    tracker[userID] = `${userName}.\n`;
  }
  tracker[userID] += `${text}.\n`;

  try {
    const query = `- Current prompt: ${text}\n\n - Conversation:\n${tracker[userID]}\n`;
    const url = `https://apis-samir.onrender.com/liner?prompt=${encodeURIComponent(query)}`;
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resultText = response.data.answer;
    tracker[userID] += `${resultText}`;
    await message.reply(`${resultText}\n`, (error, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: commandName, author: userID
      });
    });
  } catch (error) {
    message.reply("An error occurred.");
  }
  }