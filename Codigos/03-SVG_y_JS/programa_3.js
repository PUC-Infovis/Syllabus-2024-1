const raiz = document.getElementById("raiz");
const principal = document.getElementById("principal");

let contador = 0;

principal.addEventListener("click", () => {
  contador += 1;

  const parrafo = document.createElement("p");
  const texto = document.createTextNode(`Cantidad de clics o.o: ${contador}`);
  parrafo.appendChild(texto);

  raiz.appendChild(parrafo);
});
