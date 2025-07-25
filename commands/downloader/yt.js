const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { privat } = require("@/utils/helper");

module.exports = {
  name: "yt",
  description: "Download video/audio using yt-dlp based on source",
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    if (!privat(chatId)) return;

    const text = msg.text || "";
    const args = text.split(" ");

    if (args.length < 2) {
      return bot.sendMessage(
        chatId,
        "Please provide a link after the command, for example:\n`/yt https://youtu.be/abc123`",
        { parse_mode: "Markdown" }
      );
    }

    const url = args[1];
    const outputFolder = path.join(__dirname, "../../storage");

    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    // Link type detection
    const isYouTube = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(
      url
    );
    const isShorts = /(youtube\.com\/shorts\/)/.test(url);

    // Format logic with escaped brackets
    let format = "bestvideo[height<=720]+bestaudio";
    if (isShorts) {
      format = "bestvideo[height<=1920]+bestaudio";
    }

    const cmd = `yt-dlp -f "${format}" --no-mtime --restrict-filenames -o "${outputFolder}/%(title)s.%(ext)s" "${url}"`;

    // Inform user
    const statusMessage = await bot.sendMessage(
      chatId,
      "Downloading the video, please wait..."
    );

    exec(cmd, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        return bot.editMessageText(
          `An error occurred while downloading:\n\`${error.message}\``,
          {
            chat_id: chatId,
            message_id: statusMessage.message_id,
            parse_mode: "Markdown",
          }
        );
      }

      console.log(`stdout:\n${stdout}`);
      console.log(`stderr:\n${stderr}`);

      await bot.editMessageText(
        "✅ Download completed! The file has been saved in the *storage/* folder.",
        {
          chat_id: chatId,
          message_id: statusMessage.message_id,
          parse_mode: "Markdown",
        }
      );
    });
  },
};
