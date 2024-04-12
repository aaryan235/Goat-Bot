const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FABqBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACFCbVfe+dl2xKASQnrZUKbY5uI80UjbTf1kLYFkkACaVeJh0C95K+V5PrbAo+JZctTJe8qdeCqh/ARxj9f9MfXrCHmHHusGojsSM58s+ikEQsSUpiVxOYGBBGwUFYWbRcLbhfR3tayqvYrjQYPohKWLXRmWwtD4ewZdxXp50jRk2/1jqQYsGAjiOTR2IWvr/PsV3uJTCSDwj4pDeRfBFp6i5NoXALjp9z7d+TxuxKQp5ES+KnZpiwK97Mec4W68VkwEVn1MoVXthsU4Ff+jo2oDstLeVNJJ8LMQweMBdC8Kx5lGg83xOW3ocqu8EDKNdLoFgSwXGuAtU1IzNr9DRGZ80SyZeRzgl/Y7cPiYg2LcctZG3IlQ98Ee6lB8ic6CL4UuYsNTZ7VzvCgfsw6b+FqBEe9U+oYgAM5WtVEtRRouvTw0KUsfJiUPOIlHdGTMl7JdTzPeiyR1kv9Wr8twsPIhbXrMN+jI3kPA6f9E8qcYl1mi1w0y4xY/WEolD9setBULQdVcTyjPy7PRA/OtV1CvYCrMOvCp0LGeQk6bZGrIb/9NLiPg7ArvDPNotK23h2avBg7lFuNr5y0OpOxjy6qJhRoYDqHT47KeLzqGftJCjoN4nQBSCIF3QwOe19dCZiQEucJ5/iOuyUCieJxShOJCmExBtfelN1nvxymbxAiHyBRLNjJROstWKBV0Bq7hz/YcE4Gj0t8t9QfbeIQgJXiXNoiYcn/oWkcBya/TqSergJ1U/2KSc+iQUFVmU+ZdKy9Z167hibHWdQpEtQD2PpJp8IWCfS9Z7xRogJI4OWkA/d5km3Tfm15PdAC4iPmdEFZRt1ZQUX8RCD5brauK5OdLBEOOrPgqTZ9UDHhJJ77yVZT9DuqSIcbPEEAWc8fzlsdxcuLe71sYTCl/wtrIIAKQabYqkymIqoME9WNi+j500X0fSWGnlYKfB204Sn2JryFqPK+jRwjOXPcqun1FFWcw18plwZKEIixOIPW3tXUctIkOoVNyMDelUi7Y/XLWsAvTwbnEnq3mbcepIXRrNX46vNVhwfxMlab7EECQyQ2s4gF74ZudIE1BSKroGat9JROV7wHc8QbvnP35c/lLRX+M9VkMuGZG5MUZiS/wTNpFgtb2x3b0UPon3hXUgp0+cuzDgP2Wuv0XYyYTAIRajrcTEs0xfHEiW5Kla0yPIHvrqg2NJuC7BhKHrjedxLEd+1Q2k//8UcR2WOKsthpWVfWhh+qS+KaTe/UpcxN6AHEpsLkV9JEnWNsbWnRLYaMboov2q+ONaYG8vskZdXbtJzd70e2kDsSIUHmS5Vo3+2V+HZsBHwP2AkiwPfEqLXpnB0AjTeVx8wT16Zmu9BKq3zSR4Ef0eY1B43rmWFH+f0KBJ5zdsEZg5dIWMeMmXfVWwPe3fISgIOuaXOo0j+aLk8ZoCCRQAauEqyDPG0S1zeLw9L0NLuK1Kw+w=";
const _U = "1I8PUaxPdbwudDG39S87cqrcMwsaEIr2zrN7scP5ceuCKbMwvkj5PBjxhtwbQ9nPuq7HTUikbxcbkQP9P8u7ocWSkbKsDCW6pW63BjCawuVL9Qo-vtG2EE4ytFXG8Pl_kzHb7p9nGTiFbW7Nb77UQ5W6gNGP1l7_HNQwBTK7R-sDLAp6_2UFWgRD5eIsgeKV6LGGC0KaznN_d6OneFyLb_w";

module.exports = {
  config: {
    name: "dalle",
    version: "1.0.2",
    author: "Samir Œ ",
    role: 0,
    countDown: 5,
    shortDescription: { en: "dalle3 image generator" },
    longDescription: { en: "dalle3 is a image generator powdered by OpenAi" },
    category: "𝗔𝗜",
    guide: { en: "{prefix}dalle <search query>" }
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");

    try {
      const res = await axios.get(`https://apis-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(prompt)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("response received but imgurl are missing ", event.threadID, event.messageID);
        return;
      }

      const imgData = [];

      for (let i = 0; i < Math.min(4, data.length); i++) {
        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
        body: `Here's your generated image`
      }, event.threadID, event.messageID);

    } catch (error) {
      api.sendMessage("Can't Full Fill this request ", event.threadID, event.messageID);
    }
  }
};