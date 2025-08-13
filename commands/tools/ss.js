const axios = require("axios");
const { isAuthorized } = require("@/utils/helper");

module.exports = {
  name: "ss",
  description: "Take desktop and mobile screenshots of a website",
  async execute(bot, msg) {
    const chatId = msg.chat.id;

    if (!isAuthorized(chatId)) return;

    const inputText = msg.text.trim(); // example: "/ss https://example.com"
    const args = inputText.split(" ").slice(1);
    const urlTarget = args.join(" ").trim();

    if (!urlTarget || !urlTarget.startsWith("http")) {
      return bot.sendMessage(
        chatId,
        "Please provide a valid URL after the command, example:\n`/ss https://example.com`",
        { parse_mode: "Markdown" }
      );
    }

    const endpoint = `${process.env.flowfalcon}/tools/ssweb?url=${encodeURIComponent(urlTarget)}`;

    try {
      const res = await axios.get(endpoint);
      const data = res.data;

      if (!data.status || !data.result || !data.result.pc || !data.result.mobile) {
        return bot.sendMessage(chatId, "Failed to capture screenshot. API response is incomplete.");
      }

      await bot.sendMediaGroup(chatId, [
        {
          type: "photo",
          media: data.result.pc,
          caption: `🖥️ Desktop view of:\n${urlTarget}`,
        },
        {
          type: "photo",
          media: data.result.mobile,
          caption: `📱 Mobile view of:\n${urlTarget}`,
        },
      ]);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, "An error occurred while taking the screenshot.\nCheck your connection or the URL.");
    }
  },
};
