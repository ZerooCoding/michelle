// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS


// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.
exports.run = async (client, message, args, level) => {
  const fetch = require("node-fetch");
  const code = args.join(" ");
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    if (clean.length > 1090) { 
      try {
        const {key} = await fetch("https://hasteb.in/documents", {
          method: "POST",
          body: clean,
          headers: {"Content-Type": "application/json"}
        }).then(res => res.json());
        if (!key) throw "Error posting the response";
        message.channel.send(`\`\`\`\nResponse too long. Uploaded output to https://hasteb.in/${key}.js.\n\`\`\``);
      } catch (ex) {
        client.logger.debug(clean);
        message.channel.send("```\nResponse too long. Check the console for full output.\n```");
      }
      
    } else {
      message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
    }
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  special: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates arbitrary javascript.",
  usage: "eval [...code]"
};
