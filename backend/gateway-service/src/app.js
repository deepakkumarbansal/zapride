import dotenv from "dotenv";
import express from "express";
import proxy from "express-http-proxy";
import path, { dirname } from "path"
import { fileURLToPath } from "url";

const filepath = fileURLToPath(import.meta.url);
const __dirname = dirname(filepath);

dotenv.config({
    path: path.resolve(__dirname, "../.env")
})

const app = express();
const createProxy = (host) => {
    return proxy(host, {
        proxyErrorHandler: (err, res, next)=>{
            console.log(`proxy error for ${host} :: ${err.message}`);
            res.status(500).json({message: "Service temporarly unavailable"})
        }
    })
}
app.use('/api/user', createProxy(process.env.USER_SERVICE_BASE_URL));
app.use('/api/captain', createProxy(process.env.CAPTAIN_SERVICE_BASE_URL));
app.use('/api/admin', createProxy(process.env.ADMIN_SERVICE_BASE_URL));
app.use('/api/ride', createProxy(process.env.RIDE_SERVICE_BASE_URL));

app.use((err, res, next)=>{
    res.status(500).json({message: "Internal server error"})
})

export {app}