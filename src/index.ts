import 'isomorphic-fetch';

import express, {
	Express,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express';
import { RedisDB } from 'infra/database/cache/providers/redis';
import { join } from 'path';

import { CommandsHandler } from './bot/commands-handler';
import { MarliMusic } from './bot/marli-music';
import { initConfigs } from './config';
import { fileLogger, logger } from './config/winston';
import { YtdlSourceStream } from './sources/ytdl-source/ytdl-source';

initConfigs();

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_PREFIX = process.env.BOT_PREFIX;

const botHandler = new CommandsHandler(new YtdlSourceStream());

const cache = new RedisDB();

new MarliMusic(
	{
		prefix: BOT_PREFIX,
		token: BOT_TOKEN,
	},
	botHandler,
	{
		intents: [
			'Guilds',
			'GuildMessages',
			'MessageContent',
			'GuildVoiceStates',
			'DirectMessageReactions',
			'GuildEmojisAndStickers',
			'GuildMembers',
			'GuildMessageTyping',
			'GuildMessageReactions',
		],
	},
);

const server: Express = express();
const router = Router();
server.use(router);

const port = process.env.PORT || 3000;

router.get('/', (_request: Request, response: Response, next: NextFunction) => {
	const options = {
		root: join('public'),
	};
	return response.sendFile('index.html', options, (err) => {
		if (err) {
			next();
			logger.log('error', err);
		}
	});
});

router.post('/health-check', (_request: Request, response: Response) => {
	return response.json({
		message: 'Ok',
	});
});

server.listen(port, () => {
	fileLogger.log('info', `Server listening to: ${port}`);
});
