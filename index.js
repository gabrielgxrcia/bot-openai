require('dotenv').config()
const { Client, GatewayIntentBits, Partials } = require('discord.js')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.User,
    Partials.Channel,
  ],
})

const { Configuration, OpenAIApi } = require('openai')

const configOpenAI = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configOpenAI)

let bloqueado = false

client.on('messageCreate', async function (message) {
  try {
    if (message.author.bot || bloqueado) return
    if (message.channel.id !== '1071941709296054293') return
    bloqueado = true
    message.channel.setRateLimitPerUser(20, '')
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${message.content}`,
      temperature: 0.9,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [' Human:', ' AI:'],
    })

    bloqueado = false

    await message.reply('```' + response.data.choices[0].text + '```')
  } catch (error) {
    console.log(error)
  }
})

client.login(process.env.TOKEN)
