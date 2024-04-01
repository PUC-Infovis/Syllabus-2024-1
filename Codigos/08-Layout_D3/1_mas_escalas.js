const DATOS = [1, 1500, 4444, 11991231231012, 4444];

//////////////////////////////////////////////////
//////   Escalas para Datos Cuantitativos  ///////
//////////////////////////////////////////////////

// Escala lineal
const escalaLineal = d3
  .scaleLinear()
  .domain([1, d3.max(DATOS)])   // Dominio 0 al máximo de los datos
  .range([5, 100]);             // Rango de 5 a 100 pixeles

// Escala logaritico
const escalaLogaritmica = d3
  .scaleLog()
  .domain([1, d3.max(DATOS)])   // Dominio 0 al máximo de los datos
  .range([5, 100]);             // Rango de 5 a 100 pixeles

// Escala raíz cuadrada
const escalaRaiz = d3
  .scalePow()
  .exponent(0.5)
  .domain([0, d3.max(DATOS)])   // Dominio 0 al máximo de los datos
  .range([5, 100]);             // Rango de 5 a 100 pixeles

//////////////////////////////////////////////////
//////         Escalas para colores        ///////
//////////////////////////////////////////////////

// Escala logaritico
const escalaColor = d3
  .scaleLog()
  .domain([1, d3.max(DATOS)])   // Dominio 0 al máximo de los datos
  .range(["yellow", "orange"]); // Rango de amarillo a naranjo

// El rango será una interpolación obtenida de aquí
// https://d3js.org/d3-scale-chromatic/diverging
const escalaColorDivergente = d3
  .scaleDiverging(d3.interpolatePuOr)
  .domain([1, 4444, d3.max(DATOS)])   // Dominio debe tener 3 valores: inicio, punto medio y fin.

// El rango será una lista de colores inventada por nosotros o  de las existente aquí
// https://d3js.org/d3-scale-chromatic/categorical 
const escalaColorCategorica = d3
  .scaleOrdinal(d3.schemeAccent)                      // Opción 1 - Lista existente de D3
// .scaleOrdinal(["red", "blue", "green", "magenta"])  // Opción 2 - Lista inventada por nosotros


//////////////////////////////////////////////////
//////            Visualización            ///////
//////////////////////////////////////////////////

const SVG = d3
  .select("#ej1")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 200);

function visualizarDatos(escalaRadio, escalaColor) {

  // Cramos los círculos
  const circle = SVG
    .selectAll("circle")
    .data(DATOS)
    .join(
      enter => {
        // La primera vez que llegan, se crean con un radio y color constante
        const circle = enter.append("circle")
          .attr("cx", (_, i) => 100 + i * 200)
          .attr("cy", 100)
          .attr("fill", "magenta")
          .attr("r", 40)

        return circle;
      },
      update => update,
      exit => exit.remove()
    );

  // Luego, tanto los "creados" como los que "ya existen"
  // ajustan su radio y colo según las escalas
  circle
    .transition()
    .duration(2000)
    .attr("r", escalaRadio) // A cada dato le aplico la función de escala
    .attr("fill", escalaColor); // A cada dato le aplico la función de escala
}

//////////////////////////////////////////////////
//////              Ejecución              ///////
//////////////////////////////////////////////////

visualizarDatos(escalaLineal, escalaColor)
const ESCALAS = {
  "lineal": escalaLineal,
  "log": escalaLogaritmica,
  "srqt": escalaRaiz,
  "sec": escalaColor,
  "div": escalaColorDivergente,
  "cat": escalaColorCategorica,
}

let radioSeleccionado = "lineal"
let colorSeleccionado = "sec"

d3.select("#radio").on("change", (_) => {
  radioSeleccionado = document.getElementById("radio").selectedOptions[0].value;
  visualizarDatos(ESCALAS[radioSeleccionado], ESCALAS[colorSeleccionado])
})

d3.select("#color").on("change", (_) => {
  colorSeleccionado = document.getElementById("color").selectedOptions[0].value;
  visualizarDatos(ESCALAS[radioSeleccionado], ESCALAS[colorSeleccionado])
})