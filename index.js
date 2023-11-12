const express = require("express");
const exphbs = require("express-handlebars");
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
} = require("firebase/auth");

const bodyParser = require('body-parser'); //Para el manejo de los strings JSON
const MySQL = require('./modulos/mysql'); //Añado el archivo mysql.js presente en la carpeta módulos
const session = require('express-session'); //Para usar variables de sesión

const app = express();
app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(express.urlencoded({ extended: false })); // habria que ponerlo en true ??? el firebase de Paul lo tenia en true
app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const Listen_Port = 3000;

const server = app.listen(Listen_Port, function () {
  console.log("Servidor NodeJS corriendo en http://localhost:" + Listen_Port + "/");
});

const io = require('socket.io')(server);

const sessionMiddleware = session({
  secret: 'sararasthastka',
  resave: true,
  saveUninitialized: false,
});

app.use(sessionMiddleware);

io.use(function(socket, next) {
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
app.get("/home3", (req,res) => {
  console.log("soy un pedido GET /home3");
  req.session.idPartida = 0;
  res.render("home3", null);
});

app.get("/juego", (req,res) => {
  console.log("soy un pedido GET /juego")
  res.render("juego", null);
});

app.get("/elegirBarco", (req,res) => {
  console.log("soy un pedido GET /elegirBarco")
  res.render("elegirBarco", null);
});


let jugadores = [];

io.on("connection", (socket) => {
  const req = socket.request;
  socket.join(0);

  console.log("aaaaaa");

  socket.on ("buscarPartida", data => {
    jugadores.push(data.idUsuario);
    if (jugadores.length>=2){
      //socket.
    }
  })



































  socket.on('nuevo-mensaje', async(data) => {
      await MySQL.realizarQuery(`INSERT INTO mensajesSK (contenido, fecha, idUsuario, idGrupo) VALUES ("${data.mensaje}", "${data.hora}", ${data.idUsuario}, ${req.session.idGrupo})`);
      let respuesta = await MySQL.realizarQuery(`SELECT * FROM UsuariosPorGruposSK WHERE idGrupo=${req.session.idGrupo}`);
      io.to(req.session.idGrupo).emit("recibir-mensaje", {mensaje: data.mensaje, date: data.hora, idUsuario: data.idUsuario, usuarios: respuesta});
  });

  socket.on('elegir-chat', async(data) => {
      socket.leave(req.session.idGrupo);
      req.session.idGrupo=data.id;
      socket.join(req.session.idGrupo);
      io.to(req.session.idGrupo).emit("chat-elegido", await getMensajes(req, data.idUsuarioPrueba));

  });


  socket.on('disconnect', () => {
      socket.leave(req.session.idGrupo);
  });
});
setInterval(() => io.emit("server-message", { mensaje: "MENSAJE DEL SERVIDOR" }), 2000);