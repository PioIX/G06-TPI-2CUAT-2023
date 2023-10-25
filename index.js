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
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const Listen_Port = 3000;

const server = app.listen(Listen_Port, function() {
  console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
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

// Configuración de Firebase
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

// Importar AuthService
const authService = require("./authService");

//start

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { user, email, password } = req.body;

  try {
    await authService.registerUser(auth, { email, password });
    console.log(user);
    await MySQL.realizarQuery(`INSERT INTO Usuarios (administrador, usuario, email, partida, partidasGanadas, barcosHundidos) VALUES (0, "${user}", "${email}", 0, 0, 0)`);
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM Usuarios WHERE email = ${email}`);
    req.session.idUsuario= respuesta[0].id;
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
  res.render("login");
});

app.post("/login", async (req, res) => {
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
  res.render("home2", null);
});

app.get("/prueba", (req, res) => {
  res.render("prueba", null);
});

/************************************** */
app.get("/home3", (req,res) => {
  req.session.buscarPartida=0;
  res.render("home3", null);
});

app.get("/juego", (req,res) => {
  req.session.buscarPartida=1;
  console.log(req.session.buscarPartida);
  res.render("juego", null);
});

io.on("connection", (socket) => {
  const req = socket.request;
  req.session.sala=1;
  socket.join(req.session.sala);
  

  if (req.session.buscarPartida==1) {

    console.log("entre al if");
    req.session.buscarPartida=0;
    socket.leave(req.session.sala)
    req.session.sala+=1;
    socket.join(req.session.sala);
    io./*to(req.session.sala).*/emit("buscarPartida", {mensaje: "Usuario está buscando partida"})
  }

  /*socket.on('nuevo-mensaje', async(data) => {
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
  }); */
});
setInterval(() => io.emit("server-message", { mensaje: "MENSAJE DEL SERVIDOR" }), 2000);