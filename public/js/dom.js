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
            console.log("let ", (letras[0]))
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



























































































































//admin
async function putJSON() {   
  data ={
    email: document.getElementById("box5").value,
    password: document.getElementById("box6").value
  }
  try {
    console.log("try")
    const response = await fetch("/login", { 
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Success:", result);
    if (result.validar == false) {
      alert("Los datos son incorrectos")
    } 
    else {
      if (result.userType == true) {
        location.href = "/admin"
      }
      else{
        location.href = "/home3" 
      }
    }
  
  } catch (error) {
      console.error("Error:", error);
  }
}


async function putJSON3(data3) {
  try {
    const response3 = await fetch("/admin", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data3),
    });
    const result3 = await response3.json();
    console.log("Success:", result3);

    if (result3.queEs === "buscarID") {
      console.log("Nombre de usuario recibido:", result3.nombreUsuario);
      if (result3.nombreUsuario) {
        document.getElementById("nombre").value = result3.nombreUsuario;
      } else {
        alert("No se encontró un nombre de usuario para el ID seleccionado");
      }
    } else if (result3.queEs === "editarUsuario") {
      alert("Usuario editado correctamente");
    } else if (result3.queEs === "otraOperacion") {
      // Manejar otras operaciones si es necesario
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function editarUsuario() {
  let idBuscado = parseInt(document.getElementById("categoriaDesplegable").value);
  let nuevoNombre = document.getElementById("nombre").value;
  let data3 = {
    queEs: "editarUsuario",
    idBuscado: idBuscado,
    nuevoNombre: nuevoNombre,
  };
  putJSON3(data3);
}

function buscarUsuario() {
  console.log("Función buscarUsuario llamada");
  let idBuscado = parseInt(document.getElementById("categoriaDesplegable").value);
  let data3 = {
    queEs: "buscarID",
    idBuscado: idBuscado,
  };
  putJSON3(data3);
}

async function borrarUsuario() {
  let idBuscado = parseInt(document.getElementById("categoriaDesplegable").value);
  let data3 = {
    queEs: "borrarUsuario",
    idBuscado: idBuscado,
  };
  putJSON3(data3);
}