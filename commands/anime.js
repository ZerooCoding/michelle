// Search Kitsu for an anime

exports.run = async (client, message, args, level) => {
  const kitsu = require("node-kitsu");
  if (!args[0]) {
    var aniname = await client.awaitReply(message, "What is the name of the anime you want to search for?", 15000);
    if (!aniname) return client.logger.warn(`${message.author.username}'s request timed out.`);
  }
  else var aniname = args.join(" ");
  var embed;
  try {
    var results = await kitsu.searchAnime(aniname, 0);
  } catch (ex) {
    message.channel.send("An error occured running this command. This is likely due to an issue on Kitsu's end, and not an error with the bot. Please try your command again later.");
    return client.logger.error(`An error occurred with the command: ${ex}`);
  }
  var aniresult = results[0].attributes;
  if (!aniresult.titles) {
    message.channel.send("No results found");
    client.logger.warn(`No anime found for search term "${aniname}"`);
    return;
  }
  embed = { "embed": {
    "title": aniresult.titles.en || aniresult.titles.en_jp || aniresult.canonicalTitle,
    "url": `https://kitsu.io/anime/${aniresult.slug}`,
    "description": client.cleanSyn(aniresult.synopsis),
    "color": client.colorInt("#fd8320"),
    "image": { "url": aniresult.posterImage.small },
    "fields": [
      { "name": "Rating:", "value": `${aniresult.averageRating || 0}% Approval`, "inline": true },
      { "name": "Episodes:", "value":  `${aniresult.episodeCount || 0} (${aniresult.subtype})`, "inline": true },
      { "name": "Status:", "value": aniresult.status == "tba" ? "TBA" : `${aniresult.status.charAt(0).toUpperCase()}${aniresult.status.substr(1).toLowerCase()}`, "inline": true }
    ]
  } };
  message.channel.send(embed);
  client.logger.log(`Result found for search term "${aniname}": "${aniresult.titles.en || aniresult.titles.en_jp || aniresult.canonicalTitle}"`);
};

exports.conf = {
  enabled: false,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "anime",
  category: "Kitsu",
  description: "Show information about an anime on Kitsu.",
  usage: "anime [name]"
};