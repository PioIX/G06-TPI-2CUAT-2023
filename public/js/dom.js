const IP = "ws://localhost:3000";
const socket = io(IP);

async function putJSON() {
    data ={
      email: document.getElementById("box5").value,
      password: document.getElementById("box6").value
    }
    try {
      const response = await fetch("/login", { 
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Success:", result);
      if (result.validar == false) {
        alert("Los datos son incorrectos");
      } 
      else {
        if (result.userType == true) {
          location.href = "/admin";
        }
        else{
            idUsuarioLogueado = result.idUsuario;
            document.getElementById("idOculto").value = result.idUsuario;
            location.href = `/home3?valor=${document.getElementById("idOculto").value}`;
        }
      }
  
    } catch (error) {
        console.error("Error:", error);
    }
  }

let tablero = ["A", "B", "C", "D", "E","F","G","H","I","J", "K", "L", "M","N","Ñ"];
let letras = ["A", "B", "C", "D", "E","F","G","H","I","J", "K", "L", "M","N","Ñ"];
let barcos = ["0x0", "mina", "2x1", "3x1", "4x1", "5x2"];
let queBarco = 0;
let orientacion = "horizontal";
let enviar = false;

class Celda {
    constructor(){
        this.barco = false;
        this.mina = false;
        this.cabezaBarcoY = "";
        this.cabezaBarcoX = "";
        this.clickeado = false;
        this.prohibidoY= [];
        this.prohibidoX= [];
        this.tamaño = "";
        this.orientacion = "";
    }
}
class Barco {
    constructor(){
        this.barco = false;
        this.mina = false;
        this.cabezaBarco = null;
        this.tamaño = null;
        this.orientacion = null;
    }
} 

function NumeroLetra(letra) {
    for (let i=0; i<letras.length; i++){
        if (letras[i]==letra){
            letraPrueba=i;
        }
    }
    return letraPrueba;
}

function casillerosNegros() {
    for (let i=0;i<letras.length; i++){
        tablero[i]= [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        for (let x=1; x<16; x++){
            let celda = letras[i]+x;
            document.getElementById(celda).style.backgroundColor = "rgba(147, 181, 243, 0.855)";
            tablero[i][x-1] = new Celda();
        }
    } 
}

document.addEventListener("DOMContentLoaded", function() {
    casillerosNegros();
});
  
function analizarCelda (celdaPrueba) {
    let numPrueba = 0;
    for(let i=0; i<celdaPrueba.length; i++) {
        if (i!=0) {
            if (celdaPrueba.length==2) {
                numPrueba = parseInt(celdaPrueba[i]);
            } else {
                if (i==1){
                    numPrueba = celdaPrueba[i];
                } else {
                    numPrueba += celdaPrueba[i];
                }
            }
        }
    }
    numPrueba = parseInt(numPrueba);
    let letraPrueba = 0;
    for (let i=0; i<letras.length; i++){
        if (letras[i]==celdaPrueba[0]){
            letraPrueba=i;
        }
    }
    return {numPrueba: numPrueba, letraPrueba: letras[letraPrueba]}
}

function analizarHorizontal (numPruebaOG, letraPruebaOG, numOG, letraOG, hacer) {
    //derecha
    let numPrueba= numPruebaOG;
    let celdaDerecha = letraPruebaOG+numPrueba;
    let letraPrueba= 0
    while (document.getElementById(celdaDerecha).style.backgroundColor == "green") { //color1
        numPrueba++;
        celdaDerecha= letraPruebaOG+(numPrueba);
        if (numPrueba>15){
            break;
        }
    }
    if (numPrueba<16) {
        if (document.getElementById(celdaDerecha).style.backgroundColor != "green"){ //color3
            document.getElementById(celdaDerecha).style.backgroundColor = "rgba(240, 91, 91, 0.855)";
            for (let i=0; i<letras.length; i++){
                if (letras[i]==letraPruebaOG) {
                    letraPrueba=i
                }
            }
            if (hacer==true){
                tablero[letraPrueba][numPrueba-1].prohibidoY.push(letraOG);
                tablero[letraPrueba][numPrueba-1].prohibidoX.push(numOG);
            }
            
        }
    }
    let derecha= numPrueba
    //izquierda
    numPrueba= numPruebaOG;
    let celdaIzquierda = letraPruebaOG+(numPrueba);
    while (document.getElementById(celdaIzquierda).style.backgroundColor == "green") {
        numPrueba--;
        celdaIzquierda= letraPruebaOG+(numPrueba);
        if (numPrueba<1){
            break;
        }
    }
    if (numPrueba>0) {
        if (document.getElementById(celdaIzquierda).style.backgroundColor != "green"){
            document.getElementById(celdaIzquierda).style.backgroundColor = "rgba(240, 91, 91, 0.855)";
            for (let i=0; i<letras.length; i++){
                if (letras[i]==letraPruebaOG) {
                    letraPrueba=i
                }
            }
            if (hacer==true){
                tablero[letraPrueba][numPrueba-1].prohibidoY.push(letraOG);
                tablero[letraPrueba][numPrueba-1].prohibidoX.push(numOG);
            }
        }
    }
    let izquierda = numPrueba
    return {derecha, izquierda}
}

function analizarVertical(numPrueba, letraPruebaOG, derecha, izquierda) {
    //arriba
    
    let celdaArriba = letraPruebaOG+(numPrueba);
    let letraPrueba = NumeroLetra(letraPruebaOG)
    let letraArriba = "";
    let letraAbajo = "";

    
    while (document.getElementById(celdaArriba).style.backgroundColor == "green") {
        analizarHorizontal (numPrueba, letraPruebaOG, numPrueba, letraPruebaOG, true)
        letraPrueba--;
        celdaArriba= letras[letraPrueba]+(numPrueba);
        if (letraPrueba<0){
            break;
        }
    }
    if (letraPrueba>(-1)){
        if (document.getElementById(celdaArriba).style.backgroundColor != "green"){
            document.getElementById(celdaArriba).style.backgroundColor = "rgba(240, 91, 91, 0.855)";
            if (derecha<16){
                for (let i=numPrueba; i<(derecha+1); i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "rgba(240, 91, 91, 0.855)";
                    tablero[letraPrueba][i-1].prohibidoY.push(letraPruebaOG);
                    tablero[letraPrueba][i-1].prohibidoX.push(numPrueba);
                }
            } else {
                for (let i=numPrueba; i<16; i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "rgba(240, 91, 91, 0.855)";
                    tablero[letraPrueba][i-1].prohibidoY.push(letraPruebaOG);
                    tablero[letraPrueba][i-1].prohibidoX.push(numPrueba);
                }
            }
            if (izquierda>0){
                for (let i=izquierda; i<numPrueba; i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "rgba(240, 91, 91, 0.855)";
                    tablero[letraPrueba][i-1].prohibidoY.push(letraPruebaOG);
                    tablero[letraPrueba][i-1].prohibidoX.push(numPrueba);
                }
            }
        }
    }
    
    //abajo
    letraPrueba=NumeroLetra(letraPruebaOG);

    let celdaAbajo = letras[letraPrueba]+(numPrueba);
    while (document.getElementById(celdaAbajo).style.backgroundColor == "green") {
        if (NumeroLetra(letraPruebaOG) != letraPrueba) {
            analizarHorizontal (numPrueba, letras[letraPrueba], numPrueba, letraPruebaOG, true)
        } else {
            analizarHorizontal (numPrueba, letras[letraPrueba], numPrueba, letraPruebaOG, false)
        }
        letraPrueba++;
        celdaAbajo= letras[letraPrueba]+(numPrueba);
        if (letraPrueba>14){
            break;
        }
    }

    if (letraPrueba<15){
        if (document.getElementById(celdaAbajo).style.backgroundColor != "green"){
            document.getElementById(celdaAbajo).style.backgroundColor = "rgba(240, 91, 91, 0.855)";
            if (derecha<16){
                for (let i=numPrueba; i<(derecha+1); i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "rgba(240, 91, 91, 0.855)";
                    tablero[letraPrueba][i-1].prohibidoY.push(letraPruebaOG);
                    tablero[letraPrueba][i-1].prohibidoX.push(numPrueba);
                }
            } else {
                for (let i=numPrueba; i<16; i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "rgba(240, 91, 91, 0.855)";
                    tablero[letraPrueba][i-1].prohibidoY.push(letraPruebaOG);
                    tablero[letraPrueba][i-1].prohibidoX.push(numPrueba);
                }
            }
            if (izquierda>0){
                for (let i=izquierda; i<numPrueba; i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "rgba(240, 91, 91, 0.855)";
                    tablero[letraPrueba][i-1].prohibidoY.push(letraPruebaOG);
                    tablero[letraPrueba][i-1].prohibidoX.push(numPrueba);
                }
            }
        }
    }
    letraPruebaOG = NumeroLetra(letraPruebaOG)
    for (let z; z<tablero[letraPruebaOG][derecha-1].prohibidoX.length; z++) {
        if (tablero[letraPruebaOG][derecha-1].prohibidoX[z]==numPrueba && tablero[letraPruebaOG][derecha-1].prohibidoY==letraPruebaOG){
            tablero[letraPruebaOG][derecha-1].prohibidoX.splice[z, 1];
            tablero[letraPruebaOG][derecha-1].prohibidoY.splice[z, 1];
        }

    }
    for (let z; z<tablero[letraPruebaOG][izquierda-1].prohibidoX.length; z++) {
        if (tablero[letraPruebaOG][izquierda-1].prohibidoX[z]==numPrueba && tablero[letraPruebaOG][izquierda-1].prohibidoY==letraPruebaOG){
            tablero[letraPruebaOG][izquierda-1].prohibidoX.splice[z, 1];
            tablero[letraPruebaOG][izquierda-1].prohibidoY.splice[z, 1];
        }
    } 
}

function borrar(numero, letra) {
    
    for (let i=0; i<tablero.length; i++) {
        for (let x=0; x<tablero[i].length; x++){
            for (let z=0; z<tablero[i][x].prohibidoX.length; z++){
                if (tablero[i][x].prohibidoX[z]==tablero [NumeroLetra(letra)][numero-1].cabezaBarcoX && tablero[i][x].prohibidoY[z]==tablero [NumeroLetra(letra)][numero-1].cabezaBarcoY) {
                    if (tablero[i][x].prohibidoX.length == 1 && tablero[i][x].prohibidoY.length == 1) {
                        document.getElementById(letras[i]+(x+1)).style.backgroundColor = "rgba(147, 181, 243, 0.855)";
                    }
                    tablero[i][x].prohibidoX.splice(z, 1);
                    tablero[i][x].prohibidoY.splice(z, 1);
                }
            }
        } 
    }
    const tablerito = JSON.parse(JSON.stringify(tablero));

    for (let i=0; i<tablerito.length; i++){
        for (let x=0; x<tablerito[i].length; x++){
            if (tablerito[i][x].cabezaBarcoY == tablerito [NumeroLetra(letra)][numero-1].cabezaBarcoY && tablerito[i][x].cabezaBarcoX == tablerito [NumeroLetra(letra)][numero-1].cabezaBarcoX){
                document.getElementById(letras[i]+(x+1)).style.backgroundColor= "rgba(147, 181, 243, 0.855)";
                tablero[i][x].tamaño = "";
                tablero[i][x].barco = false;
                tablero[i][x].mina = false;
                tablero[i][x].orientacion = "";
                tablero[i][x].cabezaBarcoX = "";
                tablero[i][x].cabezaBarcoY = "";
            } 
        }
    }
}

function direccion () {
    if (orientacion=="horizontal"){
        orientacion= "vertical";
    } else if (orientacion == "vertical"){
        orientacion = "horizontal";
    }
}

function elegirBarco(id) {
    let celda = id;
    let casilleros = 0;
    let mayor = -1;
    let barcosIguales = 0;
    for (let a = 0; a<barcos.length; a++){ //barcos
        casilleros = 0;
        if (parseInt(barcos[a][0])>parseInt(barcos[a][2])) {
            mayor= parseInt(barcos[a][0]);
        } else {
            mayor = parseInt(barcos[a][2]);
        }
        if (barcos[a].length<= 3) {
            if (mayor == 2) {
                barcosIguales = 4;
            } else if (mayor == 3) {
                barcosIguales = 3;
            } else if (mayor == 4) {
                barcosIguales = 2;
            } else if (mayor == 5) {
                barcosIguales = 1;
            }
        }
        for (let i = 0; i<tablero.length; i++){ //eje y
            for (let x = 0; x<tablero[i].length; x++){ //eje x
                if (barcos[a] == tablero[i][x].tamaño) {
                    casilleros++;
                }
            }
        }
        if (barcos[a].length>3){
            if (casilleros != 2) {
                queBarco = a;
            }
        } else {
            if (barcos[a][0]*barcos[a][2]*barcosIguales != casilleros){
                queBarco = a;
            }
        }
    }
    

    let tamaño = barcos[queBarco];
    let posicionX = parseInt(tamaño[0]);
    let posicionY = parseInt(tamaño[2]);
    let barco = [];
    let xd = true;
    if (tamaño.length>3 && document.getElementById(celda).style.backgroundColor != "green"){
        document.getElementById(celda).style.background = "blue";
        for (let i = 0; i < tablero.length; i++) {
            for (let x = 0; x < tablero[i].length; x++) {
              if (analizarCelda(celda).numPrueba - 1 == x && NumeroLetra(analizarCelda(celda).letraPrueba) == i) {
                tablero[i][x].mina = true;
                tablero[i][x].tamaño = tamaño;
                tablero[i][x].cabezaBarcoY = letras[i];
                tablero[i][x].cabezaBarcoX = x + 1;
              }
            }
          }

          
        if (queBarco==1){
            queBarco--;
            enviar = true
        }
    } else if (tamaño.length>3 && document.getElementById(celda).style.backgroundColor=="green"){
        alert ("mina mal ubicada");
    }
    else {

        if (orientacion == "horizontal"){
            for (let i=0; i<posicionX; i++){
                barco.push(analizarCelda(celda).letraPrueba + (analizarCelda(celda).numPrueba+i))
                for (let z=0; z<posicionY; z++){
                    if (z>0){
                        barco.push(letras[NumeroLetra(analizarCelda(celda).letraPrueba)+z]+ (analizarCelda(celda).numPrueba+i))
                        if(NumeroLetra(analizarCelda(celda).letraPrueba)+z > 14 || analizarCelda(celda).numPrueba+i>15){
                            xd=false
                        }
                    }
                }
            }
        } else if (orientacion=="vertical"){
            for (let i=0; i<posicionY; i++){
                barco.push(analizarCelda(celda).letraPrueba + (analizarCelda(celda).numPrueba+i))
                for (let z=0; z<posicionX; z++){
                    if (z>0){
                        barco.push(letras[NumeroLetra(analizarCelda(celda).letraPrueba)+z]+ (analizarCelda(celda).numPrueba+i))
                        if(NumeroLetra(analizarCelda(celda).letraPrueba)+z > 14 || analizarCelda(celda).numPrueba+i>15){
                            xd=false
                        }
                    }
                }
            }
        }
        

        if (xd==true){
            for (let a=0; a<barco.length; a++){
                if (document.getElementById(barco[a]).style.backgroundColor != "rgba(147, 181, 243, 0.855)"){
                    xd = false
                }
            }
        }


        if (document.getElementById(celda).style.backgroundColor == "green"){
            document.getElementById(celda).style.backgroundColor = "rgba(147, 181, 243, 0.855)";
            borrar(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba)
        } else {

            if (xd == false){
                alert("El barco está mal ubicado")
            } else if (document.getElementById(celda).style.backgroundColor == "rgba(147, 181, 243, 0.855)") {
                if (queBarco == 0){
                    alert ("Ya pusiste todos tus barcos")
                } else {
                    for (let i=0; i<barco.length; i++){
                        document.getElementById(barco[i]).style.background = "green";
                        tablero[NumeroLetra(analizarCelda(barco[i]).letraPrueba)][analizarCelda(barco[i]).numPrueba -1].barco = true;
                        tablero[NumeroLetra(analizarCelda(barco[i]).letraPrueba)][analizarCelda(barco[i]).numPrueba -1].cabezaBarcoX=analizarCelda(celda).numPrueba;
                        tablero[NumeroLetra(analizarCelda(barco[i]).letraPrueba)][analizarCelda(barco[i]).numPrueba -1].cabezaBarcoY=analizarCelda(celda).letraPrueba;
                        tablero[NumeroLetra(analizarCelda(barco[i]).letraPrueba)][analizarCelda(barco[i]).numPrueba -1].tamaño = tamaño;
                        tablero[NumeroLetra(analizarCelda(barco[i]).letraPrueba)][analizarCelda(barco[i]).numPrueba -1].orientacion = orientacion;
                    }
    
                    analizarVertical(
                        analizarCelda(celda).numPrueba, 
                        analizarCelda(celda).letraPrueba,
                        analizarHorizontal(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba, analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba, false).derecha,
                        analizarHorizontal(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba, analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba, false).izquierda
                    );
                }

            } else{
                alert ("pusiste todos los barcos");
            }
        }
    }
}

function buscarPartida () {
    socket.emit("buscarPartida", {usuario: document.getElementById("idOculto").value})
}

function guardarBarcos () {
    if (enviar){
        let barcosBD = [];
        let guardar = true;
        for (let i=0; i<tablero.length; i++){
            for (let x=0; x<tablero[i].length; x++){
                if (tablero[i][x].barco || tablero[i][x].mina){
                    for (let z=0; z<barcosBD.length; z++){
                        if (barcosBD[z].cabezaBarco== (tablero[i][x].cabezaBarcoY + tablero[i][x].cabezaBarcoX)){
                            guardar = false;
                        }
                    }
                    if (guardar) {
                        
                        let barco = new Barco;
                        barco.cabezaBarco= tablero[i][x].cabezaBarcoY + tablero[i][x].cabezaBarcoX;
                        if (tablero[i][x].barco){
                            barco.barco = true;
                        } else {
                            barco.mina = true
                        }
                        barco.orientacion = tablero[i][x].orientacion;
                        barco.tamaño = tablero[i][x].tamaño;
                        barcosBD.push(barco);
                    }
                }
                guardar = true;
            }
        }
        socket.emit("barcosGuardados", {barcos: barcosBD, idUsuario: parseInt(document.getElementById("idOculto").value), idPartida: parseInt(document.getElementById("idPartidaOculto").value)});
    } else {
        alert ("Todavía no pusiste todos tus barcos");
    }
}



socket.on("connect", () => {
    console.log("Me conecté a WS");
    
});

socket.on("partidaEncontrada", data =>{
    location.href = `/elegirBarco?valor=${document.getElementById("idOculto").value}&idPartida=${data.idPartida}`
});

socket.on ("partidaEnJuego", data => {
    location.href = `/juego?valor=${document.getElementById("idOculto").value}&idPartida=${data.idPartida}`
});

socket.on("server-message", data =>{
    console.log("Mensaje del servidor", data);
});

//admin



async function putJSON3(data3) {
  try {
    const response3 = await fetch("/admin", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data3),
    });
    const result3 = await response3.json();
    console.log("Success:", result3);

    if (result3.queEs === "buscarID") {
      console.log("Nombre de usuario recibido:", result3.nombreUsuario);
      if (result3.nombreUsuario) {
        document.getElementById("nombre").value = result3.nombreUsuario;
      } else {
        alert("No se encontró un nombre de usuario para el ID seleccionado");
      }
    } else if (result3.queEs === "editarUsuario") {
      alert("Usuario editado correctamente");
    } else if (result3.queEs === "otraOperacion") {
      // Manejar otras operaciones si es necesario
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function editarUsuario() {
  let idBuscado = parseInt(document.getElementById("categoriaDesplegable").value);
  let nuevoNombre = document.getElementById("nombre").value;
  let data3 = {
    queEs: "editarUsuario",
    idBuscado: idBuscado,
    nuevoNombre: nuevoNombre,
  };
  putJSON3(data3);
}

function buscarUsuario() {
  console.log("Función buscarUsuario llamada");
  let idBuscado = parseInt(document.getElementById("categoriaDesplegable").value);
  let data3 = {
    queEs: "buscarID",
    idBuscado: idBuscado,
  };
  putJSON3(data3);
}

async function borrarUsuario() {
  let idBuscado = parseInt(document.getElementById("categoriaDesplegable").value);
  let data3 = {
    queEs: "borrarUsuario",
    idBuscado: idBuscado,
  };
  putJSON3(data3);
}
