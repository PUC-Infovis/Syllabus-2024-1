const WIDTH = 800;
const HEIGHT = 200;

//////////////////////////////////////////////////
//////                 Datos               ///////
//////////////////////////////////////////////////
const datosEj2 = [
  { valor: 190, categoria: "orange" },
  { valor: 20, categoria: "yellow" },
  { valor: 120, categoria: "cyan" },
  { valor: 70, categoria: "orange" },
  { valor: 40, categoria: "yellow" },
  { valor: 100, categoria: "cyan" },
];

const datosEjBonus = [
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
  { paso: 16, valor: 1 },
  { paso: 17, valor: 1 },
  { paso: 18, valor: 1.612975926713831 },
  { paso: 19, valor: 2.0922396007490622 },
  { paso: 20, valor: 1.5968876881845189 },
];

//////////////////////////////////////////////////
//////               Ejemplo 1             ///////
//////////////////////////////////////////////////
const svgEj2 = d3
  .select("#ej2")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

const arcos = d3.arc()
  .padAngle((2 * Math.PI) / 100)
  .cornerRadius(5);

const dString = arcos({
  innerRadius: 0,
  outerRadius: 100,
  startAngle: 0,
  endAngle: (2 * Math.PI) / 3,
})
console.log("dString: ", dString);

svgEj2
  .append("path")
  .attr("d", dString)
  .attr("fill", "orange")
  .attr("stroke", "black")
  .attr("transform", "translate(100, 100)");

// Podemos definir constantes para reducir la cantidad de datos despues
arcos.innerRadius(50).outerRadius(75);

svgEj2
  .append("path")
  .attr("d", arcos({ startAngle: 0, endAngle: (2 * Math.PI) / 3, }))
  .attr("fill", "orange")
  .attr("stroke", "black")
  .attr("transform", "translate(300, 100)");

svgEj2
  .append("path")
  .attr("d", arcos({ startAngle: (2 * Math.PI) / 3, endAngle: 2 * (2 * Math.PI) / 3, }))
  .attr("fill", "blue")
  .attr("stroke", "black")
  .attr("transform", "translate(300, 100)");

//////////////////////////////////////////////////
//////               Ejemplo 2             ///////
//////////////////////////////////////////////////
const svgEj3 = d3
  .select("#ej3")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

const pie = d3
  .pie()
  .value((d) => d.valor)
  .sort(null);

const arcosCalculados = pie(datosEj3);
console.log("arcosCalculados", arcosCalculados);

const arcosPie = d3
  .arc()
  .innerRadius(0)
  .outerRadius(75)
  .padAngle((2 * Math.PI) / 200)
  .cornerRadius(0);

svgEj3
  .selectAll("path")
  .data(arcosCalculados)
  .join("path")
  .attr("d", (d) => arcosPie(d))
  .attr("fill", (d) => d.data.categoria)
  .attr("stroke", "black")
  .attr("transform", "translate(100, 100)");


//////////////////////////////////////////////////
//////            Ejemplo Bonus            ///////
//////////////////////////////////////////////////
const svgEjejBonus = d3
  .select("#ejBonus")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);


const escalaAngulo = d3
  .scaleLinear()
  .domain(d3.extent(datosEjBonus, (d) => d.paso))
  .range([0, 2 * Math.PI]);

const escalaRadio = d3
  .scaleLinear()
  .domain([0, d3.max(datosEjBonus, (d) => d.valor)])
  .range([10, 100 - 10]);

// Generar una línea
const lineaRadial = d3
  .lineRadial()
  .curve(d3.curveNatural)
  .angle((d) => escalaAngulo(d.paso))
  .radius((d) => escalaRadio(d.valor));

svgEjejBonus
  .append("path")
  .attr("fill", "transparent")
  .attr("stroke", "blue")
  .attr("stroke-width", 2)
  .attr("transform", "translate(100, 100)")
  .attr("d", lineaRadial(datosEj1));

svgEjejBonus
  .append("circle")
  .attr("cx", 100)
  .attr("cy", 100)
  .attr("r", 3)
  .attr("fill", "red");

svgEjejBonus
  .append("circle")
  .attr("cx", 100)
  .attr("cy", 100)
  .attr("r", 100)
  .attr("fill", "transparent")
  .attr("stroke", "red");

// Generar un área
const areaRadial = d3
  .areaRadial()
  .curve(d3.curveNatural)
  .angle((d) => escalaAngulo(d.paso))
  .innerRadius(0)
  .outerRadius((d) => escalaRadio(d.valor));

svgEjejBonus
  .append("path")
  .attr("fill", "blue")
  .attr("transform", "translate(400, 100)")
  .attr("d", areaRadial(datosEj1));

svgEjejBonus
  .append("circle")
  .attr("cx", 400)
  .attr("cy", 100)
  .attr("r", 3)
  .attr("fill", "red");

svgEjejBonus
  .append("circle")
  .attr("cx", 400)
  .attr("cy", 100)
  .attr("r", 100)
  .attr("fill", "transparent")
  .attr("stroke", "red");