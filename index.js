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

app.listen(Listen_Port, function () {
  console.log(
    "Servidor NodeJS corriendo en http://localhost:" + Listen_Port + "/"
  );
});
app.use(session({secret: '123456', resave: true, saveUninitialized: true}));

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
  /*let letrasAbecedario = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ'];
  let tablero = `<div class="fondoJuego">
  <table width="600" height="600px"; border="0" cellspacing="1" cellpadding="1" bgcolor="#000000">`;
  for(let i=0; i<letrasAbecedario.length; i++) {
    tablero += `<tr align="center">`;
    for (let x=1; x<16; x++) {
      casillero=letrasAbecedario[i]+x;
      tablero += `<td id="${casillero}" onclick="atacar(id)"><font color="#ffffff">1</font></td>`
    }
    tablero +=`</tr>`
  }
  tablero += `    </table>
  </div>`
  console.log(tablero);*/
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
  console.log("soy un pedido GET /home3")
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