//////////////////////////////////////////////////
//////               Ejemplo 1             ///////
//////////////////////////////////////////////////
const svgEj1 = d3
  .select("#ej1")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 400);

const puntos = [
  [0, 0],
  [30, 70],
  [60, 10],
  [190, 10],
  [300, 150],
  [350, 250],
  [400, 400],
  [450, 150],
  [500, 150],
  [550, 150],
  [600, 200],
  [650, 250],
  [700, 350],
  [750, 380],
  [800, 250],
];

const linea = d3.line();
console.log("linea", linea(puntos));

svgEj1
  .append("path")
  .attr("fill", "transparent")
  .attr("stroke", "black")
  .attr("stroke-width", "5px")
  .attr("d", linea(puntos));

// d3.curveBasis
linea.curve(d3.curveBasis);
console.log("linea curveBasis", linea(puntos));

svgEj1
  .append("path")
  .attr("fill", "transparent")
  .attr("stroke", "red")
  .attr("stroke-width", "5px")
  .attr("d", linea(puntos));

// // d3.curveCardinal
linea.curve(d3.curveCardinal);
console.log("linea curveCardinal", linea(puntos));

svgEj1
  .append("path")
  .attr("fill", "transparent")
  .attr("stroke", "orange")
  .attr("stroke-width", "5px")
  .attr("d", linea(puntos));

//////////////////////////////////////////////////
//////               Ejemplo 2             ///////
//////////////////////////////////////////////////
const width = 800;
const height = 300;

const svgEj2 = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const datos = [
  { paso: 0, valor: 2.0603572936394787 },
  { paso: 1, valor: 2.1258340075136997 },
  { paso: 2, valor: 2.3302161217964077 },
  { paso: 3, valor: 2.7225055372803837 },
  { paso: 4, valor: 3.1709024948437783 },
  { paso: 5, valor: 3.2562224630128327 },
  { paso: 6, valor: 2.973671646324604 },
  { paso: 7, valor: 3.2054315269800897 },
  { paso: 8, valor: 2.7524544574755536 },
  { paso: 9, valor: 2.736950619247576 },
  { paso: 10, valor: 2.9125383395943345 },
  { paso: 11, valor: 2.493988244547598 },
  { paso: 12, valor: 2.4849060597331394 },
  { paso: 13, valor: 2.2800539235220993 },
  { paso: 14, valor: 1.8353025802230376 },
  { paso: 15, valor: 1.5680963292079186 },
  { paso: 16, valor: 0 },
  { paso: 17, valor: 0 },
  { paso: 18, valor: 0 },
  { paso: 19, valor: 2.0922396007490622 },
  { paso: 20, valor: 1.5968876881845189 },
];

const escalaX = d3
  .scaleBand()
  .domain(datos.map(d => d.paso))
  .range([10, width - 10])
  .padding(1) // Intentar cambiar este valor y ver qué pasa :D
  .align(0.5);

const escalaY = d3
  .scaleLinear()
  .domain(d3.extent(datos, (d) => d.valor))
  .range([height - 10, 10]);

const lineConEscalas = d3
  .line()
  .curve(d3.curveLinear)
  .x((d) => escalaX(d.paso) + escalaX.bandwidth() / 2)
  .y((d) => escalaY(d.valor));

svgEj2
  .append("path")
  .attr("fill", "transparent")
  .attr("stroke", "blue")
  .attr("stroke-width", 5)
  .attr("d", lineConEscalas(datos));
