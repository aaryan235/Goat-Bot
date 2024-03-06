
module.exports = {
  config: {
    name: "autodl", 
    version: "1.0.",
    author: "Dipto",//convert by Mesbah Bb'e
    countDown: 0,
    role: 0,
    longDescription: {
      en: "Auto download video from tiktok, facebook, Instagram, YouTube, and more",
      bn: "প্রতিবন্ধী, লিংক এর বাজার, ইন্ডিয়ান ম্যগি, বোকাছোদা, এবং আরো কিছু প্লাটফর্ম থেকে অটো ভিডিও ডাউনলোড করে"
    },
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: {
      en: "just send your link",
      bn: "মনি কিছু লেখা লাগবে না"
    }
},
  
  onChat: async function ({ api, event, client, __GLOBAL }) {

  const axios = require('axios');
  const fs = require('fs');

let dipto = event.body ? event.body : '';

  try {

if (dipto.startsWith('https://vt.tiktok.com') || dipto.startsWith('https://www.facebook.com') || dipto.startsWith('https://www.instagram.com/') || dipto.startsWith('https://youtu.be/') || dipto.startsWith('https://youtube.com/') || dipto.startsWith('https://x.com/') || dipto.startsWith('https://twitter.com/') || dipto.startsWith('https://vm.tiktok.com') || dipto.startsWith('https://fb.watch')){

  const d = api.sendMessage("downloading video, please wait...", event.threadID);

  if (!dipto) {

    api.sendMessage("please put a valid video link", event.threadID, event.messageID);

    return;

    }

    const path = __dirname + `/cache/diptoo.mp4`;

    const aa = await axios.get(`https://d1pt0-all.onrender.com/xnxx?url=${encodeURI(dipto)}`);

   const bb = aa.data;

    const vid = (await axios.get(bb.result, { responseType: "arraybuffer", })).data;

    fs.writeFileSync(path, Buffer.from(vid, 'utf-8'));
    api.sendMessage({

      body: `${bb.cp}`,

      attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID)}

if (dipto.startsWith('https://i.imgur.com')){

  const dipto3 = dipto.substring(dipto.lastIndexOf('.'));

  const response = await axios.get(dipto, { responseType: 'arraybuffer' });

const filename = __dirname + `/cache/dipto${dipto3}`;

    fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));
await api.unsendMessage(d.messageID);
    api.sendMessage({body: `Downloaded from link`,attachment: fs.createReadStream(filename)},event.threadID,

  () => fs.unlinkSync(filename),event.messageID)

}

} catch (e) {

api.sendMessage(`${e}`, event.threadID, event.messageID);
  }
  },

onStart: function({ api, event, client, __GLOBAL }) {

}
}
