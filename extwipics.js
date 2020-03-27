require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const Twitter = require('Twitter');
const twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  const tweet_reg = new RegExp('https?://twitter.com/\\w+/status/(\\d+)');
  const url_match = message.content.match(tweet_reg);
  if (!url_match) return;

  const params = {tweet_mode: 'extended'};
  twitter.get(`statuses/show/${url_match[1]}`, params, (error, tweet) => {
    if (error) return;

    if (!tweet.extended_entities) return;
    const media = tweet.extended_entities.media;
    if (!media || media[0].type !== 'photo' || !media[1]) return;

    const urls = [];
    for (const medium of media.slice(1)) urls.push(medium.media_url_https);
    message.channel.send(urls.join('\n'));
  });
});

client.login(process.env.EXTWIPICS_TOKEN);
