require("dotenv").config();
const sslRedirect = require("heroku-ssl-redirect").default;
const express = require("express");
const http = require("http");

const app = express();
const port = process.env.PORT || 3000;
const base = process.env.BASE || "/";
const server = http.createServer(app);

const socket = require("socket.io");
const io = socket(server);

app.use(sslRedirect());
app.use(express.static("public"));

const listener = server.listen(port, () => {
    console.log(`Server is listening on port ${listener.address().port}`);
});

app.get(base, (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});

app.get(base, (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});

app.get(base + 'circles', (request, response) => {
    response.sendFile(__dirname + "/views/circles/index.html");
});

app.get(base + 'circles/magnetic', (request, response) => {
    response.sendFile(__dirname + "/views/circles/magnetic.html");
});

app.get(base + 'circles/magnetic-singleuser', (request, response) => {
    response.sendFile(__dirname + "/views/circles/magnetic-singleuser.html");
});

app.get(base + 'circles/field', (request, response) => {
    response.sendFile(__dirname + "/views/circles/field.html");
});

/* -------------------------------------------------------------------------- */

// MAGNETS

let call = [];
let waitList = [];

// HANDLE CONNECTIONS
io.on("connection", socket => {
    console.log(`New connection: ${socket.id}`);

    const clientinfo = {
        id: socket.id,
        lat: 0,
        long: 0
    }

    socket.on("userinfo", data => {

        clientinfo.lat = data.lat;
        clientinfo.long = data.long;

        if (call.length < 2) {
            call.push(clientinfo);
            if (call.length == 2) {
                io.to(call[0].id).emit("start", call[1]);
                io.to(call[1].id).emit("start", call[0]);

                console.log(call);
            }
        } else {
            waitList.push(clientinfo);
        }
    });

    // HANDLE DISCONNECTIONS
    socket.on("disconnect", () => {
        console.log(`Disconnected: ${socket.id}`);
        removeClient(socket.id);
    });
});

function removeClient(socket_id) {
    if (call.some(e => e.id === socket_id)) {
        const index = call.map(e => e.id).indexOf(socket_id);
        call.splice(index, 1);
        console.log(call);
        if (call.length > 0) {
            io.to(call[0].id).emit("reset", "other party disconnected");
        }
        if (waitList.length > 0) {
            call.push(waitList[0]);
            waitList.shift();
            io.to(call[0].id).emit("reset", "other party disconnected");
            io.to(call[1].id).emit("start", call[0]);
        }
    }
    if (waitList.some(e => e.id === socket_id)) {
        const index = waitList.map(e => e.id).indexOf(socket_id);
        waitList.splice(index, 1);
    }
}