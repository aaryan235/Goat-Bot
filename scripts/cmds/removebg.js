const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: 'removebg',
    aliases: ['rbg'],
    version: '2.0',
    author: 'RUBISH',
    countDown: 5,
    role: 0,
    shortDescription: 'Remove background from an image',
    longDescription: 'Removes the background from the provided image using the Remove.bg API.',
    category: 'media',
    guide: '{pn} [imageURL]',
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    const removeBgApiUrl = 'https://removebg-rubish.onrender.com/rubishapi-removebg';

    let imageUrl = args.shift();

    if (!imageUrl && event.type === 'message_reply' && event.messageReply.attachments) {
      imageUrl = event.messageReply.attachments[0].url;
    }

    if (!imageUrl) {
      return api.sendMessage('❌ | Please provide an image URL or reply to an image.', threadID, messageID);
    }

    try {
      api.sendMessage('⏳ | Removing background from the image...', threadID, messageID);

      const response = await axios.get(removeBgApiUrl, {
        params: {
          imageUrl: imageUrl,
          apikey: 'rubish69', // Replace 'rubish69' with your actual API key
        },
        responseType: 'arraybuffer',
      });

      const currentDir = path.resolve(__dirname);
      const imagePath = path.join(currentDir, 'cache', 'background_removed_image.png');

      fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

      api.sendMessage(
        { body: '✅ | Background removed from the image.', attachment: fs.createReadStream(imagePath) },
        threadID,
        () => fs.unlinkSync(imagePath),
        messageID
      );
    } catch (error) {
      console.error(error.message);
      return api.sendMessage('❌ | Something went wrong while removing the background. Please try again later.', threadID, messageID);
    }
  },
};
