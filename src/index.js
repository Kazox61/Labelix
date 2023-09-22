import { Labelix } from "./labelix.js"



(async() => {
    let labelix = new Labelix();
    await labelix.start();
})()