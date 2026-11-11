import http from "node:http";
import {createApp} from "./app";
import {connectDB} from "./lib/db/connection";
import {env} from "./lib/config/env";

const app = createApp();

const server = http.createServer(app);

connectDB().then(() => {
    server.listen(env.port, () => console.log(`Server is running on port ${env.port}`));
});

process.on("SIGINT", () => server.close());
process.on("SIGTERM", () => server.close());
