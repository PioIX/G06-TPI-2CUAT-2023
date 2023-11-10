let tablero = ["A", "B", "C", "D", "E","F","G","H","I","J", "K", "L", "M","N","Ñ"];
let letras = ["A", "B", "C", "D", "E","F","G","H","I","J", "K", "L", "M","N","Ñ"]

class Celda {
    constructor(){
        this.barco = false;
        this.clickeado = false;
        this.prohibidoY= [];
        this.prohibidoX= [];
    }
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

function analizarHorizontal (numPruebaOG, letraPruebaOG, prueba) {
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
            if (prueba==true){
                tablero[letraPrueba][numPrueba-1].prohibidoY.push(letraPruebaOG);
                tablero[letraPrueba][numPrueba-1].prohibidoX.push(numPruebaOG);
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
            if (prueba==true){
                tablero[letraPrueba][numPrueba-1].prohibidoY.push(letraPruebaOG);
                tablero[letraPrueba][numPrueba-1].prohibidoX.push(numPruebaOG);
            }
        }
    }
    let izquierda = numPrueba
    return {derecha, izquierda}
}

function analizarVertical(numPrueba, letraPruebaOG, derecha, izquierda) {
    //arriba
    let celdaArriba = letraPruebaOG+(numPrueba);
    let letraPrueba = 0
    let letraArriba = "";
    let letraAbajo = "";
    for (let i=0; i<letras.length; i++){
        if (letras[i]==letraPruebaOG){
            letraPrueba=i;
        }
    }
    while (document.getElementById(celdaArriba).style.backgroundColor == "green") {
        analizarHorizontal (numPrueba, letraPruebaOG)
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
                    console.log(letraPrueba+(i-1), tablero[letraPrueba][i-1])
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
    letraPrueba=0
    for (let i=0; i<letras.length; i++){
        if (letras[i]==letraPruebaOG){
            letraPrueba=i;
        }
    }
    let celdaAbajo = letras[letraPrueba]+(numPrueba);
    while (document.getElementById(celdaAbajo).style.backgroundColor == "green") {
        analizarHorizontal (numPrueba, letraPruebaOG)
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
            }
            if (izquierda>0){
                for (let i=izquierda; i<numPrueba; i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
                    console.log(celdaAbajo)
                    tablero[letraPrueba][i-1].prohibidoY.push(letraPruebaOG);
                    tablero[letraPrueba][i-1].prohibidoX.push(numPrueba);
                }
            }
        }
    }
}

function borrar(numero, letra) {
    for (let i=0; i<tablero.length; i++){
        for (let x=0; x<15; x++){
            if (tablero[i][x].prohibidoX==numero && tablero[i][x]){
                if (tablero[i][x].prohibidoX.length==1){
                    document.getElementById(letras[i]+(x+1)).style.backgroundColor = "black";

                    //falta que lo borre del array
                }
            }
        }
    }
}

/*
function borrar(numero, letra) {
    for (let i=0; i<tablero.length; i++){
        for (let x=0; x<15; x++){
            for(let z=0; z<tablero[i][x].prohibidoX.length; z++) {
                if (tablero[i][x].prohibidoX[z]==numero && tablero[i][x].prohibidoX[z]==letra){
                    if (tablero[i][x].prohibidoX.length==1){
                        document.getElementById(letras[i]+(x+1)).style.backgroundColor = "black";
                        if (tablero[i][x].prohibidoX[z]==numero) {
                            tablero[i][x].prohibidoX.splice()
                            tablero[i][x].prohibidoY.splice()
                        }
                    }
                }
            }

            tablero[i][x].prohibidoX.splice()
        }
    }
}
*/

function elegirBarco(id) {
    let celda = id;
    let num = "";
    for(let i=0; i<id.length; i++) {
        if (i!=0) {
            num += id[i];
        }
    }
    num = parseInt(num);
    let barco = "3x1";
    let orientacion = "derecha";
    analizarCelda(celda);
    if (document.getElementById(celda).style.backgroundColor == "green"){
        document.getElementById(celda).style.backgroundColor = "black";
        borrar(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba)
    }
    else if (document.getElementById(celda).style.backgroundColor == "black") {
        document.getElementById(celda).style.backgroundColor = "green";
        let hacer = true
        analizarHorizontal(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba, hacer);
        hacer = false
        analizarVertical(
            analizarCelda(celda).numPrueba, 
            analizarCelda(celda).letraPrueba,
            analizarHorizontal(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba, hacer).derecha,
            analizarHorizontal(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba).izquierda, hacer
        );
    } else {
        alert("hay un rojo")
    }
}