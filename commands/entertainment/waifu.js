const { isAuthorized } = require("@/utils/helper");
const axios = require("axios");

module.exports = {
  name: "waifu",
  description: "Get a random waifu image from two fallback APIs",
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    if (!isAuthorized(chatId)) return;

    const handleWaifuPics = async () => {
      try {
        const resPrimary = await axios.get(
          `${process.env.waifupics}/sfw/waifu`,
          { timeout: 8000 }
        );
        const imageUrlPrimary = resPrimary.data?.url;
        if (!imageUrlPrimary) throw new Error("No image URL from WaifuPics");

        await bot.sendPhoto(chatId, imageUrlPrimary);
        console.log("✅ Primary API (WaifuPics) sukses");
      } catch (err) {
        console.warn("⚠️ Primary API gagal:", err.message);
        await handleWaifuIm();
      }
    };

    const handleWaifuIm = async () => {
      try {
        const resFallback = await axios.get(
          `${process.env.waifuim}/search?included_tags=waifu`,
          { timeout: 8000 }
        );
        const imageUrlFallback = resFallback.data?.images?.[0]?.url;
        if (!imageUrlFallback) throw new Error("No image URL from WaifuIM");

        await bot.sendPhoto(chatId, imageUrlFallback);
        console.log("✅ Fallback API (WaifuIM) sukses");
      } catch (err) {
        console.error("❌ Fallback API juga gagal:", err.message);
        await bot.sendMessage(chatId, "Failed to fetch image from both APIs.");
      }
    };
    await handleWaifuPics();
  },
};
