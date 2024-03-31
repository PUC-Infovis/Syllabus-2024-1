const width = 600;
const height = 400;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("border", "solid 1px");

const rectangulo = svg
  .append("rect")
  .attr("width", 100)
  .attr("height", 100);


//// Paso 1 
//// Cambiar ancho usando duración por defecto
// rectangulo.transition().attr("width", 300);

//// Paso 2 (comentar paso anterior)
//// Cambiar ancho usando usando una duración que nosotros queremos
// rectangulo.transition().duration(2000).attr("width", 300);

//// Paso 3 (comentar paso anterior)
//// Definir color inicial y luego cambiar ancho + color
// rectangulo
//   .attr("fill", "black")
//   .transition()
//   .duration(2000)
//   .attr("width", 300)
//   .attr("fill", "magenta");

//// Paso 4 (comentar paso anterior)
//// Concatenar transiciones
// rectangulo
//   .transition()
//   .duration(2000)
//   .attr("width", 300)
//   .attr("fill", "magenta")
//   .transition()
//   .attr("width", 100)
//   .attr("fill", "black");

/* 🤔 ¿Por qué el rectangulo partió magenta y no negro en este paso?
Hay ciertos atributos que D3 puede asumir su valor inicial. Por ejemplo width, height.
si no están definidos, asume valor 0. "fill" NO ES uno de esos. Si no está el color
inicial, no sabe por cuál partir, así que omite esa transición y poner el valor final
inmediatemente. Mucho ojo con esto 👀
*/


//// Paso 5 (comentar paso anterior)
//// Darle nombre a las transiciones
// rectangulo
//   .transition("t1")
//   .duration(2000)
//   .attr("width", 300)
//   .attr("fill", "magenta")
//   .transition()
//   .attr("width", 100)
//   .attr("fill", "black");

// rectangulo.transition("t2").duration(1000).attr("height", 300);

//// Paso 6 (comentar paso anterior)
//// Verificar que .transition() retorna 
//// algo distinto a una selección

// console.log(rectangulo.transition("t3"))
// console.log(rectangulo)