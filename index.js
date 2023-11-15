const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser'); //Para el manejo de los strings JSON
const MySQL = require('./modulos/mysql'); //Añado el archivo mysql.js presente en la carpeta módulos
const session = require('express-session');

const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
} = require("firebase/auth");

const app = express(); //Inicializo express para el manejo de las peticiones

app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(bodyParser.urlencoded({ extended: false })); //Inicializo el parser JSON
app.use(bodyParser.json());

app.engine('handlebars', exphbs({ defaultLayout: 'main' })); //Inicializo Handlebars. Utilizo como base el layout "Main".
app.set('view engine', 'handlebars'); //Inicializo Handlebars

const Listen_Port = 3000; //Puerto por el que estoy ejecutando la página Web

const server = app.listen(Listen_Port, function () {
  console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});;

const io = require('socket.io')(server)

const sessionMiddleware = session({
  secret: "supersarasa",
  resave: false,
  saveUninitialized: false
});

app.use(sessionMiddleware);

io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

const firebaseConfig = {
  apiKey: "AIzaSyBPffjAlSqMD7InPCDKwx9BGOu1mvCKIZM",
  authDomain: "batalla-naval-1dfa8.firebaseapp.com",
  projectId: "batalla-naval-1dfa8",
  storageBucket: "batalla-naval-1dfa8.appspot.com",
  messagingSenderId: "748374051771",
  appId: "1:748374051771:web:e83795e9413b0ebb9ed29e"
};

const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);

const authService = require("./authService");

//start

app.get("/", (req, res) => {
  console.log("soy un pedido GET / -home-")
  res.render("home");
});

app.get("/register", (req, res) => {
  console.log("soy un pedido GET /register")
  res.render("register");
});

app.post("/register", async (req, res) => {
  console.log("soy un pedido POST /register")
  const { email, password } = req.body;

  try {
    await authService.registerUser(auth, { email, password });
    res.render("register", {
      message: "Registro exitoso. Puedes iniciar sesión ahora.",
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.render("register", {
      message: "Error en el registro: " + error.message,
    });
  }
});

app.get("/login", (req, res) => {
  console.log("soy un pedido GET /login")
  res.render("login");
});

app.post("/login", async (req, res) => {
  console.log("soy un pedido POST /login")
  const { email, password } = req.body;
  req.session.usuario = email;
  try {
    const userCredential = await authService.loginUser(auth, {
      email,
      password,
    });
    // Aquí puedes redirigir al usuario a la página que desees después del inicio de sesión exitoso
    res.redirect("/home3");
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.render("login", {
      message: "Error en el inicio de sesión: " + error.message,
    });
  }
});

app.get("/home2", (req, res) => {
  console.log("soy un pedido GET /home2")
  // Agrega aquí la lógica para mostrar la página del dashboard
  res.render("home2", null);
});

app.get("/prueba", (req, res) => {
  console.log("soy un pedido GET /prueba")
  // Agrega aquí la lógica para mostrar la página del dashboard
  res.render("prueba", null);
});

/************************************** */
app.get("/home3", (req, res) => {
  console.log("soy un pedido GET /home3");
  req.session.idPartida = 0;
  res.render("home3", null);
});

app.get("/juego", (req, res) => {
  console.log("soy un pedido GET /juego")
  res.render("juego", null);
});

app.get("/elegirBarco", (req, res) => {
  console.log("soy un pedido GET /elegirBarco")
  res.render("elegirBarco", null);
});


let jugadores = 0;

io.on("connection", (socket) => {
  const req = socket.request;
  socket.join(0);

  socket.on("buscarPartida", async (data) => {
    console.log("entre perro")
    console.log("aaaaa id jugador: ", data.usuario)
    jugadores++
    if (jugadores == 1) {
      console.log("entre al if")
      MySQL.realizarQuery(`INSERT INTO Partidas () values ()`)
      socket.leave(req.session.idPartida)
      req.session.idPartida = MySQL.realizarQuery(`select * from Partidas`);  //order by id DESC limit 1
      console.log("req session: ", req.session.idPartida)
      socket.join(req.session.idPartida)
      MySQL.realizarQuery(`INSERT INTO UsuariosPorPartida (idPartida, idJugador1) values (${req.session.idPartida}, "${data.usuario}")`);
    } else if (jugadores == 2) {
      jugadores = 0;
      socket.leave(req.session.idPartida)
      req.session.idPartida = MySQL.realizarQuery(`select * from Partidas order by id limit 1`).id;
      socket.join(req.session.idPartida)
      MySQL.realizarQuery(`UPDATE UsuariosPorPartida SET idJugador2 = "${data.usuario}" where idPartida = ${req.session.idPartida}`);
      let consulta = MySQL.realizarQuery(`select * from UsuariosPorPartida where idPartida = ${req.session.idPartida}`);
      io.to(req.session.idPartida).emit("partidaEncontrada", { jugador1: consulta[0].jugador1, jugador2: consulta[0].jugador2 });
    }
  })


  socket.on('disconnect', () => {
    socket.leave(req.session.idGrupo);
  });
});
//setInterval(() => io.emit("server-message", { mensaje: "MENSAJE DEL SERVIDOR" }), 2000);