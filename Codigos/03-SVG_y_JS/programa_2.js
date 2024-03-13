const parrafo = document.createElement("p");
const texto = document.createTextNode("¡Soy un texto >.<!");
parrafo.appendChild(texto);

const elementoRaiz = document.getElementById("raiz");
elementoRaiz.appendChild(parrafo);
