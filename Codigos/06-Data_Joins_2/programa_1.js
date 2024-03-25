// Encontrar el SVG según su ID
const SVG = d3.select("#vis");

function datajoin(datos) {
  // Agregar rect según los datos que tenemos
  SVG.selectAll("rect")           // Buscamos los rect
    .data(datos)                  // Hacemos data-join
    .join("rect")                 // Agregamos "RECT"
    .attr("height", 20)           // Definimos la altura
    .attr("x", 0)                 // Definimos el X
    .attr("fill", "orange")       // Deinimos su color
    .attr("width", d => d * 10)   // Definimos su ancho como el valor del dato
    .attr("y", (d, i) => i * 30)  // Definimos el Y según el índice del dato
}

document.querySelector("#button1").addEventListener("click", () => {
  datajoin([1, 2, 3])
})
document.querySelector("#button2").addEventListener("click", () => {
  datajoin([5, 6])
})
document.querySelector("#button3").addEventListener("click", () => {
  datajoin([5, 10])
})
document.querySelector("#button4").addEventListener("click", () => {
  d3.selectAll("rect").remove()
})