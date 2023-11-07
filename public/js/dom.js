function casillerosNegros() {
    let letras = ["A", "B", "C", "D", "E","F","G","H","I","J", "K", "L", "M","N","Ñ"]
    for (let i=0;i<letras.length; i++){
        for (let x=1; x<16; x++){
            let celda = letras[i]+x;
            document.getElementById(celda).style.backgroundColor = "black";
        }
    } 
}

document.addEventListener("DOMContentLoaded", function() {
    casillerosNegros();
});
  

function atacar(id){
    console.log(id)
    console.log("hola")

}

function analizarDerecha (celdaPrueba) {
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
    parseInt(numPrueba);
    let celdaDerecha = celdaPrueba[0]+(numPrueba);
    if (document.getElementById(celdaDerecha).style.backgroundColor == "red"){ //color 2

        alert("no se puede")
    } else {
        while (document.getElementById(celdaDerecha).style.backgroundColor == "green") { //color1

            numPrueba++;
            celdaDerecha= celdaPrueba[0]+(numPrueba);
            if (numPrueba>15){
                break;
            }
        }
        if (numPrueba<16) {
            if (document.getElementById(celdaDerecha).style.backgroundColor == "black"){ //color3
                document.getElementById(celdaDerecha).style.backgroundColor = "red";
            }
        }

    }
    return numPrueba;
}

function analizarIzquierda(celdaPrueba) {
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
    parseInt(numPrueba);
    let celdaIzquierda = celdaPrueba[0]+(numPrueba);
    let rojos = [];
    while (document.getElementById(celdaIzquierda).style.backgroundColor == "green") {
        numPrueba--;
        celdaIzquierda= celdaPrueba[0]+(numPrueba);
        if (numPrueba<1){
            break;
        }
    }
    if (numPrueba>0) {
        if (document.getElementById(celdaIzquierda).style.backgroundColor == "black"){
            document.getElementById(celdaIzquierda).style.backgroundColor = "red";

        }
    }
   
    return numPrueba;
}

function analizarArriba(celdaPrueba, derecha, izquierda) {
    let letras = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ"];
    let letraPrueba=0
    for (let i=0; i<letras.length; i++){
        if (letras[i]==celdaPrueba[0]){
            letraPrueba=i;
        }
    }
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
    parseInt(numPrueba);
    let celdaArriba = letras[letraPrueba]+(numPrueba);
    while (document.getElementById(celdaArriba).style.backgroundColor == "green") {
        analizarDerecha(celdaArriba);
        analizarIzquierda(celdaArriba);
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
}

function analizarAbajo(celdaPrueba, derecha, izquierda) {
    let letras = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ"];
    let letraPrueba=0
    for (let i=0; i<letras.length; i++){
        if (letras[i]==celdaPrueba[0]){
            letraPrueba=i;
        }
    }
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
    parseInt(numPrueba);
    let celdaArriba = letras[letraPrueba]+(numPrueba);
    while (document.getElementById(celdaArriba).style.backgroundColor == "green") {
        analizarDerecha(celdaArriba);
        analizarIzquierda(celdaArriba);
        letraPrueba++;
        celdaArriba= letras[letraPrueba]+(numPrueba);
        if (letraPrueba>14){
            break;
        }
    }
    if (letraPrueba<15){
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
        /*analizarDerecha(celda, "black", "red");
        analizarIzquierda(celda, "black", "red");
        analizarArriba(celda, analizarDerecha(celda), analizarIzquierda(celda), "black", "red");
        analizarAbajo(celda, analizarDerecha(celda), analizarIzquierda(celda), "black", "red");*/
    }
    else if (document.getElementById(celda).style.backgroundColor == "black") {
        document.getElementById(celda).style.backgroundColor = "green";
        analizarDerecha(celda);
        analizarIzquierda(celda, "green", "red");
        analizarArriba(celda, analizarDerecha(celda), analizarIzquierda(celda));
        analizarAbajo(celda, analizarDerecha(celda), analizarIzquierda(celda));
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