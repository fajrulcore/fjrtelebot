const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { privat } = require("@/utils/helper");

module.exports = {
  name: "yt",
  description: "Download YouTube video/audio via yt-dlp",
  async execute(bot, msg) {
    const chatId = msg.chat.id;

    if (!privat(chatId)) return;

    const text = msg.text || "";
    const args = text.split(" ");

    if (args.length < 2) {
      return bot.sendMessage(chatId, "Kirim link setelah command, contoh:\n`/yt https://youtu.be/abc123`", {
        parse_mode: "Markdown",
      });
    }

    const url = args[1];
    const outputFolder = path.join(__dirname, "../../downloads");

    // Buat folder jika belum ada
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    bot.sendMessage(chatId, "Sedang mengunduh video, harap tunggu...");

    const cmd = `yt-dlp -f 'bestaudio[ext=webm]+bestvideo[height<=720][ext=webm]' -o "${outputFolder}/%(title)s.%(ext)s" "${url}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return bot.sendMessage(chatId, `Terjadi error saat unduh:\n${error.message}`);
      }
      console.log(`Output: ${stdout}`);
      bot.sendMessage(chatId, `Unduhan selesai! File disimpan di folder *downloads/*`, {
        parse_mode: "Markdown",
      });
    });
  },
};
