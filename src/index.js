import app from "./app.js";
import mqttHandler from "./../src/mqtt/mqttHandler.js";


//Uso del MQTT
var mqttClient = new mqttHandler();
mqttClient.connect();


const main = () => {
    app.listen(app.get("port"), "0.0.0.0");
    console.log(`Server on port ${app.get("port")}`);

};

main();

