////////////////////////////////////////////////////
// Definir constantes
////////////////////////////////////////////////////
const WIDTH = 600;
const HEIGHT = 400;
const margin = {
  top: 30,
  bottom: 30,
  right: 30,
  left: 30,
};

const WIDTHVIS = WIDTH - margin.right - margin.left
const HEIGHTVIS = HEIGHT - margin.top - margin.bottom

////////////////////////////////////////////////////
// Generar datos aleatorios
////////////////////////////////////////////////////
const distribucionX = d3.randomNormal(400, 200);
const distribucionY = d3.randomNormal(50, 10);

const datos = d3.range(5000).map(() => ({
  x: distribucionX(),
  y: distribucionY(),
}));

////////////////////////////////////////////////////
// Obtener min y max para cada eje (X e Y)
////////////////////////////////////////////////////

// Restamos 50 para tener un valor un poco más pequeño que el mínimo
const minValueY = d3.min(datos, (d) => d.y) - 50
const minValueX = d3.min(datos, (d) => d.x) - 50

// Sumamos 30 para para tener un valor un poco más grande que el máximo
const maxValueY = d3.max(datos, (d) => d.y) + 30
const maxValueX = d3.max(datos, (d) => d.x) + 30

////////////////////////////////////////////////////
// Crear SVG y sus escalas
////////////////////////////////////////////////////

// Crear SVG
const SVG = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Crear escala en EJE X y EJE Y
const escalaY = d3
  .scaleLinear()
  .domain([minValueY, maxValueY])
  .range([HEIGHTVIS, 0]);

const escalaX = d3
  .scaleLinear()
  .domain([minValueX, maxValueX])
  .range([0, WIDTHVIS]);

// Crear objetos Eje que usan las escalas definidas anteriormente
const ejeY = d3.axisLeft(escalaY);
const ejeX = d3.axisBottom(escalaX);

// Al SVG le agregamos nuestras escalas 
SVG
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .call(ejeY);

SVG
  .append("g")
  .attr("transform", `translate(${margin.left}, ${HEIGHTVIS + margin.bottom})`)
  .call(ejeX);


////////////////////////////////////////////////////
// Crear visualización
////////////////////////////////////////////////////

const contenedorPuntos = SVG
  .append("g")
  .attr("transform", `translate(${margin.left} ${margin.top})`);

contenedorPuntos
  .selectAll("circle")
  .data(datos)
  .join("circle")
  .attr("fill", "orange")
  .attr("r", 2)
  .attr("cx", (d) => escalaX(d.x))
  .attr("cy", (d) => escalaY(d.y));

////////////////////////////////////////////////////
// Construir un hexbin con d3.hexbin. 
////////////////////////////////////////////////////

// Crear segundo SVG
const svgHistograma = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Agregarle la escala X
svgHistograma
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .call(ejeY);

// Agregarle la escala Y
svgHistograma
  .append("g")
  .attr("transform", `translate(${margin.left}, ${HEIGHTVIS + margin.bottom})`)
  .call(ejeX);

// Agregar un contenedor para nuestra visualización.
const contenedorHex = svgHistograma
  .append("g")
  .attr("transform", `translate(${margin.left} ${margin.top})`);

////////////////////////////////////////////////////
// Llenar visualización con Hexbin
////////////////////////////////////////////////////

// 1. Crear el hexbin
const hexbin = d3
  .hexbin()
  .radius(10)
  .x((d) => escalaX(d.x))
  .y((d) => escalaY(d.y));

// 2. Aplicar hexbin
const hexagonos = hexbin(datos);
console.log(hexagonos);

// 3. Crear escala de color para cada hexbin
const escalaColor = d3
  .scaleSequential(d3.interpolatePuRd)
  .domain([0, d3.max(hexagonos, (d) => d.length)]);

// 4. Agregar los hexágonos a la nueva visualización (al contenedorHex)
contenedorHex
  .selectAll("path")
  .data(hexagonos)
  .join("path")
  .attr("d", hexbin.hexagon())
  .attr("transform", (d) => `translate(${d.x},${d.y})`)
  .attr("fill", (d) => escalaColor(d.length))
  .attr("stroke", "black")
  .attr("stroke-opacity", 0.1);
