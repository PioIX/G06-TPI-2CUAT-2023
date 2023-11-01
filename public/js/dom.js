function atacar(id){
    console.log(id)
    console.log("hola")

}

function elegirBarco(id) {
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








    /*
    let ido="B2";
    let celdaDerecha= ido[0]+(parseInt(ido[1])+1)
    console.log("celda derecha: ", celdaDerecha);
    console.log(document.getElementById(celdaDerecha).value);
    console.log(document.getElementById(celdaDerecha));
    console.log("Valor de la celda derecha: ", document.getElementById(celdaDerecha).textContent); */
    document.getElementById("B2").style.backgroundColor = "green";
    document.getElementById("B3").style.backgroundColor = "green";
    document.getElementById("B4").style.backgroundColor = "green";

    let celdaPrueba = "B2";
    let numPrueba = 0;
    for(let i=0; i<celdaPrueba.length; i++) {
        if (i!=0) {
            if (i==1) {
                numPrueba = celdaPrueba[i];
            } else {
                numPrueba += celdaPrueba[i];
            }
            
        }
    }
    let celdaDerecha = celdaPrueba[0]+(numPrueba+1);

    console.log(document.getElementById("B2").style.backgroundColor);

    while (document.getElementById(celdaDerecha).style.backgroundColor == "green") {
        numPrueba+=1;
        celdaDerecha= celdaPrueba[0]+(numPrueba);
    }
    if (document.getElementById(celdaDerecha).style.backgroundColor == "black"){
        document.getElementById(celdaDerecha).style.backgroundColor = "red"
    }
        
    
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
}