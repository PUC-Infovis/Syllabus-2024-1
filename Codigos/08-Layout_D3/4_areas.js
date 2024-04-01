const WIDTH = 800;
const HEIGHT = 300;

//////////////////////////////////////////////////
//////                 Datos               ///////
//////////////////////////////////////////////////
const datosEj1 = [
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
const svgEj1 = d3
  .select("#ej1")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

const escalaXEj1 = d3
  .scaleBand()
  .domain(datosEj1.map((d) => d.paso))
  .range([10, WIDTH - 10]);

const escalaYEj1 = d3
  .scaleLinear()
  .domain([0, d3.max(datosEj1, (d) => d.valor)])
  .range([HEIGHT - 10, 10]);

const areaEj1 = d3
  .area()
  .curve(d3.curveMonotoneX)
  .x0((d) => escalaXEj1(d.paso) + escalaXEj1.bandwidth() / 2)
  .y0(HEIGHT - 10)
  .x1((d) => escalaXEj1(d.paso) + escalaXEj1.bandwidth() / 2)
  .y1((d) => escalaYEj1(d.valor));

svgEj1
  .append("path")
  .attr("fill", "blue")
  .attr("stroke", "red")
  .attr("stroke-width", 5)
  .attr("d", areaEj1(datosEj1));


//////////////////////////////////////////////////
//////               Ejemplo 2             ///////
//////            Estudio remoto           ///////
//////////////////////////////////////////////////

const datosEj2URL = "https://gist.githubusercontent.com/Hernan4444/fc20ed579ccbc3186e018be85aaea028/raw/94168fcdb3c2b4f16ca84c626e63781f447756e8/stack_info";


function parseData(row) {
  data = JSON.parse(row.data)

  return {
    dia: row.dia,
    trabajar: data.trabajar,
    ver_anime_manga: data.ver_anime_manga,
    dormir: data.dormir
  }
}

d3.csv(datosEj2URL, parseData).then(datosEj2 => {
  const svgEj2 = d3
    .select("#ej2")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

  const apilador = d3
    .stack()
    .keys(["trabajar", "ver_anime_manga", "dormir"]);

  const series = apilador(datosEj2);
  console.log("series", series);

  const escalaX = d3
    .scaleBand()
    .domain(d3.range(datosEj2.length))
    .range([10, WIDTH - 10])
    .padding(1);

  function getMax(lista) {
    // lista es = [ [X, Y, data], [Y, Z, data], [Z, AA, data]]
    return d3.max(lista, (arreglo) => arreglo[1])
  }

  const maxValuEejeY = d3.max(series, (serie) => getMax(serie))

  const escalaY = d3
    .scaleLinear()
    .domain([0, maxValuEejeY])
    .range([HEIGHT - 10, 10]);

  const escalaColor = d3
    .scaleOrdinal()
    .domain(series.keys())
    .range(["blue", "magenta", "orange"]);

  const area = d3
    .area()
    .curve(d3.curveMonotoneX)
    .x0((_, i) => escalaX(i) + escalaX.bandwidth() / 2)
    .y0((par) => escalaY(par[0]))
    .x1((_, i) => escalaX(i) + escalaX.bandwidth() / 2)
    .y1((par) => escalaY(par[1]));

  svgEj2
    .selectAll("path")
    .data(series)
    .join("path")
    .attr("fill", (serie) => escalaColor(serie.key))
    .attr("d", (serie) => area(serie));
})


//////////////////////////////////////////////////
//////          Ejemplo 3 (bonus)          ///////
//////////////////////////////////////////////////

d3.csv(datosEj2URL, parseData).then(datosEj2 => {

  // Utilizamos los datosEj2, series, escalaY, escalaColor
  // del ejemplo anterior. Solo creamos una nueva escala de bandas
  // y construimos los rects necesarios.
  const svgEj3 = d3
    .select("#ej3")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

  const apilador = d3
    .stack()
    .keys(["trabajar", "ver_anime_manga", "dormir"]);

  const series = apilador(datosEj2);
  console.log("series ej2", series);

  function getMaxEje2(lista) {
    // lista es = [ [X, Y, data], [Y, Z, data], [Z, AA, data]]
    return d3.max(lista, (arreglo) => arreglo[1])
  }

  const maxValuEejeYEj2 = d3.max(series, (serie) => getMaxEje2(serie))

  const escalaY = d3
    .scaleLinear()
    .domain([0, maxValuEejeYEj2])
    .range([HEIGHT - 10, 10]);

  const escalaColor = d3
    .scaleOrdinal()
    .domain(series.keys())
    .range(["blue", "magenta", "orange"]);

  // Nueva escala creada para este caso
  const escalaXBar = d3
    .scaleBand()
    .domain(d3.range(datosEj2.length))
    .range([10, WIDTH - 10])
    .padding(0.3);


  // Momento desafiante: **2 data joins consecutivos**.
  // El primero genera un G para cada categoría posible.
  svgEj3
    .selectAll("g")
    .data(series)
    .join(
      enter => {
        const g = enter.append("g")
        g.attr("fill", (d) => escalaColor(d.key))

        // Luego, para cada G se hace otro data join con sus datos por día
        g.selectAll("rect")
          .data((d) => d)
          .join("rect")
          .attr("x", (d, i) => escalaXBar(i))
          .attr("y", (d) => escalaY(d[1]))
          .attr("width", escalaXBar.bandwidth())
          .attr("height", (d) => escalaY(d[0]) - escalaY(d[1]));

        return g
      }
    )

})



