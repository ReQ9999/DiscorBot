const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const msg = require('./messages.json');
const ver = config.version;
let statuses = [`Bot na dniach może zostać porzucony`, `Wersja ${config.version}`, 'Dawniej nullBot', `Twórca ${config.autor}`, 'Mój autor się najebał', 'Decrypt secret command', 'Hehehehehehe', 'Dawaj hajs', 'Bot robiony 4fun', 'Vixa pixa', `Prefix ${config.prefix}`, 'Kaszan jaglanu', '21.09.2019', 'Kocie ruchy', 'Zajebiste cytaty pod $$cytaty']
var color = config.color;

//EVENTS

client.on('ready', () => {
		client.user.setStatus('Invisible');
		console.log(`ClearBot : ON\nAutorem jest ${config.autor}\nWersja : ${ver}\nJestes zalogowany jako : ${client.user.tag}\nDostepny na : ${client.guilds.size} serwerach`);
		client.user.setStatus('online');
        client.user.setPresence({
            game: {
                  name: config.ingame,
                  type: "STREAMING",
                  url: "https://www.twitch.tv//"
            }
        })
});

client.on('disconnect', () => {
	console.log(`Rozlaczono`);
});

client.on('reconnecting', () => {
	console.log(`Staram sie ponownie polaczyc`);
});

client.on("guildCreate", guild => {
    console.log(`Dolaczylem do serwera : ${guild.name} (id: ${guild.id}). Ten serwer ma ${guild.memberCount} czlonkow!`);
});

client.on("guildDelete", guild => {
    console.log(`Wyszedlem z serwera : ${guild.name} (id: ${guild.id})`);
});

client.on("guildMemberAdd", (member) => {
	console.log(`${member.guild.tag} dolaczyl na serwer ${member.guild.name}!`);
});

client.on('message', async message => {
	if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
	var sender = message.author;
	
	if (message.channel.name != "komendy" && message.channel.name != "▣komendy▣" && command != "clear" command != "say"){
		return message.channel.send("Wysylanie na komend na tym kanale jest zablokowane!");
	}
	
	if (message.channel instanceof Discord.DMChannel){
		await message.delete().catch(O_o=>{});
		return message.channel.send("Używanie komend na priv jest zablokowane");
	}
	
	if(command == "avatar") {
		var targetUser = message.mentions.members.first();
		if(!targetUser) var targetUser = message.author;
		let embed = new Discord.RichEmbed()
		.setImage(targetUser.avatarURL)
		.setColor(color)
		return message.channel.send(embed);
	}
	
	if(command == "help"){
		message.channel.send(`${message.author} wyslano na priv`);
		return message.author.send("Komendy dostepne dla bota ClearBota:\n$$ping - pokazuje ping\n$$banana - pokazuje rozmiar banana\n$$report <wzmianka> <powod> - zglasza uzytkownika\n$$wersja - pokazuje wersje bota\n$$clear <ilosc> - czysci czat\n$$autor - autor bota\n$$serverinfo - pokazuje serwerowe informacje");
	}
	
	if(command == "wersja") {
		return message.channel.send(`Wersja reqbota to : ` + ver);
	}
	
	if(command === "clear") {
        if(!message.member.roles.some(r=>["ClearBot Commander"].includes(r.name)) )
          return message.channel.send("Brak uprawnien");
        const deleteCount = parseInt(args[0], 10);
        
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
          return message.channel.send('2-100');
        
        const fetched = await message.channel.fetchMessages({limit: deleteCount});
        message.channel.bulkDelete(fetched)
          .catch(error => message.reply(`Wykryto blad :  ${error}`));
    }
	
	if(command == "banan") {
        var banan = Math.floor(getRandomInt(1, 100));
        message.channel.send('Twoj banan ma `' + banan + ' cm`', {files: ["https://preview.ibb.co/mCJX0e/bsd.png"]});
    }
	
	if(command == "iq"){
		var iq = Math.floor(getRandomInt(-200, 200));
		if(iq < 0){
			message.channel.send(`Jestes amebą`);
		}
		message.channel.send(`:bulb: Twój poziom iq wynosi : ` + iq + " :bulb: ");
	}
	
	//FOR USERS
	
	if(command == "autor") {
		message.delete().catch(O_o=>{});
		let embed = new Discord.RichEmbed()
		.setTitle("ClearBot - Autor")
		.setColor(color)
		.addField(`Moim autorem jest : `, `${config.autor}`, true)
		.setFooter(`${message.author.username}`)
		.setTimestamp();
		return message.channel.send(embed);
	}
	
	if(command == "botinfo"){
		var iloscxd = client.users.size - 1;
		let embed = new Discord.RichEmbed()
		.setTitle("Informacje o bocie")
		.setColor(color)
		.addField(`Nazwa bota (z tagiem)`, `${client.user.tag}`)
		.addField("Wersja bota", `${ver}`)
		.addField("Ilosc uzytkownikow", `${iloscxd}`)
		.addField("Ilosc serwerow", `${client.guilds.size}`)
		.setFooter(`${message.author.username}`)
		.setTimestamp();
		return message.channel.send(embed);
	}
	
	if(command == "serverinfo") {
		message.delete().catch(O_o=>{});
		let embed = new Discord.RichEmbed()
		.setTitle(`${message.guild.name} - Informacje`)
		.setColor(color)
		.addField(`Wlasciciel serwera`, message.guild.owner, true)
		.addField(`Region serwera`, message.guild.region, true)
		.addField(`Ilosc wszystkich`, message.guild.memberCount, true)
		.addField(`Ilosc Ludzi`, checkMembers(message.guild), true)
		.addField(`Ilosc Botow`, checkBots(message.guild), true)
		.addField(`Ilosc kanalow`, message.guild.channels.size, true)
		.addField(`Poziom weryfikacji`, message.guild.verificationLevel, true)
		.addField(`Serwer powstal w`, message.guild.createdAt, true)
		.setFooter(`${message.author.username}`)
		.setTimestamp();
		return message.channel.send(embed);
	}
	
	if(command == "report") {
		let targetUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if(!targetUser) return message.channel.send("Gdzie ten juzer ?");
		let targetReason = args.join(" ").slice(22);
		if(!targetReason) return message.author.send(`Uzyj $$report <wzmianka> <powod>`);
		let reportEmbed = new Discord.RichEmbed()
		.setDescription("Report")
		.setColor(color)
		.addField("Winowajca", `${targetUser} (ID: ${targetUser.id})`)
		.addField("Zgłaszający", `${message.author} (ID: ${message.author.id})`)
		.addField("Kanał", message.channel)
		.addField("Czas", message.createdAt)
		.addField("Powód", targetReason);
		let reportschannel = message.guild.channels.find(`name`, "reporty");
		if(!reportschannel) return message.channel.send("Gdzie jest ten czanel ?");
		message.delete().catch(O_o=>{});
		reportschannel.send(reportEmbed);
	}
	
	
	//IMPORTANT
	
	if(command == "kick") {
		if(!message.member.roles.some(r=>["ClearBot Commander"].includes(r.name)) )
			return message.channel.send("Uprawnien brak");
    let targetUser = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!targetUser)
      return message.channel.send(`Gdzie ten juzer?`);
    if(!targetUser.kickable) 
      return message.channel.send(`Dawaj admina`);
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Brak powodu";
	targetUser.send(`Zostales wyrzucony przez : ${message.author.tag} za : ${reason} z serwera : ${message.guild.name}`);
    await targetUser.kick(reason)
      .catch(error => message.channel.send(`Masz tu blad i essa : ${error}`));
    message.channel.send(`${targetUser.user.tag} zostal wyrzucony przez ${message.author.tag} za : ${reason}`);

  }
  
  if(command == "ban") {
    if(!message.member.roles.some(r=>["ClearBot Commander"].includes(r.name)) )
      return message.channel.send("Uprawnien brak");
    let targetUser = message.mentions.members.first();
    if(!targetUser)
      return message.channel.send(`Gdzie ten juzer?`);
    if(!targetUser.bannable) 
      return message.channel.send(`Dawaj admina`);

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Brak powodu";
    targetUser.send(`Zostales zbanowany przez : ${message.author.tag} za : ${reason} z serwera : ${message.guild.name}`);
    await targetUser.ban(reason)
      .catch(error => message.channel.send(`Masz tu blad i essa : ${error}`));
    message.channel.send(`${targetUser.user.tag} zostal zbanowany przez ${message.author.tag} za : ${reason}`);
  }
	
	if(command == "say") {
	    if(message.author.id != config.ownerid && message.author.id != "575791053609631773") {
            let embed = new Discord.RichEmbed()
			.setTitle("Uprawnienia")
			.setColor(color)
			.addField("Nie masz uprawnien", `${message.author.username}`, true)
			.setTimestamp();
            return message.channel.send(embed);
        }
        const Wiadomosc = args.join(" ");
        if(!Wiadomosc) {
            message.delete().catch(O_o=>{});
            let embed = new Discord.RichEmbed()
			.setTitle("Niepoprawne uzycie")
			.setColor(color)
			.addField("Musisz wpisac $$say ", 'wiadomosc', true)
			.setFooter(`${message.author.username}`)
			.setTimestamp();
            return message.channel.send(embed);
        }
        message.delete().catch(O_o=>{});
		let embed = new Discord.RichEmbed()
			.setTitle("Wiadomosc")
			.setColor(color)
			.addField(Wiadomosc, `!`, true)
			.setFooter(`~${message.author.username}`)
			.setTimestamp();
        message.channel.send(embed);
    }
	
	if(command == "ping") {
		const m = await message.channel.send("ELKO");
        m.edit(`Odpowiedz od srv : ${m.createdTimestamp - message.createdTimestamp}ms. API : ${Math.round(client.ping)}ms`);
	}
	
	if(command == "freset"){
		if(message.author.id != config.ownerid) {
			message.delete().catch(O_o=>{});
            let embed = new Discord.RichEmbed()
			.setTitle("Uprawnienia")
			.setColor(color)
			.addField("Nie masz uprawnien", `${message.author.username}`, true)
			.setTimestamp();
            return message.channel.send(embed);
		}
		resetBot(message.channel);
		console.log(`Proces freset zostal wymuszony przez : ${message.author.tag}`);
		return;
	}
	
	if(command == "hstop"){
		if(message.author.id != config.ownerid) {
			message.delete().catch(O_o=>{});
            let embed = new Discord.RichEmbed()
			.setTitle("Uprawnienia")
			.setColor(color)
			.addField("Nie masz uprawnien", `${message.author.username}`, true)
			.setTimestamp();
            return message.channel.send(embed);
		}
		stopBot(message.channel);
		console.log(`Proces hstop zostal wymuszony przez : ${message.author.tag}`);
		return;
	}
	
});

//FUNCTIONS
	
function checkMembers(guild) {
	let memberCount = 0;
	guild.members.forEach(member => {
      if(!member.user.bot) memberCount++;
    });
    return memberCount;
}

function checkBots(guild) {
	let botCount = 0;
    guild.members.forEach(member => {
      if(member.user.bot) botCount++;
    });
    return botCount;
}

function resetBot(channel) {
	channel.send('Resetuje polaczenie')
    .then(msg => client.destroy())
    .then(() => client.login(config.token));
	channel.send(`Zresetowalem`);
}

function stopBot(channel) {
	channel.send('Zatrzymuje proces "reqbot.js"')
    .then(msg => client.destroy());
}

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}

client.login(575791053609631773);