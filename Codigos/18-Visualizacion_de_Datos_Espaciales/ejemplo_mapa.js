const WIDTH = 800;
const HEIGHT = 500;
const TOPE = 500;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Creamos inputs para poder agregar puntos a la visualización
const inputLongitud = d3.select("body").append("input").attr("type", "number");
const inputLatitud = d3.select("body").append("input").attr("type", "number");
const agregarPunto = d3.select("body").append("button").text("Agregar punto");

// Cargamos el geojson con la información de los paises
// paises_light   Paises más conocidos (175) y dibujados sin tanto detalle
// paises_medium  Más paises (219) y dibujados más detallados
d3.json("paises_medium.json").then((datos) => {
  console.log(datos)

  // Generamos una escala que transforma la densidad a una escala de colores
  const escalaSecuencialColor = d3
    .scaleSequential()
    .interpolator(d3.interpolateYlGnBu)
    .domain(d3.extent(datos.features, (f) => f.properties.population_2022));

  // Algunas opciones de proyecciones
  // d3.geoMercator();
  // d3.geoCylindricalEqualArea();
  // d3.geoWinkel3();
  const proyeccion = d3.geoWinkel3()
    // Opción 1 - Definir nosotros parámetros de la proyección.
    // .scale(150)
    // .rotate([-10, -20, -40])
    // .center([-10, -40])
    // .translate([20, 20])
    // Opción 2 - Ajustar los parámetros automáticamente leyendo los datos disponibles
    .fitSize([WIDTH, HEIGHT], datos);

  // Generamos una función de D3 encargada de crear los "d" a partir de la proyección realizada
  const caminosGeo = d3.geoPath().projection(proyeccion);

  // Agregamos cada feature en el mapa
  svg
    .selectAll("path")
    .data(datos.features)
    .join("path")
    .attr("d", caminosGeo)
    .attr("fill", (f) => escalaSecuencialColor(f.properties.population_2022))
    .attr("stroke", "#ccc");

  // Definimos una función que cuando apretamos en el botón, se agrega un punto al mapa
  agregarPunto.on("click", () => {
    const longitud = parseFloat(inputLongitud.node().value);
    const latitud = parseFloat(inputLatitud.node().value);

    if (!isNaN(longitud) && !isNaN(latitud)) {
      // Santiago -> longitud -70.64827 y latitud -33.45694
      // Tokyo    -> longitud 139.69171 y latitud 35.6895
      const nuevaPosicion = proyeccion([longitud, latitud])
      svg
        .append("circle")
        .attr("cx", nuevaPosicion[0])
        .attr("cy", nuevaPosicion[1])
        .attr("r", 2)
        .attr("fill", "red");
    }
  });
});
