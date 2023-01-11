const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const manageWit = require("./middleware");
const chatRobot = require("./robot");

var Table = require("cli-table");

const tableChat = new Table({
    head: ["Info", "Valor"],
    colWidths: [10, 100]
});

app.get("/", (req, res) => {
    res.send("Hola mundo");
});

const { Server } = require("socket.io");
const io = new Server(server,  {
    cors: {
      origin: '*',
    }
});
let indexChat = 0;
let sentToWit = true;
io.on("connection", function(socket) {
    console.log("usuario conectado");
    socket.on("ask", async (data) => {
        let responseWit;
        if ( sentToWit ) {
            // Algoritmo que permite mapear la respuesta de WIT
            responseWit = await manageWit(data["msg"]);
        } else {
            console.log("----> Respuesta local <-----");
            responseWit = {
                traits: [ 'trato_track' ],
                traitsVal: [ 'trato_track->[orden]' ],
                intents: [ 'action_tracking' ],
                entities: [
                  'e_orden_especifico:e_orden_especifico',
                ],
                wit: {"entities":{
                    "e_orden_especifico:e_orden_especifico":
                    [{
                        "name":"e_orden_especifico",
                        "value": data["msg"]}],
                    },
                    "intents":[{
                        "name":"action_tracking"}],
                    "traits":{"trato_track":[{
                        "value":"orden"}]}}
            };
        }
        sentToWit = true;
        
        let serverResponse = await chatRobot(responseWit, indexChat);
        if ( serverResponse.includes("->") ) {
            sentToWit = false;
        }
        //console.log(serverResponse);
        tableChat.push(
            {"Usuario": data["msg"]},
            {"Intents": JSON.stringify(responseWit["intents"])},
            {"Traits": JSON.stringify(responseWit["traitsVal"])},
            {"Entities": JSON.stringify(responseWit["entities"])},
            {"Servidor": serverResponse},
            {"---": "-------------"}
        );

        console.log(tableChat.toString());

        socket.emit("response", {
            "msg": serverResponse
        });
        indexChat++;
    });
});

server.listen(4000, () => console.log("corriendo en el puerto 4000"));