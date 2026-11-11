import {cacheProvider} from "./init";
import {NextFunction, Request, Response} from "express";

export function withCache(ttl = 3600) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // method + url
        // "GET:/api/user" : "{...}"
        const key = `${req.method}:${req.originalUrl}`;

        const cached = await cacheProvider.get(key);
        if (cached) {
            res.setHeader('X-Cache', "HIT");
            return res.json(JSON.parse(cached));
        }

        const originalJson = res.json.bind(res);
        res.json = (body: any) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                // 1. cache response
                cacheProvider.set(key, JSON.stringify(body), ttl);
                // 2. send response
                res.setHeader('X-Cache', "MISS");
            }
            return originalJson(body);
        };

        next();
    }
}
