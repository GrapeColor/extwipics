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
  let tweet_reg = /https?:\/\/twitter\.com\/\w+\/status\/(\d+)/;
  let url_match = message.content.match(tweet_reg);
  if (!url_match) return;

  let params = {tweet_mode: 'extended'}
  twitter.get(`statuses/show/${url_match[1]}`, params, (error, tweet) => {
    if (error) return;

    if (!(tweet.extended_entities)) return;
    let media = tweet.extended_entities.media;
    if (!media || media[0].type !== 'photo' || !media[1]) return;

    let urls = [];
    for (let medium of media.slice(1)) urls.push(medium.media_url_https);
    message.channel.send(urls.join('\n'));
  });
});

client.login(process.env.EXTWIPICS_TOKEN);
