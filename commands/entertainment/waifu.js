const { privat } = require("@/utils/helper");
const axios = require("axios");

module.exports = {
  name: "waifu",
  description: "Get a random waifu image from two fallback APIs",
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    if (!privat(chatId)) return;

    const fallbackToWaifuim = async () => {
      try {
        const res = await axios.get(`${process.env.waifuim}/search?included_tags=waifu`);
        const imageUrl = res.data.images[0].url;
        await bot.sendPhoto(chatId, imageUrl);
      } catch (err) {
        console.error("Fallback API juga gagal:", err.message);
        bot.sendMessage(chatId, "Gagal mengambil gambar dari kedua API.");
      }
    };

    try {
      const response = await axios.get(`${process.env.waifupics}/sfw/waifu`);
      await bot.sendPhoto(chatId, response.data.url);
    } catch (error) {
      console.error("API utama gagal:", error.message);
      await fallbackToWaifuim(); // Jalankan fallback
    }
  },
};
