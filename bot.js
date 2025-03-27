const { Client, GatewayIntentBits } = require('discord.js');
const mysql = require('mysql2');

// Configuração do bot
const token = "";
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Conectar ao banco de dados MySQL
const db = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: "userDB"
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao MySQL remoto:", err.message);
    } else {
        console.log("Conectado ao banco de dados MySQL remoto.");
    }
});

client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const args = message.content.split(" ");

    if (message.content.startsWith("!buscar")) {
        if (args.length < 2) {
            return message.reply("Uso correto: !buscar <id>");
        }
        const userId = args[1];
        db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
            if (err) {
                console.error(err);
                message.reply("Erro ao buscar usuário.");
            } else if (results.length > 0) {
                message.reply(`Usuário encontrado: ${JSON.stringify(results[0])}`);
            } else {
                message.reply("Usuário não encontrado.");
            }
        });
    }

    if (message.content.startsWith("!users")) {
        db.query("SELECT username FROM users", (err, results) => {
            if (err) {
                console.error(err);
                message.reply("Erro ao buscar usuários.");
            } else if (results.length > 0) {
                const usernames = results.map(row => row.username).join("\n");
                message.reply(`Usuários encontrados: ${usernames}`);
            } else {
                message.reply("Nenhum usuário encontrado.");
            }
        });
    }

if (message.content.startsWith("!addkey")) {
    if (args.length < 3) {
        return message.reply("Uso correto: !addkey <key_value> <tempo_key>");
    }
    const keyValue = args[1];
    const tempoKey = args[2];


    if (isNaN(tempoKey) || tempoKey <= 0) {
        return message.reply("O valor de tempo_key deve ser um número positivo.");
    }


    db.query("INSERT INTO user_keys (key_value, used, tempo_key) VALUES (?, 0, ?)", [keyValue, tempoKey], (err, results) => {
        if (err) {
            console.error(err);
            message.reply("Erro ao adicionar chave.");
        } else {
            message.reply(`Chave '${keyValue}' adicionada com sucesso com tempo de ${tempoKey} segundos.`);
        }
    });
}
});

client.login(token);