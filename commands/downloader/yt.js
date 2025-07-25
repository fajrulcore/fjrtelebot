const { exec } = require("child_process");
const { privat } = require("@/utils/helper");

module.exports = {
  name: "yt",
  description: "Download YouTube video/audio via yt-dlp",
  async execute(bot, msg) {
    const chatId = msg.chat.id;

    // Cek apakah chat private atau diperbolehkan
    if (!privat(chatId)) return;

    const text = msg.text || "";
    const args = text.split(" ");

    // Cek apakah ada link
    if (args.length < 2) {
      return bot.sendMessage(chatId, "Mohon kirim link YouTube setelah command, contoh:\n`/yt https://youtu.be/abc123`", {
        parse_mode: "Markdown",
      });
    }

    const url = args[1];

    // Kirim pesan bahwa proses sedang berjalan
    bot.sendMessage(chatId, "Sedang memproses link, mohon tunggu...");

    // Eksekusi perintah yt-dlp
    const cmd = `yt-dlp -f 'bestaudio[ext=webm]+bestvideo[height<=720][ext=webm]' -o "%(title)s.%(ext)s" "${url}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return bot.sendMessage(chatId, `Terjadi kesalahan saat download:\n${error.message}`);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }

      console.log(`Output: ${stdout}`);

      // Kirim hasil ke pengguna (opsional: kirim file jika perlu)
      bot.sendMessage(chatId, `Selesai mengunduh video.\n\nOutput:\n${stdout}`);
    });
  },
};
