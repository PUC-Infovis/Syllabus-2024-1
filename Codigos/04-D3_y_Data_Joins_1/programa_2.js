const datos = [23, 45, 99, 64]

const rectangulos = d3.select("svg")
  .selectAll("rect")  // Seleccionar rect
  .data(datos)        // Vincular a los datos
  .join("rect");      // Crear un rect para cada dato

rectangulos.attr("height", 40)      // Todos los rect tendrán una altura fija
  .attr("width", (d, i) => d)    // El ancho de cada rect será determinado por el valor del dato
  .attr("y", (d, i) => i * 50);  // La posición en Y será determinado por la posición del dato en la lista
