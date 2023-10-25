const IP = "ws://localhost:3000";
const socket = io(IP);

socket.on("connect", () => {
    console.log("Me conecté a WS");
    
});

socket.on("buscarPartida", data => {
    console.log(data.mensaje);
});

function atacar(id){
    console.log(id)
}

function buscarPartida(){
    socket.emit("buscar-partida", null);
}