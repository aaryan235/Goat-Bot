const axios = require('axios');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "bing",
    aliases: ["dalle"],
    version: "2,0",
    author: "RUBISH",
    countDown: 5,
    role: 0,
    longDescription: {
      en: "Latest DALL·E 3 image generator",
    },
    guide: {
      en: "{pn} 'prompt' ",
    },
    category: "𝗔𝗜-𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗",
  },
  onStart: async function ({ message, args }) {
    try {
      if (args.length === 0) {
        await message.reply("⚠️ | Please provide a prompt.");
        return;
      }

      const prompt = args.join(" ");
      const encodedPrompt = encodeURIComponent(prompt);
      const Key = "rubish69";
      const cookies = [
"1epylNUo5bI6a_yCaql1XwiMEi9UQmgbM_HJY-a2tGH71vjCsMqS69ptFkKTcnaxL4TEkrMC8-42C8RKXJxXlvF3_K8mf8EoCpWJNKWeYHgNIhcIFakBim06VZBT0JTK4i03FcSMRlpwvRazhKle7rIjQK1JiF06IccLdERyCv2PanL5FZl7y213ApFNH8UUD-blRxokbt7h-2JqtDjKczw"
]; 

      const randomCookie = cookies[Math.floor(Math.random() * cookies.length)];

      const apiURL = `https://dall-e-3-rubish.onrender.com/api/gen-img-url?prompt=${encodedPrompt}&cookie=${randomCookie}&apiKey=${Key}`;

      const startTime = Date.now();
      const processingMessage = await message.reply(`
⏳ | Processing your imagination

Prompt: ${prompt}

Please wait a few seconds...`);

      const response = await axios.get(apiURL);

      const endTime = Date.now();
      const processingTimeInSeconds = ((endTime - startTime) / 1000).toFixed(2);

      const data = response.data;
      if (!data.imageLinks || data.imageLinks.length === 0) {
        if (data.errorMessage === "Invalid API key") {
          await message.reply("⚠️ | Invalid API key. Please check your API key and try again.");
        } else {
          await message.reply(`
⭕ | No images found for the 

❏ | prompt: ${prompt}. 

❏ | Please try again.`);
        }
        return;
      }

      const attachment = await Promise.all(data.imageLinks.map(async (imgURL) => {
        const imgStream = await getStreamFromURL(imgURL);
        return imgStream;
      }));

      await message.reply({
        body: `
✅ | Here are the images for..

❏ | Prompt: "${prompt}" 

❏ | Processing Time: ${processingTimeInSeconds}s`,
        attachment: attachment,
      });

      message.unsend((await processingMessage).messageID);
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 401) {
        await message.reply("⚠️ | Unauthorized your API key \n\nContact with Rubish for a new apikey");
      } else if (error.response && error.response.data) {
        const responseData = error.response.data;

        if (responseData.errorMessage === "Pending") {
          await message.reply("⚠️ | This prompt has been blocked by Bing. Please try again with another prompt.");
        } else if (typeof responseData === 'object') {
          const errorMessages = Object.entries(responseData).map(([key, value]) => `${key}: ${value}`).join('\n');
          await message.reply(`⚠️ | Server error details:\n\n${errorMessages}`);
        } else if (error.response.status === 404) {
          await message.reply("⚠️ | The DALL·E 3 API endpoint was not found. Please check the API URL.");
        } else {
          await message.reply(`⚠️ | Rubish dalle -3 server busy now\n\nPlease try again later`);
        }
      } else {
        await message.reply("⚠️ | An unexpected error occurred. Please try again later.");
      }
    }
  }
};