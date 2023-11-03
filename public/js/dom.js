function atacar(id){
    console.log(id)
    console.log("hola")

}

function casillerosNegros() {
    let letras = ["A", "B", "C", "D", "E","F","G","H","I","J", "K", "L", "M","N","Ñ"]
    for (let i=0;i<letras.length; i++){
        for (let x=1; x<16; x++){
            let celda = letras[i]+x;
            document.getElementById(celda).style.backgroundColor = "black";
        }
    } 
}

function analizarDerecha (celdaPrueba) {
    let numPrueba = 0;
    for(let i=0; i<celdaPrueba.length; i++) {
        if (i!=0) {
            if (i==1) {
                numPrueba = parseInt(celdaPrueba[i]);
            } else {
                numPrueba += parseInt(celdaPrueba[i]);
            }
        }
    }
    let celdaDerecha = celdaPrueba[0]+(numPrueba+1);
    
    while (document.getElementById(celdaDerecha).style.backgroundColor == "green") {
        numPrueba++;
        celdaDerecha= celdaPrueba[0]+(numPrueba);
    }
    if (document.getElementById(celdaDerecha).style.backgroundColor == "black" && numPrueba<16){
        document.getElementById(celdaDerecha).style.backgroundColor = "red"
    }

    return numPrueba;
}

function analizarIzquierda(celdaPrueba) {
    let numPrueba = 0;
    for(let i=0; i<celdaPrueba.length; i++) {
        if (i!=0) {
            if (i==1) {
                numPrueba = parseInt(celdaPrueba[i]);
            } else {
                numPrueba += parseInt(celdaPrueba[i]);
            }
        }
    }
    let celdaIzquierda = celdaPrueba[0]+(numPrueba-1);
        while (document.getElementById(celdaIzquierda).style.backgroundColor == "green") {
            numPrueba--;
            celdaIzquierda= celdaPrueba[0]+(numPrueba);
        }
        if (document.getElementById(celdaIzquierda).style.backgroundColor == "black" && numPrueba>0){
            document.getElementById(celdaIzquierda).style.backgroundColor = "red"
        }
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
            if (i==1) {
                numPrueba = parseInt(celdaPrueba[i]);
            } else {
                numPrueba += parseInt(celdaPrueba[i]);
            }
        }
    }
    let celdaArriba = letras[letraPrueba-1]+(numPrueba);
    console.log("celda arriba: ", celdaArriba);
    while (document.getElementById(celdaArriba).style.backgroundColor == "green") {
        letraPrueba--;
        celdaArriba= letras[letraPrueba]+(numPrueba);
    }
    if (document.getElementById(celdaArriba).style.backgroundColor == "black" && numPrueba>0){
        document.getElementById(celdaArriba).style.backgroundColor = "red"
        /*for (let i=numPrueba; i<derecha+1; i++){
            console.log()
            document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
        }*/
        /*for (let i=izquierda; i<numPrueba+1; i++){
            document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
        }*/
    }
}

function elegirBarco(id) {
    //no borrar lo de abajo
    /*let celda = document.getElementById(id);
    let num = "";
    for(let i=0; i<id.length; i++) {
        if (i!=0) {
            num += id[i];
        }
    }
    num = parseInt(num);
    console.log(id[0]);
    if (celda.style.backgroundColor == "green"){
        celda.style.backgroundColor = "black";
    }
    else {
        celda.style.backgroundColor = "green"
        let derecha = id[0]+(num+1);
        document.getElementById(derecha).style.backgroundColor = "red";
    } */
    /*let ido="B2";
    let celdaDerecha= ido[0]+(parseInt(ido[1])+1)
    console.log("celda derecha: ", celdaDerecha);
    console.log(document.getElementById(celdaDerecha).value);
    console.log(document.getElementById(celdaDerecha));
    console.log("Valor de la celda derecha: ", document.getElementById(celdaDerecha).textContent); */
    //no borrar lo de arriba
    casillerosNegros();

    document.getElementById("B2").style.backgroundColor = "green";
    document.getElementById("B3").style.backgroundColor = "green";
    document.getElementById("B4").style.backgroundColor = "green";

    let celdaPrueba = "B2";
    analizarDerecha(celdaPrueba);
    analizarIzquierda(celdaPrueba);
    analizarArriba(celdaPrueba, analizarDerecha(celdaPrueba), analizarIzquierda(celdaPrueba));
    /*

    */
    


    //hacer un  while que empieza a comparar la celda de la derecha hasta que encuentre un value 0.una vez q lo encuentra,
    //vuelve al inicio y arranca para la izq. una vez que estan encontrados los bordes, en el borde izquierdo buscar para arriba.
    //hasta el limite.dps para ajablo y quedaria algo asi   x?????
    //                                                     oxxxxxo
    //                                                      o
    // solo quedaria rellenar
}