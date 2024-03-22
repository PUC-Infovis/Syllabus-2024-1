// Link a los datos originales, para esta ayudantía usaremos un archivo .csv
// dataURL = "https://gist.githubusercontent.com/Hernan4444/0851721fc908bf57c77c96ced416f332/raw/21efbe0f6424e453daebfc3b38e90984ad043989/datos.json";

// Ruta a los datos
data_path = "datos.csv";

// Ver el ancho y el alto de la ventana, para saber cuánto espacio tenemos
console.log("window.innerWidth:", window.innerWidth);
console.log("window.innerHeight:", window.innerHeight);

// Elegimos el ancho y el alto de nuestra visualización
const WIDTH = 1000;
const HEIGHT = 600;
const SVG = d3
  .select("#vis")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// OTRA FORMA DE AGREGAR EL SVG
// const SVG = d3.select("body")
//   .append("svg")
//   .attr("width", WIDTH)
//   .attr("height", HEIGHT);

const margins = [200, 10, 50, 40]; //IZQUIERDA, DERECHA, ARRIBA, ABAJO

// Función para parsear los datos, luego esto se lo pasamos a d3.csv
const parseo = row => {
  return {
    index: +row.index,
    rank: +row.rank,
    name: row.repo_name,
    stars: +row.stars,
  };
};

// Función para leer y preprocesar los datos
function preprocessingBarchartDataset(data) {
  // console.log(data);

  d3.csv(data, parseo).then(function (data) {
    // Ver los datos parseados
    // console.log(data);

    /* Ordenamos la lista según su rank. NOTA: Este método sort recibe una función que 
    compara dos elementos, si el resultado es negativo, el primer elemento (en este caso a)
    es ubicado antes que el segundo (b). En caso de empate, no se modifica el orden original. */
    let dicc_sorted = data.sort((a, b) => a.rank - b.rank);

    // Tomamos los primeros 10 datos
    let slice = dicc_sorted.slice(0, 10);

    // Llamamos a nuestra función que genera la visualización
    barplot(slice);
  });
}

function barplot(parsed_data) {
  // Ver los datos
  console.log(parsed_data);

  // SETEAR LA VISUALIZACION

  // Máximo para los datos según el atributo "Stars", el mínimo no lo vamos a usar
  let max_stars = d3.max(parsed_data, d => d.stars);
  // let min_stars = d3.min(parsed_data, d => d.stars);

  // Definimos las escalas
  let escala_horizontal = d3
    .scaleLinear()
    .domain([0, max_stars * 1.1])
    // NOTA: El factor 1.1 es para que pueda funcionar con otros datos o atributos
    .range([margins[0], WIDTH - margins[1]]);

  let escala_vertical = d3
    .scaleBand()
    .domain(parsed_data.map(d => d.name))
    .range([margins[2], HEIGHT - margins[3]])
    .paddingInner(0.5);

  // Definimos los ejes en relación a las escalas
  let ejeX = d3.axisBottom(escala_horizontal);
  let ejeY = d3.axisLeft(escala_vertical);

  // Creamos nuestro primer RECT que será el fondo
  SVG.append("rect")
    .attr("x", 0) // Definimos atributo X
    .attr("y", 0) // Definimos atributo Y
    .attr("width", WIDTH) // Definimos atributo "ancho"
    .attr("height", HEIGHT) // Definimos atributo "largo"
    .attr("fill", " #D2EBF1") // Definimos el relleno
    .attr("stroke", "black"); // Definimos el color del borde

  //Agregamos el eje X. Para esto usamos call y d3.axisBottom(escala_horizontal)
  SVG.append("g")
    .attr("id", "ejeX") // Le damos un ID
    .attr("transform", `translate(0,${HEIGHT - margins[3] + 5})`) // Trasladamos el G
    .call(ejeX); // Usamos call para crear el eje

  //Agregamos el eje Y. Para esto usamos call y d3.axisLeft(escala_vertical)
  SVG.append("g")
    .attr("id", "ejeY") // Le damos un ID
    .attr("transform", `translate(${margins[0]},0)`) // Trasladamos el G
    .call(ejeY); // Usamos call para crear el eje

  //Seleccionamos nuestro Eje X y luego cada línea (los ticks)
  SVG.select("#ejeX")
    .selectAll("line")
    .attr("y2", -(HEIGHT - margins[3] - margins[2])) // Definimos el punto de fin de la línea.
    /* Notar que este valor es negativo porque tomamos el eje x como referencia, 
    que ya tiene un valor en el eje y, y lo estamos definiendo respecto a eso. */
    .attr("stroke", "black") // Definimos el color de la línea
    .attr("stroke-width", 1.5) // Definimos en ancho de la línea
    .attr("stroke-dasharray", "5,5") // Extra: definimos que será punteada
    .attr("opacity", (_, i) => {
      if (i === 0) {
        return 0;
      } else {
        return 0.5;
      }
    });
  /* Esto último hace un poco opaca la línea del eje, pero la opacidad es 0 para 
  la primera línea, cosa que no se sobreponga con el eje Y */

  // Extra
  // Se pueden esconder los labels del eje y.
  // d3.select("#ejeY").selectAll("text").attr('opacity', 0)

  // Seleccionamos nuestro EjeY y luego cada texto (los labels)
  d3.select("#ejeY")
    .selectAll("text")
    .attr("font-size", 15) // Le cambiamos su tamaño
    .attr("font-weight", "bold") // Lo hacemos más negro
    .attr("font-family", "monospace"); //Hacemos que sea mono espaciado, es decir, cada letra usa el mismo espacio

  // Bonus
  // Tambien se puede asignar una clase para aplicar el estilo en css
  // d3.select("#ejeY").selectAll("text").attr('class', 'labelsY');

  // GRAFICAR DATOS

  // BARRAS
  // Creamos un G, le damos el id "barsG"
  let barsG = SVG.append("g").attr("id", "barsG");

  // Usamos la variable "barsG" que tiene nuestro G y aplicamos data-join
  barsG
    .selectAll("rect") // Buscamos cada rect
    .data(parsed_data) // Aplicamos data-join entre los rect y los datos
    .join("rect") // Creamos un rect para cada dato del conjunto "ENTER"
    .attr("x", margins[0]) // Definimos el x de nuestras barras
    .attr("y", d => escala_vertical(d.name)) // Definimos el Y de nuestras barras
    .attr("width", d => escala_horizontal(d.stars) - margins[0]) // Definimos el ancho
    .attr("height", escala_vertical.bandwidth()) // Definimos el largo constante
    // .attr('fill', '#2E3132') // Color constante para todas las barras
    .attr("fill", d => {
      /* O bien, usamos una arrow function para aplicar un color distinto a la barra con 
    mayor cantidad de estrellas. TIP: Para encontrar paletas de colores bonitas, pueden usar 
    la siguiente página: https://coolors.co/ */
      if (d.stars == max_stars) {
        return "#FFD700"; // Color dorado
      } else {
        return "#94B3B9"; // Color celeste
      }
    })
    .attr("stroke", "black") // Definimos un borde negro a cada barra
    .attr("stroke-width", 1.5); // Definimos el ancho del borde
}

/* Llamamos a nuestra función encargada de procesar los datos, que a su vez se encarga de llamar
a la función que crea la visualización */
preprocessingBarchartDataset(data_path);
