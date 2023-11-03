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
    try {
        while (document.getElementById(celdaDerecha).style.backgroundColor == "green") {
            numPrueba++;
            celdaDerecha= celdaPrueba[0]+(numPrueba);
        }
    }
    catch (error) {
    }
    finally {
        if (document.getElementById(celdaDerecha).style.backgroundColor == "black" && numPrueba<16){
            document.getElementById(celdaDerecha).style.backgroundColor = "red"
        }
    
        return numPrueba;
    }
    
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
    while (numPrueba>0){
        while (document.getElementById(celdaIzquierda).style.backgroundColor == "green") {
            numPrueba--;
            celdaIzquierda= celdaPrueba[0]+(numPrueba);
        }
    }
    if (document.getElementById(celdaIzquierda).style.backgroundColor == "black" && numPrueba>0){
        document.getElementById(celdaIzquierda).style.backgroundColor = "red";
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
    //console.log("celda arriba : ", celdaArriba)
    while (letraPrueba>0) {
        while (document.getElementById(celdaArriba).style.backgroundColor == "green") {
            analizarDerecha(celdaArriba);
            analizarIzquierda(celdaArriba);
            letraPrueba--;
            celdaArriba= letras[letraPrueba]+(numPrueba);
        }
    }
   
    if (document.getElementById(celdaArriba).style.backgroundColor == "black" && letraPrueba>0){
        document.getElementById(celdaArriba).style.backgroundColor = "red";
        console.log("hola")
        for (let i=numPrueba; i<(derecha+1); i++){
            console.log(letras[letraPrueba]+(i))
            document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
        }
        for (let i=izquierda; i<numPrueba; i++){
            console.log(letras[letraPrueba]+(i))
            document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
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
    while (letraPrueba>0) {
        while (document.getElementById(celdaArriba).style.backgroundColor == "green") {
            analizarDerecha(celdaArriba);
            analizarIzquierda(celdaArriba);
            letraPrueba++;
            celdaArriba= letras[letraPrueba]+(numPrueba);
        }
    }
    
    if (document.getElementById(celdaArriba).style.backgroundColor == "black" && letraPrueba>0){
        document.getElementById(celdaArriba).style.backgroundColor = "red";
        console.log("hola")
        for (let i=numPrueba; i<(derecha+1); i++){
            console.log(letras[letraPrueba]+(i))
            document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
        }
        console.log("izquierda: ", izquierda)
        for (let i=izquierda; i<numPrueba; i++){
            document.getElementById(letras[letraPrueba]+(i)).style.backgroundColor = "red";
        }
    }
}

function elegirBarco(id) {
    //no borrar lo de abajo
    casillerosNegros();
    let celda = id;
    let num = "";
    for(let i=0; i<id.length; i++) {
        if (i!=0) {
            num += id[i];
        }
    }
    num = parseInt(num);

    console.log("aaaaaaaaa: ", celda);
    if (document.getElementById(celda).style.backgroundColor == "green"){
        document.getElementById(celda).style.backgroundColor = "black";
    }
    else {
        console.log("entre al else")
        document.getElementById(celda).style.backgroundColor = "green";
    } 

    /*let ido="B2";
    //no borrar lo de arriba

    document.getElementById("D5").style.backgroundColor = "green";
    document.getElementById("D3").style.backgroundColor = "green";
    document.getElementById("D4").style.backgroundColor = "green";
    document.getElementById("C5").style.backgroundColor = "green";
    document.getElementById("C3").style.backgroundColor = "green";
    document.getElementById("C4").style.backgroundColor = "green";

    let celdaPrueba = "D3"; */
    analizarDerecha(celda);
    analizarIzquierda(celda);
    analizarArriba(celda, analizarDerecha(celda), analizarIzquierda(celda));
    analizarAbajo(celda, analizarDerecha(celda), analizarIzquierda(celda));
    


    


    //hacer un  while que empieza a comparar la celda de la derecha hasta que encuentre un value 0.una vez q lo encuentra,
    //vuelve al inicio y arranca para la izq. una vez que estan encontrados los bordes, en el borde izquierdo buscar para arriba.
    //hasta el limite.dps para ajablo y quedaria algo asi   x?????
    //                                                     oxxxxxo
    //                                                      o
    // solo quedaria rellenar
}