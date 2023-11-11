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
    if (queBarco>11){
        alert ("pusiste todos los barcos");
    } else {
        let tamaño = barcos[queBarco];
        console.log(tamaño)

        analizarCelda(celda);
        let posicionX = parseInt(tamaño[0]);
        let posicionY = parseInt(tamaño[2]);
        let barco = [];
        let xd = true;
        if (tamaño.length>3){
            document.getElementById(celda).style.background = "blue";
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
        
    }
    

    
}