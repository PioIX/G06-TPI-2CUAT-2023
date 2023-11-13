<<<<<<< Updated upstream
function atacar(id){
    console.log(id)

}

function elegirBarco(id) {
    let celda = document.getElementById(id);
    console.log(id[0]);
    let num = "";
    num = parseInt(num);
    if (celda.style.backgroundColor == "green"){
        celda.style.backgroundColor = "black";
        document.getElementById(id).value = 0;
=======
/*const IP = "ws://localhost:3001";
const socket = io(IP); */

let tablero = ["A", "B", "C", "D", "E","F","G","H","I","J", "K", "L", "M","N","Ñ"];
let letras = ["A", "B", "C", "D", "E","F","G","H","I","J", "K", "L", "M","N","Ñ"];
let barcos = ["5x2", "4x1", "4x1", "3x1", "3x1", "3x1", "2x1", "2x1", "2x1", "2x1", "mina1", "mina2"]
let queBarco = 0;
let orientacion = "horizontal";
class Celda {
    constructor(){
        this.barco = false;
        this.mina = false;
        this.cabezaBarcoY = "!";
        this.cabezaBarcoX = "";
        this.clickeado = false;
        this.prohibidoY= [];
        this.prohibidoX= [];
        this.tamaño = "";
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
            document.getElementById(celda).style.backgroundColor = "black";
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
            document.getElementById(celdaDerecha).style.backgroundColor = "red";
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
            document.getElementById(celdaIzquierda).style.backgroundColor = "red";
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
            document.getElementById(celdaArriba).style.backgroundColor = "red";
            if (derecha<16){
                for (let i=numPrueba; i<(derecha+1); i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
                    tablero[letraPrueba][i-1].prohibidoY.push(letraPruebaOG);
                    tablero[letraPrueba][i-1].prohibidoX.push(numPrueba);
                }
            } else {
                for (let i=numPrueba; i<16; i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
                    tablero[letraPrueba][i-1].prohibidoY.push(letraPruebaOG);
                    tablero[letraPrueba][i-1].prohibidoX.push(numPrueba);
                }
            }
            if (izquierda>0){
                for (let i=izquierda; i<numPrueba; i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
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
            document.getElementById(celdaAbajo).style.backgroundColor = "red";
            if (derecha<16){
                for (let i=numPrueba; i<(derecha+1); i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
                    tablero[letraPrueba][i-1].prohibidoY.push(letraPruebaOG);
                    tablero[letraPrueba][i-1].prohibidoX.push(numPrueba);
                }
            } else {
                for (let i=numPrueba; i<16; i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
                    tablero[letraPrueba][i-1].prohibidoY.push(letraPruebaOG);
                    tablero[letraPrueba][i-1].prohibidoX.push(numPrueba);
                }
            }
            if (izquierda>0){
                for (let i=izquierda; i<numPrueba; i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
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
                        document.getElementById(letras[i]+(x+1)).style.backgroundColor = "black";
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
                document.getElementById(letras[i]+(x+1)).style.backgroundColor= "black";
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
    for (let a = 0; a<barcos.length; a++){ //barcos
        casilleros = 0;
        if (parseInt(barcos[a][0])>parseInt(barcos[a][2])) {
            
        }
        for (let i = 0; i<tablero.length; i++){ //eje y
            for (let x = 0; x<tablero[i].length; x++){ //eje x
                console.log("aaaaaaa, ", barcos[a])
                console.log ("bbbbbbbb, ", tablero[i][x].tamaño)
                if (barcos[a] == tablero[i][x].tamaño) {
                    console.log("pija")
                    casilleros++;
                }
            }
        }
        console.log(barcos[a])
        console.log(casilleros)
        if (barcos[a].length>3){
            if (casilleros != 1) {
                queBarco = a;
            }
        } else {
            console.log("cccccc, ", )
            if (barcos[a][0]*barcos[a][2] != casilleros){
                queBarco = a;
            }
        }
    }


    if (queBarco>11){
        alert ("pusiste todos los barcos");
    } else {
        let tamaño = barcos[queBarco];

        analizarCelda(celda);
        let posicionX = parseInt(tamaño[0]);
        let posicionY = parseInt(tamaño[2]);
        let barco = [];
        let xd = true;
        if (tamaño.length>3){
            document.getElementById(celda).style.background = "blue";
            for (let i = 0; i<tablero.length; i++){
                for (let x = 0; x<tablero[i].length; x++){
                    if (analizarCelda(celda).numPrueba -1 == x && NumeroLetra(analizarCelda(celda).letraPrueba) == i){
                        tablero[i][x].mina = true;
                        tablero[i][x].tamaño = tamaño
                    }
                }
            }
            queBarco++;
        } else {

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
                    if (document.getElementById(barco[a]).style.backgroundColor != "black"){
                        xd = false
                    }
                }
            }
    
    
            if (document.getElementById(celda).style.backgroundColor == "green"){
                document.getElementById(celda).style.backgroundColor = "black";
                borrar(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba)
            } else {
                if (xd == false){
                    alert("El barco está mal ubicado")
                } else if (document.getElementById(celda).style.backgroundColor == "black") {
                    queBarco++;
                    for (let i=0; i<barco.length; i++){
                        document.getElementById(barco[i]).style.background = "green";
                        tablero[NumeroLetra(analizarCelda(barco[i]).letraPrueba)][analizarCelda(barco[i]).numPrueba -1].barco = true;
                        tablero[NumeroLetra(analizarCelda(barco[i]).letraPrueba)][analizarCelda(barco[i]).numPrueba -1].cabezaBarcoX=analizarCelda(celda).numPrueba;
                        tablero[NumeroLetra(analizarCelda(barco[i]).letraPrueba)][analizarCelda(barco[i]).numPrueba -1].cabezaBarcoY=analizarCelda(celda).letraPrueba;
                        tablero[NumeroLetra(analizarCelda(barco[i]).letraPrueba)][analizarCelda(barco[i]).numPrueba -1].tamaño = tamaño;
                    }
    
                    analizarVertical(
                        analizarCelda(celda).numPrueba, 
                        analizarCelda(celda).letraPrueba,
                        analizarHorizontal(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba, analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba, false).derecha,
                        analizarHorizontal(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba, analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba, false).izquierda
                    );
    
                }
            }
        }
        
>>>>>>> Stashed changes
    }
    else {
        celda.style.backgroundColor = "green"
        document.getElementById(id).value = 1;
        let derecha = id[0]+(num+1);
        derecha = JSON.stringify(derecha)
        document.getElementById(derecha).value = -1;
        document.getElementById(derecha).style.backgroundColor = "red";
        document.getElementById(derecha).value = -1;
        document.getElementById(derecha).style.backgroundColor = "red";
    }
    //let num = "";
    for(let i=0; i<id.length; i++) {
        if (i!=0) {
            num += id[i];
        }
    }
    //num = parseInt(num);
    console.log(num);
    console.log("celda a la derecha: ", id[0]+(num+1))
    console.log("valor de celda clickeada: ", celda.value);
    console.log("valor de C8", document.getElementById("C8").getAttribute("value"));


<<<<<<< Updated upstream
=======
/*
function buscarPartida () {
    socket.emit("BuscarPartida", {idUsuario: idUsuario})
}
>>>>>>> Stashed changes






    /*
    let ido="B2";
    let celdaDerecha= ido[0]+(parseInt(ido[1])+1)
    console.log("celda derecha: ", celdaDerecha);
    console.log(document.getElementById(celdaDerecha).value);
    console.log(document.getElementById(celdaDerecha));
    console.log("Valor de la celda derecha: ", document.getElementById(celdaDerecha).textContent); */
    let letras = ["A", "B", "C", "D", "E","F","G","H","I","J", "K", "L", "M","N","Ñ"]
    for (let i=0;i<letras.length; i++){
        for (let x=1; x<16; x++){
            console.log("let ", (letras[0]+))
        }
    }
    let b2 = document.getElementById("B2").getAttribute("value")
    b2 = 1
    document.getElementById("B2").style.backgroundColor = "green";
    document.getElementById("B3").style.backgroundColor = "green";
    document.getElementById("B4").style.backgroundColor = "green";
    console.log("aaa")
    console.log(document.getElementById("B2").getAttribute("value"))
    let ido = "B2";//
    let celdaDerecha = ido[0] + (parseInt(ido[1]) + 1);//
    let numDerecha= (parseInt(ido[1]) + 1);//
    let valor  = document.getElementById(celdaDerecha).getAttribute("value");
    console.log("aaa");
    console.log(document.getElementById(celdaDerecha).getAttribute("value"))
    console.log("valor: ", valor);
    while (valor!=0){
        numDerecha = numDerecha +1
        celdaDerecha= ido[0] + numDerecha;
        console.log("celdaDerecha: ", celdaDerecha);
        valor = document.getElementById(celdaDerecha).getAttribute(value);
        console.log("valor: ", valor);
    }
    if (valor ==0) {
        document.getElementById(celdaDerecha).style.backgroundColor = "red";
        document.getElementById(celdaDerecha).value = -1;
    } 
    
<<<<<<< Updated upstream
    /*
    let celdaIzquierda = ido[0] + (parseInt(ido[1]) - 1);
    let elemento2 = document.getElementById(celdaDerecha);
    let valor2 = elemento.getAttribute("value");
    while (valor2!=0){
        celdaIzquierda= celdaIzquierda-1;
        elemento = document.getElementById(celdaDerecha);
        valor = elemento.getAttribute("value");
    }
    if (valor ==0) {
        document.getElementById(celdaDerecha).style.backgroundColor = "red";
        document.getElementById(celdaDerecha).value = -1;
    } */


    //hacer un  while que empieza a comparar la celda de la derecha hasta que encuentre un value 0.una vez q lo encuentra,
    //vuelve al inicio y arranca para la izq. una vez que estan encontrados los bordes, en el borde izquierdo buscar para arriba.
    //hasta el limite.dps para ajablo y quedaria algo asi   x?????
    //                                                     oxxxxxo
    //                                                      o
    // solo quedaria rellenar

    console.log(document.getElementById(id).value)
}
=======
}); */
>>>>>>> Stashed changes
