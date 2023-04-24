import { Redis } from '@upstash/redis';

import { ICacheDatabase, ICacheInput } from '../ICacheDatabase';

export class RedisDB implements ICacheDatabase {
	private connect() {
		const redis = new Redis({
			token: process.env.REDIS_TOKEN,
			url: process.env.REDIS_URL,
		});

		return redis;
	}

	async set(input: ICacheInput) {
		const saved = await this.connect().set(input.key, input.value);

		return saved;
	}

	async get(key: string) {
		const value = await this.connect().get(key);

		return value;
	}
}
