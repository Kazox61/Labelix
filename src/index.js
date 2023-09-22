import { Application } from "./application.js";

(async() => {
    const app = new Application();
    await app.start();
})()

