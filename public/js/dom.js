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
    console.log(tablero)
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

function analizarHorizontal (numPruebaOG, letraPrueba) {
    //derecha
    let numPrueba= numPruebaOG;
    let celdaDerecha = letraPrueba+numPrueba;
    while (document.getElementById(celdaDerecha).style.backgroundColor == "green") { //color1
        numPrueba++;
        celdaDerecha= letraPrueba+(numPrueba);
        if (numPrueba>15){
            break;
        }
    }
    if (numPrueba<16) {
        if (document.getElementById(celdaDerecha).style.backgroundColor == "black"){ //color3
            document.getElementById(celdaDerecha).style.backgroundColor = "red";
            for (let i=0; i<letras.length; i++){
                if ()
            }
            //tablero[letraPrueba][numPrueba].prohibidoY= 
            console.log(letraPrueba+numPrueba)
        }
    }
    let derecha= numPrueba
    //izquierda
    numPrueba= numPruebaOG;
    let celdaIzquierda = letraPrueba+(numPrueba);
    while (document.getElementById(celdaIzquierda).style.backgroundColor == "green") {
        numPrueba--;
        celdaIzquierda= letraPrueba+(numPrueba);
        if (numPrueba<1){
            break;
        }
    }
    if (numPrueba>0) {
        if (document.getElementById(celdaIzquierda).style.backgroundColor == "black"){
            document.getElementById(celdaIzquierda).style.backgroundColor = "red";

        }
    }
    let izquierda = numPrueba
    return {derecha, izquierda}
}

function analizarArriba(numPrueba, letraPruebaOG, derecha, izquierda) {
    //arriba
    let celdaArriba = letraPruebaOG+(numPrueba);
    let letraPrueba=0
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
        if (document.getElementById(celdaArriba).style.backgroundColor == "black"){
            document.getElementById(celdaArriba).style.backgroundColor = "red";
            if (derecha<16){
                for (let i=numPrueba; i<(derecha+1); i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
                }
            }
            if (izquierda>0){
                for (let i=izquierda; i<numPrueba; i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
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
        if (document.getElementById(celdaAbajo).style.backgroundColor == "black"){
            document.getElementById(celdaAbajo).style.backgroundColor = "red";
            if (derecha<16){
                for (let i=numPrueba; i<(derecha+1); i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
                }
            }
            if (izquierda>0){
                for (let i=izquierda; i<numPrueba; i++){
                    document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
                }
            }
        }
    }
}


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
    if (document.getElementById(celda).style.backgroundColor == "green"){
        document.getElementById(celda).style.backgroundColor = "black";
    }
    else if (document.getElementById(celda).style.backgroundColor == "black") {
        document.getElementById(celda).style.backgroundColor = "green";
        analizarCelda(celda);
        analizarHorizontal(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba)
        analizarArriba(
            analizarCelda(celda).numPrueba, 
            analizarCelda(celda).letraPrueba,
            analizarHorizontal(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba).derecha,
            analizarHorizontal(analizarCelda(celda).numPrueba, analizarCelda(celda).letraPrueba).izquierda);
        //analizarAbajo(celda, analizarDerecha(celda), analizarIzquierda(celda));
    } else {
        alert("hay un rojo")
    }
    


    


    //hacer un  while que empieza a comparar la celda de la derecha hasta que encuentre un value 0.una vez q lo encuentra,
    //vuelve al inicio y arranca para la izq. una vez que estan encontrados los bordes, en el borde izquierdo buscar para arriba.
    //hasta el limite.dps para ajablo y quedaria algo asi   x?????
    //                                                     oxxxxxo
    //                                                      o
    // solo quedaria rellenar
}