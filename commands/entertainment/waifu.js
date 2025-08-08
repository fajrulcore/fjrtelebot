const { isAuthorized } = require("@/utils/helper");
const axios = require("axios");

module.exports = {
  name: "waifu",
  description: "Get a random waifu image from two fallback APIs",
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    if (!isAuthorized(chatId)) return;

    const fallbackToWaifuPics = async () => {
      try {
        const response = await axios.get(`${process.env.waifupics}/sfw/waifu`);
        await bot.sendPhoto(chatId, response.data.url);
        console.log("✅ Fallback API (waifupics) SUKSES");
      } catch (err) {
        console.error("❌ Fallback API juga gagal:", err.message);
        bot.sendMessage(chatId, "Failed to fetch image from both APIs.");
      }
    };

    try {
      const res = await axios.get(`${process.env.waifuim}/search?included_tags=waifu`);
      const imageUrl = res.data.images[0]?.url;
      if (!imageUrl) throw new Error("No image URL from primary API");
      await bot.sendPhoto(chatId, imageUrl);
      console.log("✅ Primary API (waifuim) SUKSES");
    } catch (error) {
      console.warn("⚠️ Primary API gagal:", error.message);
      await fallbackToWaifuPics();
    }
  },
};
