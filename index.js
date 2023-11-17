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

  const { email, password, user } = req.body;

  try {
    await authService.registerUser(auth, { email, password });
    res.render("login", {
      sendUser: MySQL.realizarQuery(`INSERT INTO Usuarios (administrador, usuario, email, partida, partidasGanadas, barcosHundidos) values(0, "${user}", "${email}", "0", "0", "0")`),
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
  const { email, password } = req.body;

  try {
    const userCredential = await authService.loginUser(auth, {
      email,
      password,
    });
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM Usuarios WHERE email = "${email}"`)
    if (respuesta.length > 0) {
            if (respuesta[0].email == email) {
                req.session.usuario = respuesta[0].usuario;
                req.session.administrador = respuesta[0].administrador;
                if (respuesta[0].administrador == 1) {
                    res.send({validar: true, userType: true});
                } else {
                    res.send({validar: true, userType: false, idUsuario: respuesta[0].id});
                }
            }
    }
    else{
        res.send({validar:false})    
    } // Aquí puedes redirigir al usuario a la página que desees después del inicio de sesión exitoso
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.send({validar:false})    
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
  res.render("home3", {idUsuario: req.query.valor});
});

app.get("/juego", async (req, res) => {
  try {
    const apiUrl = "http://worldtimeapi.org/api/timezone/America/Argentina/Buenos_Aires";
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    let horas = parseInt(data.datetime.split('T')[1].split(':')[0]);
    console.log(horas);
    if (horas > 17){
      res.render("juegoNoche", {idUsuario: req.query.valor, idPartida: req.query.idPartida});
    }
    else{
      res.render("juego", {idUsuario: req.query.valor, idPartida: req.query.idPartida});
    }
  } catch (error) {
    console.error('Error al obtener la hora:', error);
    res.status(500).json({ error: 'Error al obtener la hora' });
  }
});

app.get("/elegirBarco", async (req, res) => {
  console.log("soy un pedido GET /elegirBarco")
  try {
    const apiUrl = "http://worldtimeapi.org/api/timezone/America/Argentina/Buenos_Aires";
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    let horas = parseInt(data.datetime.split('T')[1].split(':')[0]);
    console.log(horas);
    if (horas > 17){
      res.render("elegirBarcoNoche", {idUsuario: req.query.valor, idPartida: req.query.idPartida});
    }
    else{
      res.render("elegirBarco", {idUsuario: req.query.valor, idPartida: req.query.idPartida});
    }
  } catch (error) {
    console.error('Error al obtener la hora:', error);
    res.status(500).json({ error: 'Error al obtener la hora' });
  }
});

app.get("/admin", (req, res) => {
  console.log("soy un pedido GET /admin")
  res.render("admin");
});


app.get("/admin", async (req, res) => {
  try {
    const idResult = await MySQL.realizarQuery(`SELECT id FROM Usuarios`);
    const usuarioResult = await MySQL.realizarQuery(`SELECT usuario FROM Usuarios`);

    res.render("admin", { id: idResult, usuario: usuarioResult });
  } catch (error) {
    console.error("Error en la obtención de datos:", error);
    res.status(500).send("Error en la obtención de datos");
  }
});



app.get("/homeAdmin", (req,res) => {
  res.render("homeAdmin", null);
});

app.put("/admin", async (req, res) => {
  const { queEs, idBuscado, nuevoNombre } = req.body;

  try {
    if (queEs === "buscarID") {
      const usuarioResult = await MySQL.realizarQuery(`SELECT usuario FROM Usuarios WHERE id = ${idBuscado}`);
      const nombreUsuario = usuarioResult.length > 0 ? usuarioResult[0].usuario : "";
      console.log("Nombre de usuario encontrado:", nombreUsuario);
      res.json({ queEs: "buscarID", nombreUsuario: nombreUsuario });
    } else if (queEs === "editarUsuario") {
      await MySQL.realizarQuery(`UPDATE Usuarios SET usuario = "${nuevoNombre}" WHERE id = ${idBuscado}`);
      res.json({ queEs: "editarUsuario" });
    } else if (queEs === "borrarUsuario") {
      await MySQL.realizarQuery(`DELETE FROM Usuarios WHERE id = ${idBuscado}`);
      res.json({ queEs: "borrarUsuario" });
    } else {
      // Manejar otras operaciones si es necesario
      res.json({ queEs: "otraOperacion" });
    }
  } catch (error) {
    console.error("Error en la operación:", error);
    res.status(500).json({ queEs, error: `Error en la operación ${queEs}` });
  }
});


app.get("/ganaste", (req, res) => {
  res.render("ganaste");
});
app.post("/ganaste", (req, res) => {
  res.render("home3");
});
app.get("/perdiste", (req, res) => {
  res.render("perdiste");
});
app.post("/perdiste", (req, res) => {
  res.render("home3");
});



let jugadores = 0;
let pjEnEspera = 0;

io.on("connection", (socket) => {
  const req = socket.request;
  socket.join(0);

  socket.on("buscarPartida", async (data) => {
    jugadores++
    let idUsuario = -1;
    if (jugadores == 1) {
      MySQL.realizarQuery(`INSERT INTO Partidas () values ()`)
      socket.leave(req.session.idPartida)
      MySQL.realizarQuery('SELECT * FROM Partidas order by id DESC limit 1')
        .then(result => {
          req.session.idPartida = result[0].id;
          return MySQL.realizarQuery(`INSERT INTO UsuariosPorPartida (idPartida, idJugador1) values (${req.session.idPartida}, ${data.usuario})`);
        })
        .then( () => {
          socket.join(req.session.idPartida);
        })
        .catch(error => {
          console.error('Error al realizar la consulta:', error);
        });
      
    } else if (jugadores == 2) {
      jugadores = 0;
      socket.leave(req.session.idPartida)

      MySQL.realizarQuery('SELECT * FROM Partidas order by id DESC limit 1')
        .then(result => {
          req.session.idPartida = result[0].id -1;
          return MySQL.realizarQuery(`UPDATE UsuariosPorPartida SET idJugador2 = "${data.usuario}" where idPartida = ${req.session.idPartida}`);
        })
        .then(() => {
          socket.join(req.session.idPartida);
          return MySQL.realizarQuery(`select * from UsuariosPorPartida where idPartida = ${req.session.idPartida}`);
        })
        .then(result => {
          io.to(req.session.idPartida).emit("partidaEncontrada", { jugador1: result[0].idJugador1, idJugador2: result[0].jugador2, idPartida: req.session.idPartida });
        })
        .catch(error => {
          console.error('Error al realizar la consulta:', error);
        });

    }
  })

  socket.on("barcosGuardados", async (data) => {
    
    for (let i=0; i<data.barcos.length; i++){
      if (data.barcos[i].mina){
        await MySQL.realizarQuery(`INSERT INTO Barcos (cabezaBarco, orientacion, idJugador, idPartida, mina) VALUES ("${data.barcos[i].cabezaBarco}", "${data.barcos[i].orientacion}", ${data.idUsuario}, ${data.idPartida}, ${data.barcos[i].mina})`)
      } else {
        await MySQL.realizarQuery(`INSERT INTO Barcos (tipo, cabezaBarco, orientacion, idJugador, idPartida) VALUES ("${data.barcos[i].tamaño}", "${data.barcos[i].cabezaBarco}", "${data.barcos[i].orientacion}", ${data.idUsuario}, ${data.idPartida})`)
      }
    }
    pjEnEspera ++;
    console.log("pjEnEspera", pjEnEspera)
    socket.join(data.idPartida)
    req.session.idPartida = data.idPartida
    if (pjEnEspera == 2){
      pjEnEspera = 0;
      console.log("entre al iffff")
      let result = await MySQL.realizarQuery(`SELECT * FROM Barcos WHERE idPartida = ${req.session.idPartida}`)
      io.to(req.session.idPartida).emit("partidaEnJuego", { idUsuario: data.idUsuario , idPartida: req.session.idPartida, barcos: result });
      
    }
  })
  socket.on ("atacarBarco", data => {
    io.to(data.idPartida).emit("barcoAtacado", {idUsuario: data.idUsuario, celda: data.celda})
  });
  socket.on ("devolucion", data => {
    io.to(data.idPartida).emit("devuelto", {idUsuario: data.idUsuario, celda: data.celda, color: data.color})
  })

  socket.on ("ganaste", data => {
    io.to(data.idPartida).emit("ganar", {idUsuario: data.idUsuario, celda: data.celda, color: data.color})
  })

  socket.on('disconnect', () => {
    //socket.leave(req.session.idGrupo);
  });
});
//setInterval(() => io.emit("server-message", { mensaje: "MENSAJE DEL SERVIDOR" }), 2000);


app.get("/admin", async (req, res) => {
  try {
    const idResult = await MySQL.realizarQuery(`SELECT id FROM Usuarios`);
    const usuarioResult = await MySQL.realizarQuery(`SELECT usuario FROM Usuarios`);

    res.render("admin", { id: idResult, usuario: usuarioResult });
  } catch (error) {
    console.error("Error en la obtención de datos:", error);
    res.status(500).send("Error en la obtención de datos");
  }
});



app.get("/homeAdmin", (req,res) => {
  res.render("homeAdmin", null);
});

app.put("/admin", async (req, res) => {
  const { queEs, idBuscado, nuevoNombre } = req.body;

  try {
    if (queEs === "buscarID") {
      const usuarioResult = await MySQL.realizarQuery(`SELECT usuario FROM Usuarios WHERE id = ${idBuscado}`);
      const nombreUsuario = usuarioResult.length > 0 ? usuarioResult[0].usuario : "";
      console.log("Nombre de usuario encontrado:", nombreUsuario);
      res.json({ queEs: "buscarID", nombreUsuario: nombreUsuario });
    } else if (queEs === "editarUsuario") {
      await MySQL.realizarQuery(`UPDATE Usuarios SET usuario = "${nuevoNombre}" WHERE id = ${idBuscado}`);
      res.json({ queEs: "editarUsuario" });
    } else if (queEs === "borrarUsuario") {
      await MySQL.realizarQuery(`DELETE FROM Usuarios WHERE id = ${idBuscado}`);
      res.json({ queEs: "borrarUsuario" });
    } else {
      // Manejar otras operaciones si es necesario
      res.json({ queEs: "otraOperacion" });
    }
  } catch (error) {
    console.error("Error en la operación:", error);
    res.status(500).json({ queEs, error: `Error en la operación ${queEs}` });
  }
});

app.get("/juegoNoche", (req, res) => {
  console.log("soy un pedido GET / -home-")
  res.render("juegoNoche");
});

app.get("/elegirBarcoNoche", (req, res) => {
  console.log("soy un pedido GET / -home-")
  res.render("elegirBarcoNoche");
});

