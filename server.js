const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

var fs = require("fs");

/* 
const initialState = {
  A: 10,
  B: 0,
  C: 0,
  D: 0,
  X: [],
  Y: [],
};
 */

// Inizializza lo stato da un file JSON all'avvio del server
let state = loadStateFromFile();

io.on("connection", (socket) => {
  // Invia lo stato iniziale quando un client si connette
  socket.emit("initialState", state);

  // Aggiorna lo stato quando ricevi un nuovo stato dal client
  socket.on("updateState", (newState) => {
    state = newState;
    io.emit("updateState", state);
    saveStateToFile();
    console.log("State updated:", state);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Funzione per caricare lo stato da un file JSON
function loadStateFromFile() {
  try {
    const data = fs.readFileSync("state.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading state from file:", err.message);
    return {};
  }
}

// Funzione per salvare lo stato in un file JSON
function saveStateToFile() {
  try {
    const data = JSON.stringify(state, null, 2);
    fs.writeFileSync("state.json", data, "utf8");
    console.log("State saved to file");
  } catch (err) {
    console.error("Error saving state to file:", err.message);
  }
}
