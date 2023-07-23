const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const axios = require('axios');

const PREFIX = '!'; // We won't be using the PREFIX for slash commands

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
  if (message.content.startsWith(PREFIX) || message.author.bot) return;

  // ... Handle your other commands as usual
});

// Register your slash command when the bot is ready
client.on('ready', () => {
  client.guilds.cache.forEach(guild => {
    // Replace 'YOUR_GUILD_ID' with the ID of the guild where you want to register the slash command.
    if (guild.id === 'YOUR_GUILD_ID') {
      guild.commands.create({
        name: 'upload',
        description: 'Upload a file to VirusTotal.',
      });
    }
  });
});

// Listen for interactions with the slash command
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'upload') {
    if (!options.getSubcommand()) {
      return interaction.reply('Please provide a file to upload.');
    }

    const url = options.getString('url');

    try {
      const response = await axios.post(
        'https://www.virustotal.com/api/v3/files',
        { url },
        {
          headers: {
            'x-apikey': 'YOUR_VIRUSTOTAL_API_KEY',
          },
        }
      );

      // Handle the response from VirusTotal API
      console.log(response.data);
      interaction.reply('File uploaded to VirusTotal. Check the results!');
    } catch (error) {
      console.error('Error uploading file to VirusTotal:', error.message);
      interaction.reply('Error uploading the file. Please try again later.');
    }
  }
});

// Replace 'YOUR_BOT_TOKEN' with your actual Discord bot token
client.login('YOUR_BOT_TOKEN');
