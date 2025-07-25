const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { privat } = require("@/utils/helper");

module.exports = {
  name: "yt",
  description: "Download YouTube video/audio using yt-dlp",
  async execute(bot, msg) {
    const chatId = msg.chat.id;

    // Check if the chat is private or authorized
    if (!privat(chatId)) return;

    const text = msg.text || "";
    const args = text.split(" ");

    // Check if a link is provided
    if (args.length < 2) {
      return bot.sendMessage(
        chatId,
        "Please provide a YouTube link after the command, for example:\n`/yt https://youtu.be/abc123`",
        { parse_mode: "Markdown" }
      );
    }

    const url = args[1];
    const outputFolder = path.join(__dirname, "../../storage");

    // Create the folder if it doesn't exist
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    bot.sendMessage(chatId, "Downloading the video, please wait...");

    const cmd = `yt-dlp -f 'bestaudio[ext=webm]+bestvideo[height<=720][ext=webm]' -o "${outputFolder}/%(title)s.%(ext)s" "${url}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return bot.sendMessage(chatId, `An error occurred while downloading:\n${error.message}`);
      }

      console.log(`Output: ${stdout}`);
      bot.sendMessage(chatId, `Download completed! The file has been saved in the *storage/* folder.`, {
        parse_mode: "Markdown",
      });
    });
  },
};
