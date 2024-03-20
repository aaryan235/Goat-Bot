const axios = require('axios');

module.exports = {
  config: {
    name: "imgur",
    version: "1.0",
    author: "Aryan Chauhan",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Upload image or video to Imgur"
    },
    longDescription: {
      en: "Upload image or video to Imgur by replying to photo or video"
    },
    category: "tools",
    guide: {
      en: "{p}imgur reply any videos or photos"
    }
  },

  onStart: async function ({ api, event }) {
    const link = event.messageReply?.attachments[0]?.url;
    if (!link) {
      return api.sendMessage('⛔ 𝐈𝐍𝐕𝐀𝐋𝐈𝐃 𝐔𝐒𝐄\n\n➪ Please reply to an image or video.', event.threadID, event.messageID);
    }

    try {
      const res = await axios.get(`https://aryans-apis-hub.onrender.com/api/imgur?link=${encodeURIComponent(link)}`);
      const uploaded = res.data;

      if (uploaded.status === "success") {
        return api.sendMessage(`👑 𝗖𝗠𝗗 𝗦𝗬𝗦𝗧𝗘𝗠\n\n✨ 𝐈𝐦𝐠𝐮𝐫 𝐋𝐢𝐧𝐤\n➪ ${uploaded.url}`, event.threadID,
event.messageID);
      } else {
        return api.sendMessage('Failed to upload image or video to Imgur.', event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage('Failed to upload image or video to Imgur.', event.threadID, event.messageID);
    }
  }
};