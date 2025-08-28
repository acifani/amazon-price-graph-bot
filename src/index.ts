import { Bot } from 'grammy'
import type { Context } from 'grammy'

const token = process.env.TELEGRAM_BOT_TOKEN as string
const bot = new Bot(token)

// Forward message from one topic to another in a custom chat
const customChatID = Number(process.env.CUSTOM_CHAT_ID)
const customChatTopicFrom = Number(process.env.CUSTOM_CHAT_TOPIC_FROM)
const customChatTopicTo = Number(process.env.CUSTOM_CHAT_TOPIC_TO)

bot.hears(/https?:\/\/(?:www\.)?amazon\.it\//, (ctx) => {
  const matches = ctx.message?.text?.match(/(?<=dp\/|gp\/product\/)[A-Z0-9]{10}/)
  matches?.forEach((asin) => sendProductMessages(asin, ctx))
})

bot.hears(/https?:\/\/(amzn\.(?:eu|to)|voob\.it)\//, async (ctx) => {
  const links = ctx.message?.text?.match(/https?:\/\/(amzn\.(?:eu|to)|voob\.it)\/(\w+)(?:\/\w+)?/g)
  if (!links) {
    console.warn('Could not find links for', ctx.message?.text)
    return
  }

  for (const link of links) {
    const res = await fetch(link, { redirect: 'manual' })
    const amznLink = res.headers.get('Location')
    const asin = amznLink?.match(/(?<=dp\/)[A-Z0-9]{10}/)?.[0]

    if (asin) {
      sendProductMessages(asin, ctx)
    }
  }
})

function sendProductMessages(asin: string, ctx: Context) {
  const chatId = ctx.chat?.id
  const threadId = ctx.message?.message_thread_id

  // const camelGraph = `https://charts.camelcamelcamel.com/it/${asin}/amazon-new-used.png?force=1&zero=0&w=600&h=360&desired=false&legend=1&ilt=1&tp=6m&fo=0&lang=it`
  const keepaGraph = `https://graph.keepa.com/pricehistory.png?asin=${asin}&domain=it&salesrank=1&amazon=1&new=1&used=1&bb=0&fba=0&fbm=0&pe=0&ld=1&bbu=0&wd=0&range=180&width=600&height=300`

  const photoOptions: Parameters<typeof ctx.replyWithPhoto>[1] = {
    disable_notification: true,
    message_thread_id: threadId,
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Keepa', url: `https://keepa.com/#!product/8-${asin}` },
          { text: 'CamelCamelCamel', url: `https://it.camelcamelcamel.com/product/${asin}` },
        ],
      ],
    },
  }

  ctx.replyWithPhoto(keepaGraph, photoOptions)

  if (chatId === customChatID && threadId === customChatTopicFrom) {
    ctx.replyWithPhoto(keepaGraph, { ...photoOptions, message_thread_id: customChatTopicTo })
  }
}

bot.start()

process.once('SIGINT', () => bot.stop())
process.once('SIGTERM', () => bot.stop())
