import TelegramBot from 'node-telegram-bot-api'

const token = process.env.TELEGRAM_BOT_TOKEN as string
const bot = new TelegramBot(token, { polling: true })

bot.onText(/https?:\/\/(www\.)?amazon\.[a-zA-Z0-9-\.]{2,}\//, (msg) => {
  const chatId = msg.chat.id
  const asin = msg.text?.match(/(?<=dp\/)[A-Z0-9]{10}/)?.[0]

  console.log(msg)

  if (asin) {
    const graph = `https://charts.camelcamelcamel.com/it/${asin}/amazon-new-used.png?force=1&zero=0&w=855&h=513&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=it`
    bot.sendPhoto(chatId, graph, { caption: `https://it.camelcamelcamel.com/product/${asin}` })
  }
})
