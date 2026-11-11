import Redis from "ioredis";
import {ICacheProvider} from "./cache.interface";

interface IRedisConfig {
    host: string;
    port: number;
    password: string;
}

export class RedisCacheProvider implements ICacheProvider {
    private client: Redis;

    constructor(config: IRedisConfig) {
        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            lazyConnect: true,
            maxLoadingRetryTime: 3
        });

        this.client.on('error', (err: Error) => console.log('redis server error:', err.message));
        this.client.connect()
            .catch((err: Error) => console.log('fail to connect to redis', err.message));
    }

    async set(key: string, value: string, ttl: number): Promise<"OK"> {
        return this.client.set(key, value, 'EX', ttl);
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async del(key: string): Promise<number> {
        return this.client.del(key);
    }

    async ttl(key: string): Promise<number> {
        return this.client.ttl(key);
    }
}
