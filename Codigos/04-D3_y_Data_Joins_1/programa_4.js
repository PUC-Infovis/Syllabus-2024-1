const datos = [150, 256, 130, 3, 23, 422, 235];
// Encontrar el body en el HTML y agregar un elemento SVG
const svg = d3.select("body").append("svg");

// Definir ancho y largo del SVG
svg.attr("width", 50 + datos.length * 100).attr("height", 500);

// Agregar rect según los datos que tenemos
svg
  .selectAll("rect")                            // Seleccionar rect
  .data(datos)                                  // Vincularlos a la lista de datos
  .join("rect")                                 // Hacer append de rect para cada dato que no tenga un rect asociado
  .attr("width", 50)                            // Definir ancho de cada rect
  .attr("fill", "orange")                       // Definir color de cada rect
  .attr("height", (d) => d)                     // Definir la altura en función del valor del dato
  .attr("x", (_, index) => 50 + index * 100)   // Definir el X en función de la posición del dato en la lista


//////////////////////////////////////////////////////////
//////////            Mini Desafio              ////////// 
//////////////////////////////////////////////////////////

// Actualmente las barras están alineadas a un eje superior
// Como si fuera un gráfico de barra invertido.
// Desafío: agregar el atributo "y" e ingeniarselas para
// que las barras queden alineadas en un eje inferior. 
// De este modo, se verá como un gráfico de barra tradicional.