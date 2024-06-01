// Creamos constantes para esta visualización.
const LINK = "https://gist.githubusercontent.com/Hernan4444/ecbf4e3130948128d9f8332e2a56b393/raw/78c8721f4ebf05cf87f12a7809a1a05ff9bc474b/datasaurus.csv"
const WIDTH = 600;
const HEIGHT = 400;
const MARGIN = {
  top: 70,
  bottom: 70,
  right: 30,
  left: 70,
};

const HEIGHTVIS = HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

const svg = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)
  .style("border", '1px solid')
  .style("margin", '10px 10px');

// Cleamos nuestro clip que oculta todo lo que está fuera del rect
svg
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", WIDTHVIS)
  .attr("height", HEIGHTVIS);

// Creamos otro clip para nuestro eje
svg
  .append("clipPath")
  .attr("id", "clipEje")
  .append("rect")
  .attr("x", -5)
  .attr("width", WIDTHVIS + 10)
  .attr("height", HEIGHTVIS);

// Contenedores para nuestros ejes
const contenedorEjeY = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

const contenedorEjeX = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${HEIGHTVIS + MARGIN.top})`)
  .attr("clip-path", "url(#clipEje)");


// Asignamos nuestro clip al contenedor de la visualización.
const contenedorVis = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
  .attr("clip-path", "url(#clip)");

// d3.autoType parsea el CSV de forma automática.
// Ojo que a veces puede fallar, así que siempre verificar
// que los tipos de datos estén bien antes de comenzar a programar
d3.csv(LINK, d3.autoType).then(datos => {
  const escalaY = d3
    .scaleLinear()
    .domain([0, d3.max(datos, (d) => d.y) * 1.1])
    .range([HEIGHTVIS, 0]);

  const ejeY = d3.axisLeft(escalaY);
  contenedorEjeY.call(ejeY);

  const escalaX = d3
    .scaleLinear()
    .domain([0, d3.max(datos, (d) => d.x) * 1.1])
    .range([0, WIDTHVIS]);

  const ejeX = d3.axisBottom(escalaX);
  contenedorEjeX.call(ejeX);

  const puntos = contenedorVis
    .selectAll("circle")
    .data(datos)
    .join("circle")
    .attr("fill", "magenta")
    .attr("r", 2)
    .attr("cx", (d) => escalaX(d.x))
    .attr("cy", (d) => escalaY(d.y));

  const manejadorZoom = (evento) => {
    // Obtenemos nuestra transformación
    const transformacion = evento.transform;

    // Actualizamos el rango de la escala considerando la transformación realizada.
    escalaX.range([transformacion.applyX(0), transformacion.applyX(WIDTHVIS)])

    // Actualizamos posición en X con la escala actualizada
    puntos.attr("cx", (d) => escalaX(d.x));

    // Actualizamos el ejeX con la escala actualizada
    contenedorEjeX.call(ejeX.scale(escalaX));
  };

  // Creamos objeto zoom
  // Definimos los rangos de escalas (máximo alejarse 0.5 y acercarse el doble)
  // El evento principal (zoom) la conectamos con nuestra función que actualiza la vis.

  // Panning. Definimos el tamaño de nuestra cámara (con extent)
  // Definimos el cuadro máximo donde se puede mover nuestra cámara (con translateExtent)
  // Recomendación: extent == translateExtent == tamaño svg
  const zoom = d3.zoom()
    .scaleExtent([1, 3])
    .extent([[0, 0], [WIDTH, HEIGHT]])
    .translateExtent([[0, 0], [WIDTH, HEIGHT]])
    .on("zoom", manejadorZoom)

  // Conectamos el objeto zoom con el SVG para que se encargue de definir
  // todos los eventos necesarios para que funcione el zoom.
  svg.call(zoom);
})
