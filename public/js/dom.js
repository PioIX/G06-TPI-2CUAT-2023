function atacar(id){
    console.log(id)

}

function elegirBarco(id) {
    document.getElementById("B2").value=1;
    document.getElementById("B2").style.backgroundColor = "green";
    var celda = document.getElementById(id);
    console.log(id[0]);
    if (celda.style.backgroundColor == "green"){
        celda.style.backgroundColor = "black";
        document.getElementById(id).value = 0;
    }
    else {
        celda.style.backgroundColor = "green"
        document.getElementById(id).value = 1;
    }
    let num = "";
    for(let i=0; i<id.length; i++) {
        if (i!=0) {
            num += id[i];
        }
    }
    num = parseInt(num);
    console.log(num);
    console.log("celda a la derecha: ", id[0]+(num+1))
    /*
    let ido="B2";
    let celdaDerecha= ido[0]+(parseInt(ido[1])+1)
    console.log("celda derecha: ", celdaDerecha);
    console.log(document.getElementById(celdaDerecha).value);
    console.log(document.getElementById(celdaDerecha));
    console.log("Valor de la celda derecha: ", document.getElementById(celdaDerecha).textContent); */
    let ido = "B2";
    let celdaDerecha = ido[0] + (parseInt(ido[1]) + 1);
    let elemento = document.getElementById(celdaDerecha);
    let valor = elemento.getAttribute("value");

    if (valor ==0) {
        console.log("entre al if")
        document.getElementById(celdaDerecha).style.backgroundColor = "red";
        document.getElementById(celdaDerecha).value = -1;
    }
    //hacer un  while que empieza a comparar la celda de la derecha hasta que encuentre un value 0.una vez q lo encuentra,
    //vuelve al inicio y arranca para la izq. una vez que estan encontrados los bordes, en el borde izquierdo buscar para arriba.
    //hasta el limite.dps para ajablo y quedaria algo asi   x?????
    //                                                     oxxxxxo
    //                                                      o
    // solo quedaria rellenar

    console.log(document.getElementById(id).value)
}