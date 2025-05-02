import { app } from "./app.js";
import { connectToDB } from "./db/index.js";
import http from "http";

const server = http.createServer(app);

connectToDB()
    .then(() => {
        server.on("error", (error) => {
            throw error;
        });
        server.listen(process.env.PORT, () => {
            console.log(`Server running at port :: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(`Unable to run server :: ${error.message}`);
    });
