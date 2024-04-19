const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FAByBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACEKUtx5SsBM8MARpBhc2H76ysPm3V97z+HO2SI4oU3WQeR8umAwpa/ChC699aeiV7IiZjuDWeD/dwbOw5TzDcuoCujdrKMwZp2/cQOEYZGIWAjrzEDEkbZH5M4IoBLVAXiaLCjm4+lS/KOV0qxAbdmred83zBb0u8Zp024BCZ/B6j/EBSoPMsgi+/Rr5S5rFRF/eURxoTR3X5CH2AK6VNtf47THPS1ysnlRJU1K0O8hMDAQA9CUYGAjZ/+VKSTvpxGayZltLrSsTEpVqqEzY15+wJG6wsF670I4yUBILGK450XsUm6cBpOcbZCF8+97GTVmcgdQy1BHuxgmJ4232DbgWvcgDJtKGpY0rkmSUG7vG1b8Ae0lusArxzMR7PUZOlw0QvSwbCZpXaHv+4iOio4IvGlb3RNJjvVY1/Y4vbhYUKfXjPLEpTunmVctutpMXBdw9vLqz8Av3XJXsF+URofcXqNGTIyzEH8nXceIoKU+O9EkYVhevUXuxyGXtSQ3/vGM7wYMASs9c4GS/NAT/0NxgwSwq6brRO1HLVv9pdW0oWL8vQsrKNdnCv1ujNCRy/wHulfBnLjRpHQAQolrvlkOilnO7EQekM0JO2lnFSm6XO7wy/z3HH/p5eYNF7lDe4OS2pMG668fK66qfeIZScnBIjQolO4lmeHRpRtn0A4Dfp/5GGlJAIlbQ+9J5kJiCfrVBNV6c0GxwwLGZCM/vzljm2YVWerxgiRXmEYiLKHkj54qjMZTlaE4WFqcbWZCd6j4exnDGbVjaeAo46o7U7y7wTy2OKcUY1ozOucrPMyLh+3r4ECj0T8Jlc7jRuhj9E/7nsllZHjcvvfYMUxcLIlVE17gh7fbGkxO6uaBlSlOKP7/vxVog5reVrIONBb/ptph5WZTHjXsJCK18yAM9YE7MOmf+2ux/vy0Ct3hZl8LRPWdXh/2Y/plm2vQnXpHcIsFw6slg/ehxa/EERDXcHji3ie4ldumQd8VBCMpBkvLpk61qIr/Bm7whcd26LxUIcelnNVU5kK9SXTU4um2pX1FnCnFy0uH09kLieRZGYoT3mnA6/YybkjlYxcfxVJ149FtGH2nGZdQuTzSbwjMrFc+mrNzDAmfT9qptMflmfA/epz4Bk27aHpjbH21/DkNcQi4XWZ18ccp74q/KGOHx1+IbQ+ocD3xHnXkdRCyRvfIjK+7b1tY8QWY68d3oUdPrO29KapWK+z7wymUy9PbCyM7BcPmcQADXzmi5bZGOHhl+pHA0Ew2J8PrfknW3kwezU2OYyIEMdnmVusuiTCaQPysrYqMaF+wOWfyMKHtc6tW/TjXGLNNfYDVJWdEwicPks7DifJuKKlgWApK1tvsY6HMIRr+s8V9qJiBIwwtyduPl3PZ1Ex5AcOdvJY9ZXwfieI9I6uYyOWfAutiwUpWT2Dr7HJhmqyu/otvFFAD8qFUlw6VhJcE76vr+9d0rww0J4Q==";
const _U = "18vgxHMWRzQ3D935soJ1JYL92THXV4xFA_co3dVR8WXZwzy-gz3qyrBHYKKf0ww4ryHMhTg-33J6kGSBAVXiECQNyoc3Smx8AEzQy2cerAlOYSvL8XyJ_0A2Opw6VcwDT9eWz9oC9u2V9FVbK8uLZoH5fQMuzgv_Hj9rG5o3sFxRwnI-4eweTbww3brMHPSt_kv5WGgymg2V2kgwOc80RiQ";

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