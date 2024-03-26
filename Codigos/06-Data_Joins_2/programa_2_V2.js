// Encontrar el SVG según su ID
const SVG = d3.select("#vis");

// Agregar 3 textos al SVG
SVG.append("text").attr("x", 0).attr("y", 20).text("Enter")
SVG.append("text").attr("x", 110).attr("y", 20).text("Update")
SVG.append("text").attr("x", 220).attr("y", 20).text("Exit")

function enterF(conjunto) {
  // Enter DEBE retonar lo creado
  return conjunto.append("rect")
    .attr("height", 20)
    .attr("x", 0)
    .attr("fill", "orange")
    .attr("width", d => d * 10)
    .attr("y", (d, i) => i * 40 + 40)

}

function updateF(conjunto) {
  // update DEBE retonar el conjunto
  conjunto.attr("width", d => d * 10)
    .attr("x", 110)
    .attr("fill", "red")

  return conjunto
}

function exitF(conjunto) {
  return conjunto.attr("x", 220).attr("fill", "green")
}


// Crear una función que genera un data join entre los datos y 1 rect
function datajoin(datos) {
  // Agregar rect según los datos que tenemos
  SVG.selectAll("rect").data(datos).join(enterF, updateF, exitF)
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
  d3.selectAll("rect").remove() // No es una buena práctica
  //datajoin([]) // Esto es mejor
})