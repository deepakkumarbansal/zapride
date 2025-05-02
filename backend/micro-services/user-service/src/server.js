import { app } from "./app.js";
import http from "http";
import { connectToDB } from "./db/index.js";

const server = http.createServer(app);

connectToDB().then(() => {
    server.on("error", (error) => {
        console.log(`Unable to run app`);
        throw error;
    });
    server.listen(process.env.PORT, () => {
        console.log(`Server listning at port ${process.env.PORT}`);
    });
});
