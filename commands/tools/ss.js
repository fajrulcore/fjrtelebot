const axios = require("axios");
const { privat } = require("@/utils/helper");

module.exports = {
  name: "ss",
  description: "Ambil screenshot website melalui API Vreden",
  async execute(bot, msg) {
    const chatId = msg.chat.id;

    if (!privat(chatId)) return;

    // Ambil teks setelah command
    const input = msg.text?.split(" ").slice(1).join(" ").trim();

    if (!input) {
      return bot.sendMessage(chatId, "❌ Mohon masukkan URL website.\n\nContoh: `ss https://example.com`", { parse_mode: "Markdown" });
    }

    try {
      const apiUrl = `https://api.vreden.my.id/api/ssweb?url=${encodeURIComponent(input)}&type=tablet`;

      // Request ke API
      const res = await axios.get(apiUrl, { responseType: "arraybuffer" });

      // Kirim gambar ke user
      await bot.sendPhoto(chatId, res.data, { caption: `✅ Screenshot dari ${input}` });
    } catch (err) {
      console.error(err.message);
      bot.sendMessage(chatId, "⚠️ Gagal mengambil screenshot. Pastikan URL valid dan API tersedia.");
    }
  },
};
