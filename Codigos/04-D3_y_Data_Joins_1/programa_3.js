const datos = [
  { valor: 20, color: "red" },
  { valor: 32, color: "magenta" },
  { valor: 12, color: "blue" },
  { valor: 86, color: "orange" },
]

const SVG = d3.select("body")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400);

const rectangulos = SVG.selectAll("rect")  // Seleccionar rect
  .data(datos)        // Vincular a los datos
  .join("rect");      // Crear un rect para cada dato

rectangulos.attr("height", 40)            // Todos los rect tendrán una altura fija
  .attr("width", (d, i) => d.valor)    // El ancho de cada rect será determinado por el atributo valor
  .attr("fill", (d, i) => d.color)     // El color de cada rect será determinado por el atributo color
  .attr("y", (d, i) => i * 50);        // La posición en Y será determinado por la posición del dato en la lista
