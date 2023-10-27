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
    ido="B2";
    if (document.getElementById(ido[0]+(parseInt(ido[1])+1)).value ==0) {
        celda.style.backgroundColor = "red";
        document.getElementById(id).value = -1;
    }
    console.log(document.getElementById(id).value)
}