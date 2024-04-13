const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin"],
    version: "1.0",
    author: "Combined Script",
    role: 0,
    countDown: 60,
    shortDescription: {
      en: "Search for images on Pinterest"
    },
    category: "image",
    guide: {
      en: "{prefix}pinterest cat -5"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const keySearch = args.join(" ");
      const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
      if (!keySearchs) {
        throw new Error("Please follow this format:\n-pinterest cat -4");
      }
      let numberSearch = parseInt(keySearch.split("-").pop().trim()) || 1;
      numberSearch = Math.min(Math.max(numberSearch, 1), 12); // Adjusted to ensure the range is between 1 and 12

      let imgData;
      let fetchedImageUrls = [];

      // Attempt to fetch images from the first API
      try {
        const { data } = await axios.get(`https://api-samirxyz.onrender.com/api/Pinterest?query=${encodeURIComponent(keySearchs)}&number=${numberSearch}&apikey=global`);

        if (Array.isArray(data) && data.length > 0) {
          imgData = await Promise.all(data.slice(0, numberSearch).map(async (item, i) => {
            const imageUrl = item;
            if (!fetchedImageUrls.includes(imageUrl)) {
              fetchedImageUrls.push(imageUrl);

              try {
                const { data: imgBuffer } = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const imgPath = path.join(__dirname, 'tmp', `${i + 1}.jpg`);
                await fs.outputFile(imgPath, imgBuffer);
                return fs.createReadStream(imgPath);
              } catch (error) {
                console.error(error);
                return null;
              }
            } else {
              return null;
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching images from first API:", error);
      }

      // If no images were fetched from the first API, try the second API
      if (!imgData) {
        try {
          const { data } = await axios.get(`https://celestial-dainsleif-v2.onrender.com/pinterest?pinte=${encodeURIComponent(keySearchs)}`);

          if (Array.isArray(data) && data.length > 0) {
            imgData = await Promise.all(data.slice(0, numberSearch).map(async (item, i) => {
              const imageUrl = item.image;
              if (!fetchedImageUrls.includes(imageUrl)) {
                fetchedImageUrls.push(imageUrl);

                try {
                  const { data: imgBuffer } = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                  const imgPath = path.join(__dirname, 'tmp', `${i + 1}.jpg`);
                  await fs.outputFile(imgPath, imgBuffer);
                  return fs.createReadStream(imgPath);
                } catch (error) {
                  console.error(error);
                  return null;
                }
              } else {
                return null;
              }
            }));
          }
        } catch (error) {
          console.error("Error fetching images from second API:", error);
        }
      }

      // If still no images, try the third API
      if (!imgData) {
        try {
          const { data } = await axios.get(`https://pin-kshitiz.vercel.app/pin?search=${encodeURIComponent(keySearchs)}`);

          if (Array.isArray(data.result) && data.result.length > 0) {
            imgData = await Promise.all(data.result.slice(0, numberSearch).map(async (imageUrl, i) => {
              if (!fetchedImageUrls.includes(imageUrl)) {
                fetchedImageUrls.push(imageUrl);

                try {
                  const { data: imgBuffer } = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                  const imgPath = path.join(__dirname, 'tmp', `${i + 1}.jpg`);
                  await fs.outputFile(imgPath, imgBuffer);
                  return fs.createReadStream(imgPath);
                } catch (error) {
                  console.error(error);
                  return null;
                }
              } else {
                return null;
              }
            }));
          }
        } catch (error) {
          console.error("Error fetching images from third API:", error);
        }
      }

      if (!imgData || imgData.length === 0) {
        throw new Error("No images found.");
      }

      await api.sendMessage({
        attachment: imgData.filter(img => img !== null),
        body: `Here are the top ${imgData.length} image results for "${keySearchs}":`
      }, event.threadID, event.messageID);

      await fs.remove(path.join(__dirname, 'tmp'));
    } catch (error) {
      console.error("Error in Pinterest bot:", error);
      if (error.message === "No images found.") {
        return api.sendMessage("(⁠ ⁠･ั⁠﹏⁠･ั⁠) can't fetch images, api dead.", event.threadID, event.messageID);
      } else {
        return api.sendMessage(`📷 | ${error.message}`, event.threadID, event.messageID);
      }
    }
  }
};