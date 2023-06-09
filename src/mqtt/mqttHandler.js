import mqtt from "mqtt";
import {dbConnection as db} from "./../database/database.js";


class MqttHandler {
    constructor() {
      this.mqttClient = null;
      this.host = '192.168.1.81';
      this.port = '9001';
    }



    connect() {
        //Connection to MQTT
      //this.mqttClient = mqtt.connect('mqtt://192.168.1.81');
      this.mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

      
      // Mqtt error calback
      this.mqttClient.on('error', (err) => {
        console.log(err);
        this.mqttClient.end();
      });
  
      // Connection callback
      this.mqttClient.on('connect', () => {
        console.log(`mqtt client connected`);
      });
  
      // mqtt subscriptions
      this.mqttClient.subscribe('Niveles', {qos: 0});
  
      // When a message arrives, console.log it
      this.mqttClient.on('message', async function (topic, message) {
        console.log(message.toString());
        try{
            const { tanqueName, nivel } = JSON.parse(message.toString());
            if(tanqueName == undefined || nivel == undefined){
                return console.log("Atributos incorrectos");
             }
            const registro = { tanqueName, nivel };
            const getConnection = await db.getConnection();
            const result = await getConnection.query("insert into reportesTanques SET ?", registro);

            return console.log(result);
    
        }catch(error){
    

            return console.log(error.message);
    
        }
      });
  
      this.mqttClient.on('close', () => {
        console.log(`mqtt client disconnected`);
      });
    }
  
  }
  
  export default MqttHandler;