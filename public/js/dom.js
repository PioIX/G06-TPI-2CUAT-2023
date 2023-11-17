const IP = "ws://localhost:3000";
const socket = io(IP);

function delay(timeInMs) {
    return new Promise(resolve => setTimeout(resolve, timeInMs));
  }

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
    console.log("data que me llega: ", letra, numero);
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
    for (let i=0; i<tablero.length; i++){
        for (let x=0; x<tablero[i].length; x++){
            if (tablero[i][x].cabezaBarcoY == tablero [NumeroLetra(letra)][numero-1].cabezaBarcoY && tablero[i][x].cabezaBarcoX == tablero [NumeroLetra(letra)][numero-1].cabezaBarcoX){
                console.log(letras[i] + (x+1))
                document.getElementById(letras[i]+(x+1)).style.backgroundColor= "rgba(147, 181, 243, 0.855)";
                tablero[i][x].tamaño = "";
                tablero[i][x].barco = false;
                tablero[i][x].mina = false;
                tablero[i][x].orientacion = "";
                /*tablero[i][x].cabezaBarcoX = "";
                tablero[i][x].cabezaBarcoY = ""; */
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
        document.getElementById(celda).style.background = "yellow";
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
    document.getElementById("pantallaTotal").innerHTML = `
    <div class="fondoJuego">
    <div class="pagJuego">
        <table width="700" height="700px"; border="0" cellspacing="1" cellpadding="1" bgcolor="#000000" class="tablero1">
            <tr align="center">
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">Mi Tablero</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">1</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">2</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">3</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">4</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">5</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">6</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">7</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">8</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">9</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">10</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">11</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">12</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">13</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">14</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">15</font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">A</font></td>
                <td id="A1"   class="celda" ><font color="#ffffff"></font></td>
                <td id="A2"   class="celda"><font color="#ffffff"></font></td>
                <td id="A3"   class="celda"><font color="#ffffff"></font></td>
                <td id="A4"   class="celda"><font color="#ffffff"></font></td>
                <td id="A5"   class="celda"><font color="#ffffff"></font></td>
                <td id="A6"   class="celda"><font color="#ffffff"></font></td>
                <td id="A7"   class="celda"><font color="#ffffff"></font></td>
                <td id="A8"   class="celda"><font color="#ffffff"></font></td>
                <td id="A9"   class="celda"><font color="#ffffff"></font></td>
                <td id="A10"   class="celda"><font color="#ffffff"></font></td>
                <td id="A11"   class="celda"><font color="#ffffff"></font></td>
                <td id="A12"   class="celda"><font color="#ffffff"></font></td>
                <td id="A13"   class="celda"><font color="#ffffff"></font></td>
                <td id="A14"   class="celda"><font color="#ffffff"></font></td>
                <td id="A15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center" B>
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">B</font></td>
                <td id="B1"   class="celda"><font color="#ffffff"></font></td>
                <td id="B2"   class="celda"><font color="#ffffff"></font></td>
                <td id="B3"   class="celda"><font color="#ffffff"></font></td>
                <td id="B4"   class="celda"><font color="#ffffff"></font></td>
                <td id="B5"   class="celda"><font color="#ffffff"></font></td>
                <td id="B6"   class="celda"><font color="#ffffff"></font></td>
                <td id="B7"   class="celda"><font color="#ffffff"></font></td>
                <td id="B8"   class="celda"><font color="#ffffff"></font></td>
                <td id="B9"   class="celda"><font color="#ffffff"></font></td>
                <td id="B10"   class="celda"><font color="#ffffff"></font></td>
                <td id="B11"   class="celda"><font color="#ffffff"></font></td>
                <td id="B12"   class="celda"><font color="#ffffff"></font></td>
                <td id="B13"   class="celda"><font color="#ffffff"></font></td>
                <td id="B14"   class="celda"><font color="#ffffff"></font></td>
                <td id="B15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">C</font></td>
                <td id="C1"   class="celda"><font color="#ffffff"></font></td>
                <td id="C2"   class="celda"><font color="#ffffff"></font></td>
                <td id="C3"   class="celda"><font color="#ffffff"></font></td>
                <td id="C4"   class="celda"><font color="#ffffff"></font></td>
                <td id="C5"   class="celda"><font color="#ffffff"></font></td>
                <td id="C6"   class="celda"><font color="#ffffff"></font></td>
                <td id="C7"   class="celda"><font color="#ffffff"></font></td>
                <td id="C8"   class="celda"><font color="#ffffff"></font></td>
                <td id="C9"   class="celda"><font color="#ffffff"></font></td>
                <td id="C10"   class="celda"><font color="#ffffff"></font></td>
                <td id="C11"   class="celda"><font color="#ffffff"></font></td>
                <td id="C12"   class="celda"><font color="#ffffff"></font></td>
                <td id="C13"   class="celda"><font color="#ffffff"></font></td>
                <td id="C14"   class="celda"><font color="#ffffff"></font></td>
                <td id="C15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">D</font></td>
                <td id="D1"   class="celda"><font color="#ffffff"></font></td>
                <td id="D2"   class="celda"><font color="#ffffff"></font></td>
                <td id="D3"   class="celda"><font color="#ffffff"></font></td>
                <td id="D4"   class="celda"><font color="#ffffff"></font></td>
                <td id="D5"   class="celda"><font color="#ffffff"></font></td>
                <td id="D6"   class="celda"><font color="#ffffff"></font></td>
                <td id="D7"   class="celda"><font color="#ffffff"></font></td>
                <td id="D8"   class="celda"><font color="#ffffff"></font></td>
                <td id="D9"   class="celda"><font color="#ffffff"></font></td>
                <td id="D10"   class="celda"><font color="#ffffff"></font></td>
                <td id="D11"   class="celda"><font color="#ffffff"></font></td>
                <td id="D12"   class="celda"><font color="#ffffff"></font></td>
                <td id="D13"   class="celda"><font color="#ffffff"></font></td>
                <td id="D14"   class="celda"><font color="#ffffff"></font></td>
                <td id="D15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">E</font></td>
                <td id="E1"   class="celda"><font color="#ffffff"></font></td>
                <td id="E2"   class="celda"><font color="#ffffff"></font></td>
                <td id="E3"   class="celda"><font color="#ffffff"></font></td>
                <td id="E4"   class="celda"><font color="#ffffff"></font></td>
                <td id="E5"   class="celda"><font color="#ffffff"></font></td>
                <td id="E6"   class="celda"><font color="#ffffff"></font></td>
                <td id="E7"   class="celda"><font color="#ffffff"></font></td>
                <td id="E8"   class="celda"><font color="#ffffff"></font></td>
                <td id="E9"   class="celda"><font color="#ffffff"></font></td>
                <td id="E10"   class="celda"><font color="#ffffff"></font></td>
                <td id="E11"   class="celda"><font color="#ffffff"></font></td>
                <td id="E12"   class="celda"><font color="#ffffff"></font></td>
                <td id="E13"   class="celda"><font color="#ffffff"></font></td>
                <td id="E14"   class="celda"><font color="#ffffff"></font></td>
                <td id="E15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">F</font></td>
                <td id="F1"   class="celda"><font color="#ffffff"></font></td>
                <td id="F2"   class="celda"><font color="#ffffff"></font></td>
                <td id="F3"   class="celda"><font color="#ffffff"></font></td>
                <td id="F4"   class="celda"><font color="#ffffff"></font></td>
                <td id="F5"   class="celda"><font color="#ffffff"></font></td>
                <td id="F6"   class="celda"><font color="#ffffff"></font></td>
                <td id="F7"   class="celda"><font color="#ffffff"></font></td>
                <td id="F8"   class="celda"><font color="#ffffff"></font></td>
                <td id="F9"   class="celda"><font color="#ffffff"></font></td>
                <td id="F10"   class="celda"><font color="#ffffff"></font></td>
                <td id="F11"   class="celda"><font color="#ffffff"></font></td>
                <td id="F12"   class="celda"><font color="#ffffff"></font></td>
                <td id="F13"   class="celda"><font color="#ffffff"></font></td>
                <td id="F14"   class="celda"><font color="#ffffff"></font></td>
                <td id="F15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">G</font></td>
                <td id="G1"   class="celda"><font color="#ffffff"></font></td>
                <td id="G2"   class="celda"><font color="#ffffff"></font></td>
                <td id="G3"   class="celda"><font color="#ffffff"></font></td>
                <td id="G4"   class="celda"><font color="#ffffff"></font></td>
                <td id="G5"   class="celda"><font color="#ffffff"></font></td>
                <td id="G6"   class="celda"><font color="#ffffff"></font></td>
                <td id="G7"   class="celda"><font color="#ffffff"></font></td>
                <td id="G8"   class="celda"><font color="#ffffff"></font></td>
                <td id="G9"   class="celda"><font color="#ffffff"></font></td>
                <td id="G10"   class="celda"><font color="#ffffff"></font></td>
                <td id="G11"   class="celda"><font color="#ffffff"></font></td>
                <td id="G12"   class="celda"><font color="#ffffff"></font></td>
                <td id="G13"   class="celda"><font color="#ffffff"></font></td>
                <td id="G14"   class="celda"><font color="#ffffff"></font></td>
                <td id="G15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">H</font></td>
                <td id="H1"   class="celda"><font color="#ffffff"></font></td>
                <td id="H2"   class="celda"><font color="#ffffff"></font></td>
                <td id="H3"   class="celda"><font color="#ffffff"></font></td>
                <td id="H4"   class="celda"><font color="#ffffff"></font></td>
                <td id="H5"   class="celda"><font color="#ffffff"></font></td>
                <td id="H6"   class="celda"><font color="#ffffff"></font></td>
                <td id="H7"   class="celda"><font color="#ffffff"></font></td>
                <td id="H8"   class="celda"><font color="#ffffff"></font></td>
                <td id="H9"   class="celda"><font color="#ffffff"></font></td>
                <td id="H10"   class="celda"><font color="#ffffff"></font></td>
                <td id="H11"   class="celda"><font color="#ffffff"></font></td>
                <td id="H12"   class="celda"><font color="#ffffff"></font></td>
                <td id="H13"   class="celda"><font color="#ffffff"></font></td>
                <td id="H14"   class="celda"><font color="#ffffff"></font></td>
                <td id="H15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">I</font></td>
                <td id="I1"   class="celda"><font color="#ffffff"></font></td>
                <td id="I2"   class="celda"><font color="#ffffff"></font></td>
                <td id="I3"   class="celda"><font color="#ffffff"></font></td>
                <td id="I4"   class="celda"><font color="#ffffff"></font></td>
                <td id="I5"   class="celda"><font color="#ffffff"></font></td>
                <td id="I6"   class="celda"><font color="#ffffff"></font></td>
                <td id="I7"   class="celda"><font color="#ffffff"></font></td>
                <td id="I8"   class="celda"><font color="#ffffff"></font></td>
                <td id="I9"   class="celda"><font color="#ffffff"></font></td>
                <td id="I10"   class="celda"><font color="#ffffff"></font></td>
                <td id="I11"   class="celda"><font color="#ffffff"></font></td>
                <td id="I12"   class="celda"><font color="#ffffff"></font></td>
                <td id="I13"   class="celda"><font color="#ffffff"></font></td>
                <td id="I14"   class="celda"><font color="#ffffff"></font></td>
                <td id="I15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">J</font></td>
                <td id="J1"   class="celda"><font color="#ffffff"></font></td>
                <td id="J2"   class="celda"><font color="#ffffff"></font></td>
                <td id="J3"   class="celda"><font color="#ffffff"></font></td>
                <td id="J4"   class="celda"><font color="#ffffff"></font></td>
                <td id="J5"   class="celda"><font color="#ffffff"></font></td>
                <td id="J6"   class="celda"><font color="#ffffff"></font></td>
                <td id="J7"   class="celda"><font color="#ffffff"></font></td>
                <td id="J8"   class="celda"><font color="#ffffff"></font></td>
                <td id="J9"   class="celda"><font color="#ffffff"></font></td>
                <td id="J10"   class="celda"><font color="#ffffff"></font></td>
                <td id="J11"   class="celda"><font color="#ffffff"></font></td>
                <td id="J12"   class="celda"><font color="#ffffff"></font></td>
                <td id="J13"   class="celda"><font color="#ffffff"></font></td>
                <td id="J14"   class="celda"><font color="#ffffff"></font></td>
                <td id="J15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">K</font></td>
                <td id="K1"   class="celda"><font color="#ffffff"></font></td>
                <td id="K2"   class="celda"><font color="#ffffff"></font></td>
                <td id="K3"   class="celda"><font color="#ffffff"></font></td>
                <td id="K4"   class="celda"><font color="#ffffff"></font></td>
                <td id="K5"   class="celda"><font color="#ffffff"></font></td>
                <td id="K6"   class="celda"><font color="#ffffff"></font></td>
                <td id="K7"   class="celda"><font color="#ffffff"></font></td>
                <td id="K8"   class="celda"><font color="#ffffff"></font></td>
                <td id="K9"   class="celda"><font color="#ffffff"></font></td>
                <td id="K10"   class="celda"><font color="#ffffff"></font></td>
                <td id="K11"   class="celda"><font color="#ffffff"></font></td>
                <td id="K12"   class="celda"><font color="#ffffff"></font></td>
                <td id="K13"   class="celda"><font color="#ffffff"></font></td>
                <td id="K14"   class="celda"><font color="#ffffff"></font></td>
                <td id="K15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">L</font></td>
                <td id="L1"   class="celda"><font color="#ffffff"></font></td>
                <td id="L2"   class="celda"><font color="#ffffff"></font></td>
                <td id="L3"   class="celda"><font color="#ffffff"></font></td>
                <td id="L4"   class="celda"><font color="#ffffff"></font></td>
                <td id="L5"   class="celda"><font color="#ffffff"></font></td>
                <td id="L6"   class="celda"><font color="#ffffff"></font></td>
                <td id="L7"   class="celda"><font color="#ffffff"></font></td>
                <td id="L8"   class="celda"><font color="#ffffff"></font></td>
                <td id="L9"   class="celda"><font color="#ffffff"></font></td>
                <td id="L10"   class="celda"><font color="#ffffff"></font></td>
                <td id="L11"   class="celda"><font color="#ffffff"></font></td>
                <td id="L12"   class="celda"><font color="#ffffff"></font></td>
                <td id="L13"   class="celda"><font color="#ffffff"></font></td>
                <td id="L14"   class="celda"><font color="#ffffff"></font></td>
                <td id="L15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">M</font></td>
                <td id="M1"   class="celda"><font color="#ffffff"></font></td>
                <td id="M2"   class="celda"><font color="#ffffff"></font></td>
                <td id="M3"   class="celda"><font color="#ffffff"></font></td>
                <td id="M4"   class="celda"><font color="#ffffff"></font></td>
                <td id="M5"   class="celda"><font color="#ffffff"></font></td>
                <td id="M6"   class="celda"><font color="#ffffff"></font></td>
                <td id="M7"   class="celda"><font color="#ffffff"></font></td>
                <td id="M8"   class="celda"><font color="#ffffff"></font></td>
                <td id="M9"   class="celda"><font color="#ffffff"></font></td>
                <td id="M10"   class="celda"><font color="#ffffff"></font></td>
                <td id="M11"   class="celda"><font color="#ffffff"></font></td>
                <td id="M12"   class="celda"><font color="#ffffff"></font></td>
                <td id="M13"   class="celda"><font color="#ffffff"></font></td>
                <td id="M14"   class="celda"><font color="#ffffff"></font></td>
                <td id="M15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">N</font></td>
                <td id="N1"   class="celda"><font color="#ffffff"></font></td>
                <td id="N2"   class="celda"><font color="#ffffff"></font></td>
                <td id="N3"   class="celda"><font color="#ffffff"></font></td>
                <td id="N4"   class="celda"><font color="#ffffff"></font></td>
                <td id="N5"   class="celda"><font color="#ffffff"></font></td>
                <td id="N6"   class="celda"><font color="#ffffff"></font></td>
                <td id="N7"   class="celda"><font color="#ffffff"></font></td>
                <td id="N8"   class="celda"><font color="#ffffff"></font></td>
                <td id="N9"   class="celda"><font color="#ffffff"></font></td>
                <td id="N10"   class="celda"><font color="#ffffff"></font></td>
                <td id="N11"   class="celda"><font color="#ffffff"></font></td>
                <td id="N12"   class="celda"><font color="#ffffff"></font></td>
                <td id="N13"   class="celda"><font color="#ffffff"></font></td>
                <td id="N14"   class="celda"><font color="#ffffff"></font></td>
                <td id="N15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
            <tr align="center">
                <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">Ñ</font></td>
                <td id="Ñ1"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ2"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ3"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ4"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ5"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ6"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ7"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ8"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ9"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ10"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ11"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ12"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ13"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ14"   class="celda"><font color="#ffffff"></font></td>
                <td id="Ñ15"   class="celda"><font color="#ffffff"></font></td>
            </tr>
        </table>
        <table width="700" height="700px"; border="0" cellspacing="1" cellpadding="1" bgcolor="#000000" class="tablero2">
            <tr align="center">
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">Su Tablero</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">1</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">2</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">3</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">4</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">5</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">6</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">7</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">8</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">9</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">10</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">11</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">12</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">13</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">14</font></td>
                <td bgcolor="#ffffff" class="numColumna"><font class="txtJuego">15</font></td>
            </tr>
            <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">A</font></td>
            <td id="2A1"  onclick="atacarBarco(id)" class="celda" ><font color="#ffffff"></font></td>
            <td id="2A2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2A15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center" B>
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">B</font></td>
            <td id="2B1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2B15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">C</font></td>
            <td id="2C1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2C15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">D</font></td>
            <td id="2D1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2D15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">E</font></td>
            <td id="2E1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2E15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">F</font></td>
            <td id="2F1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2F15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">G</font></td>
            <td id="2G1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2G15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">H</font></td>
            <td id="2H1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2H15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">I</font></td>
            <td id="2I1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2I15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">J</font></td>
            <td id="2J1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2J15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">K</font></td>
            <td id="2K1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2K15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">L</font></td>
            <td id="2L1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2L15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">M</font></td>
            <td id="2M1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2M15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">N</font></td>
            <td id="2N1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2N15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        <tr align="center">
            <td bgcolor="#ffffff" class="letraFila"><font class="txtJuego">Ñ</font></td>
            <td id="2Ñ1"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ2"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ3"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ4"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ5"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ6"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ7"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ8"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ9"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ10"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ11"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ12"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ13"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ14"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
            <td id="2Ñ15"  onclick="atacarBarco(id)" class="celda"><font color="#ffffff"></font></td>
        </tr>
        </table>
        <button class="bomba">
            <center><img src="img/bomb.png" width="40px" height="40px"></center>
        </button>
    </div>
</div>
    `;
    for (let i=0;i<letras.length; i++){
        for (let x=1; x<16; x++){
            let celda = "2"+letras[i]+x;
            document.getElementById(celda).style.background = "rgba(147, 181, 243, 0.855)";
        }
    } 
    for (let a=0; a<data.barcos.length; a++){
        if (data.barcos[a].idJugador == parseInt(document.getElementById("idOculto").value)){
            if (data.barcos[a].mina){
                document.getElementById(analizarCelda(data.barcos[a].cabezaBarco).letraPrueba + (analizarCelda(data.barcos[a].cabezaBarco).numPrueba)).style.background = "yellow";
            } else {
                document.getElementById(analizarCelda(data.barcos[a].cabezaBarco).letraPrueba + (analizarCelda(data.barcos[a].cabezaBarco).numPrueba)).style.background = "green";
                if (data.barcos[a].orientacion == "horizontal") {
                    for (let i = 0; i<parseInt(data.barcos[a].tipo[0]); i++){
                        document.getElementById(analizarCelda(data.barcos[a].cabezaBarco).letraPrueba + (analizarCelda(data.barcos[a].cabezaBarco).numPrueba + i)).style.background = "green";
                        if (parseInt(data.barcos[a].tipo[2])==2) {
                            document.getElementById(letras[NumeroLetra(analizarCelda(data.barcos[a].cabezaBarco).letraPrueba)+1] + (analizarCelda(data.barcos[a].cabezaBarco).numPrueba + i)).style.background = "green";
                        }
                    }
                }
                if (data.barcos[a].orientacion == "vertical") {
                    for (let i = 0; i<parseInt(data.barcos[a].tipo[0]); i++){
                        document.getElementById(letras[NumeroLetra(analizarCelda(data.barcos[a].cabezaBarco).letraPrueba)+i] + (analizarCelda(data.barcos[a].cabezaBarco).numPrueba)).style.background = "green";
                        if (parseInt(data.barcos[a].tipo[2])==2) {
                            document.getElementById(letras[NumeroLetra(analizarCelda(data.barcos[a].cabezaBarco).letraPrueba)+i] + (analizarCelda(data.barcos[a].cabezaBarco).numPrueba +1)).style.background = "green";
                        }
                    }
                }
            }
        }
    }

});
let puedoAtacar = true
let ataqueX2 = false;
function atacarBarco(celda) {
    console.log("puedo atacar? ", puedoAtacar)
     if (puedoAtacar){ 
        if (document.getElementById(celda).style.background == "rgba(147, 181, 243, 0.855)"){
            if (ataqueX2){
                ataqueX2=false;
            } else {
                for (let i = 0; i < letras.length; i++) {
                    for (let x = 1; x < 16; x++) {
                        let celda = "2" + letras[i] + x;
                        document.getElementById(celda).onclick = function() {};
                    }
                }
            }
            socket.emit("atacarBarco", {
                celda: celda,
                idUsuario: parseInt(document.getElementById("idOculto").value),
                idPartida: parseInt(document.getElementById("idPartidaOculto").value)
            });
        } else {
            alert("Posicion erronea. Ataque celdas que no hayan sido atacadas previamente")
        } 
    } else {
        puedoAtacar = true;
    } 
}

function analizarHundimiento (celda) {
    console.log("el color d la celda og es ", document.getElementById(celda).style.background)
    let verde = false
    for (let i=0; i<tablero.length; i++) {
        for (let x=0; x<tablero[i].length; x++) {
            let posicionX = analizarCelda(celda).numPrueba -1
            let posicionY = NumeroLetra(analizarCelda(celda).letraPrueba)
            if (tablero[posicionY][posicionX].cabezaBarcoX == tablero[i][x].cabezaBarcoX && tablero[posicionY][posicionX].cabezaBarcoY == tablero[i][x].cabezaBarcoY){
                console.log("entre perro")
                if (document.getElementById(letras[i] + (x+1)).style.background == "green"){
                    console.log(letras[i] + (x+1))
                    verde = true
                }
            }
        }
    }
    if (verde == false){
        
        for (let i=0; i<tablero.length; i++) {
            for (let x=0; x<tablero[i].length; x++) {
                let posicionX = analizarCelda(celda).numPrueba -1
                let posicionY = NumeroLetra(analizarCelda(celda).letraPrueba)
                if (tablero[posicionY][posicionX].cabezaBarcoX == tablero[i][x].cabezaBarcoX && tablero[posicionY][posicionX].cabezaBarcoY == tablero[i][x].cabezaBarcoY){
                    console.log("entre al if")
                    document.getElementById(letras[i] + (x+1)).style.background = "rgba(137, 14, 14, 0.855)"
                    socket.emit("devolucion", {celda: letras[i] + (x+1), color: "rgba(137, 14, 14, 0.855)", idUsuario: parseInt(document.getElementById("idOculto").value), idPartida: parseInt(document.getElementById("idPartidaOculto").value)})
                }
            }
        }
        let terminar = true;
        for (let i=0; i<tablero.length; i++) {
            for (let x=0; x<tablero[i].length; x++) {
                if (document.getElementById(letras[i]+(x+1)).style.background == "green") {
                    terminar = false;
                }
            }
        }
        if (terminar) {
            delay(4000).then(() => location.href = "/perdiste");
        }
    } else {
        console.log("que raro esto")
        socket.emit("devolucion", {celda: celda, color: "red", idUsuario: parseInt(document.getElementById("idOculto").value), idPartida: parseInt(document.getElementById("idPartidaOculto").value)})
    }
}



socket.on("barcoAtacado", data => {
    if (data.idUsuario != parseInt(document.getElementById("idOculto").value)) {
        for (let i = 0; i < letras.length; i++) {
            for (let x = 1; x < 16; x++) {
                let celda = "2" + letras[i] + x;
                document.getElementById(celda).onclick = function() {
                    atacarBarco(celda);
                };
            }
        }

        
        data.celda = data.celda.slice(1);
        if (document.getElementById(data.celda).style.background== "green"){
            document.getElementById(data.celda).style.background = "red";
            analizarHundimiento(data.celda);
            //socket.emit("devolucion", {celda: data.celda, color: "red", idUsuario: parseInt(document.getElementById("idOculto").value), idPartida: parseInt(document.getElementById("idPartidaOculto").value)})
        } else if (document.getElementById(data.celda).style.background== "yellow") {
            document.getElementById(data.celda).style.background = "orange";
            ataqueX2=true;
            socket.emit("devolucion", {celda: data.celda, color: "orange", idUsuario: parseInt(document.getElementById("idOculto").value), idPartida: parseInt(document.getElementById("idPartidaOculto").value)})
        } else{
                document.getElementById(data.celda).style.background = "blue";
                socket.emit("devolucion", {celda: data.celda, color: "blue", idUsuario: parseInt(document.getElementById("idOculto").value), idPartida: parseInt(document.getElementById("idPartidaOculto").value)})
        }
        //alert("es tu turno")
    }
});

socket.on("devuelto", data => {
    if (data.idUsuario != parseInt(document.getElementById("idOculto").value)){
        document.getElementById("2"+data.celda).style.background = data.color;
        if (data.color == "orange"){
            puedoAtacar = false;
            //alert("perdiste el turno")
        }
    }
});

socket.on ("ganar", data =>{
    console.log("entre al socketon")
    if (data.idUsuario != document.getElementById("idOculto").value){
        console.log("entre al socketon en if")
        location.href = '/ganaste';
    }
})


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
