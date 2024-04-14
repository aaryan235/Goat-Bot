 const axios = require("axios");

async function generateImage(prompt, aspectRatio) {
  try {
    const response = await axios({
      method: "post",
      url: "https://niji-v1lk.onrender.com/mj3",
      data: {
        prompt,
        aspectRatio
      },
      responseType: 'stream'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

const styles = [
  "Default Style",
  "Anime",
  "Abstract",
  "Comic Book",
  "Expressionist",
  "Watercolor",
  "Manga",
  "Flat",
  "Minimalist",
  "Hyperrealism",
  "Grunge",
  "Film Noir",
  "Cybernetic",
  "Alien Landscape",
  "Pixel Art",
  "Retro Arcade Style",
  "Minecraft Style",
  "Shadow Box",
  "Paper Quilling",
  "Origami"
];

module.exports = {
  config: {
    name: "mj3",
    version: "1.2",
    author: "Jsus",
    longDescription: {
      en: "Midjourney V3 Alternative.",
    },
    category: "gen",
    guide: {
      en: "{pn} <prompt>\nAdd ratio:\n{pn} prompt --ar 12:6\nSelect Model:\n{pn} prompt --v 3\n\nAvailable Models:\n1. Midjourney V3\n2. Anime\n3. Paint Art\n4. Comic\n5. Pop Painting\n6. Watercolor\n7. Manga\n8. Simplistic\n9. Minimalistic\n10. Realistic\n11. Old Frame\n12. Noir Movie\n13. Cyber Art\n14. Hexo Style\n15. Pixel\n16. Arcade\n17. Minecraft\n18. Paper Box\n19. Wood Art\n20. Origami"
    },
  },

  onStart: async function ({ message, args, event }) {
    const prompt = args.join(" ");
    message.reaction("⏳", event.messageID);

    if (!prompt) {
      return message.reply("Please provide a prompt.");
    }

    const aspectRatioMatch = prompt.match(/--ar (\d+:\d+)/);
    const aspectRatio = aspectRatioMatch ? aspectRatioMatch[1] : '1:1';

    let style = 'Default Style';
    if (prompt.includes('--niji')) {
      style = 'Anime';
    } else {
      const versionMatch = prompt.match(/--v(\s?)(\d+)/);
      if (versionMatch) {
        const versionNumber = parseInt(versionMatch[2]);
        if (versionNumber >= 1 && versionNumber <= styles.length) {
          style = styles[versionNumber - 1];
        }
      }
    }

    if (!styles.includes(style)) {
      style = 'Default Style';
    }

    try {
      const mj = await generateImage(prompt, aspectRatio);
      message.reply({attachment: mj});
      message.reaction("✅", event.messageID);
    } catch (error) {
      console.error(error);
      message.reaction("❌", event.messageID);
      return message.reply("Failed to generate image.");
    }
  },
};