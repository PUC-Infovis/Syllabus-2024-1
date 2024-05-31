// Definimos las típicas constantes

const WIDTH = 1000;
const HEIGHT = 700;
const margin = {
  top: 20,
  right: 50,
  bottom: 20,
  left: 50
}

const width = WIDTH - margin.left - margin.right;
const height = HEIGHT - margin.top - margin.bottom;

// Creamos el svg

const svg = d3
  .select("#vis")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Creamos un botón para poder reiniciar la visualización

const boton = d3
  .select("#vis")
  .append("input")
  .attr("id", "boton")
  .attr("type", "button")
  .attr("value", "Iniciar visualización")

// Creamos un "g" para el mapa

const contenedorMapa = svg
  .append("g")
  .attr("id", "contenedorMapa")
  .attr("transform", `translate(${margin.left} ${margin.top})`);

// Creamos otro "g" para los círculos

const contenedorCirculos = svg
  .append("g")
  .attr("id", "contenedorCirculos")
  .attr("transform", `translate(${margin.left} ${margin.top})`);

// Definimos la función para crear mapa
// En esta función solo creamos el mapa, sin los círculos, ya que el mapa en sí (los continentes) no se 
// actualizan en ningún momento, por lo que está función se llama una vez y así no sobrecargamos a nuestro
// navegador con el procesamiento del mapa cada vez que reiniciamos la visualiación

function crearMapa(datosMapa, datosTerremotos) {
  // Creamos una proyección https://github.com/d3/d3-geo#projections
  // Podemos usar cualquiera de las que se exponen en la documentación, aquí hay algunas de ejemplo
  // const proyeccion = d3.geoMercator()
  // const proyeccion = d3.geoConicEquidistant()

  const proyeccion = d3.geoWinkel3()
    .fitSize([width, height], datosMapa);

  // console.log(proyeccion)

  // Ahora creamos un generador de paths para que pueda crear el mapa. Lo configuramos con la proyeccion
  // que creamos anteriormente. https://github.com/d3/d3-geo#geoPath

  const caminosGeo = d3.geoPath().projection(proyeccion);

  // console.log(caminosGeo)

  // Definimos una escala logarítmica para las magnitudes de los terremotos
  // Hay que tener cuidado ya que el límite inferior de la escala logarítmica no puede ser
  // igual a 0, ya que esta se define como y = m * log(x) + b

  const escalaMagnitud = d3.scaleLog()
    .domain(d3.extent(datosTerremotos, d => d.Magnitude))
    .range([0, 20])

  // Ahora creamos una manera para que se puedan animar la creación de los puntos, con el objetivo de
  // lograr esto, obtenemos la fecha del primer terremoto y a partir de ella, sacamos la diferencia
  // de fechas entre cada terremoto y el primero. Este atributo nos servirá para poder agregar un delay
  // al enter de nuestro Join de Datos y así poder realizar la animación de los círculos

  let primeraFecha = new Date(datosTerremotos[0].Date);

  // Notar que dividimos por un número grande ya que si dejamos la diferencia de esa manera,
  // se demorará literalmente la cantidad de tiempo que hay entre terremoto.
  // La función Date.parse nos entrega un int que representa la fecha correspondiente

  for (let i = 0; i < datosTerremotos.length; i++) {
    let fechaTerremoto = new Date(datosTerremotos[i].Date)
    let diferenciaFechas = fechaTerremoto - primeraFecha;
    diferenciaFechas = new Date(diferenciaFechas);
    datosTerremotos[i].delay = Date.parse(diferenciaFechas) / 50000000
  }

  // También creamos una línea de tiempo para reconocer en que año estamos. Para esto creamos 
  // una escala de tiempo, cuyo dominio empieza en la fecha del primer terretemoto y termina en la del último

  const ultimaFecha = new Date(datosTerremotos[datosTerremotos.length - 1].Date)

  let escalaEjeX = d3.scaleTime()
    .domain([primeraFecha, ultimaFecha])
    .range([0, width])

  // Creamos un eje con la escala definida anteriormente

  let ejeX = svg
    .append("g")
    .attr("transform", `translate (${margin.left} ${margin.top})`)
    .call(d3.axisTop(escalaEjeX))

  // Creamos los datos para un círculo que será el que se moverá en la línea de tiempo definida
  // anteriormente. Esto se podría realizar de muchas maneras

  let circuloLineaTiempo = {
    id: 1,
    status: "ongoing"
  };

  // Realizamos el join de datos de los paths para crear el mapa

  contenedorMapa
    .selectAll("path")
    .data(datosMapa.features)
    .join("path")
    .attr("d", caminosGeo)
    .attr("fill", "lightgrey")

  // Fijamos un bool para saber si se quiere reiniciar la visualización o no

  let reinicio = false;

  // Configuramos nuestro botón para que sea capaz de detener la visualización y empezarla denuevo

  boton.on("click", () => {
    // Caso en la que queramos reiniciar, enviamos un array vacío de datos para que se active el 
    // exit del join de datos. Además fijamos el status del círculo de la línea de tiempo en "start"
    // para que pueda posicionarse en el inicio de la línea de tiempo

    if (reinicio) {
      circuloLineaTiempo.status = "start"
      animacionTerremotos([], escalaMagnitud, proyeccion, ejeX, circuloLineaTiempo)
      reinicio = false
      boton.attr("value", "Iniciar visualización")
    } else {
      // En este caso, queremos empezar la visualización, por lo que cambiamos el estado del círculo
      // a "ongoing" y de esta manera comienza a moverse. Además, llamamos a la función que crea los puntos

      circuloLineaTiempo.status = "ongoing"
      animacionTerremotos(datosTerremotos, escalaMagnitud, proyeccion, ejeX, circuloLineaTiempo)
      reinicio = true
      boton.attr("value", "Reiniciar visualización")
    }
  })
}

// En esta función creamos los puntos y la línea de tiempo
function animacionTerremotos(datosTerremotos, escalaMagnitud, proyeccion, ejeX, circuloLineaTiempo) {
  // Realizamos el join de datos de los círculos
  contenedorCirculos
    .selectAll("circle")
    .data(datosTerremotos, d => d.ID)
    .join(
      enter => {
        const circulos = enter.append("circle");

        // Para fijar los puntos, tenemos que utilizar la proyección creada anteriormente.
        // A esta, se le entrega la longitud y la latitud. Nos devuelve un array con la posición en
        // x e y del dato correspondiente
        circulos
          .attr("cx", d => proyeccion([d.Longitude, d.Latitude])[0])
          .attr("cy", d => proyeccion([d.Longitude, d.Latitude])[1])
          .transition()
          // Aquí realizamos el delay creado anteriormente. Esto significa que la transición para crear
          // el círculo se demorará lo indicado por este parámetro, haciendo la magia que crea la animación
          .delay(d => d.delay)
          .duration(2000)
          .attr("r", d => escalaMagnitud(d.Magnitude))
          .attr("opacity", 0.8)
          .attr("fill", "#4d66c9")
          // Creamos una transición adicional para hacer que los círculos antiguos sean menos opacos,
          // de esta manera, podemos ver claramente los nuevos círculos, ya que los terremotos
          // suelen ser en los mismos lugares donde ocurrieron previamente
          .transition()
          .duration(5000)
          .attr("opacity", 0.1)
          .attr("fill", "red");

        return circulos;
      },
      update => update,
      exit => {
        exit
          .transition()
          .duration(1000)
          .attr("r", 0)
          .remove()
      }
    )

  // Creamos el círculo que va en la línea de tiempo, puede que se vea redundante realizar un
  // join de datos para un solo dato, pero esto nos permite un manejo fácil acerca de la posición
  // del círculo. 
  // Además, recordar que data join necesita una lista de datos. Como circuloLineaTiempo es un
  // diccionario, lo ponemos dentro de una lista

  ejeX
    .selectAll("circle")
    .data([circuloLineaTiempo], d => d.id)
    .join("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 3)
    .attr("fill", "red")
    .transition()
    // El .ease es una función que se ocupa para realizar transiciones más suaves https://github.com/d3/d3-ease
    .ease(d3.easeLinear)
    // La duración entre que el círculo empieza y llega al final estará dada por el delay del terremoto más reciente
    .duration(d => d.status == "ongoing" ? datosTerremotos[datosTerremotos.length - 1].delay : 0)
    .attr("cx", d => d.status == "ongoing" ? width : 0);
}

// Creamos una función para convertir nuestros datos numéricos a ints.
function parseFunction(d) {
  const data = {
    Date: d.Date,
    Time: d.Time,
    Latitude: +d.Latitude,
    Longitude: +d.Longitude,
    Type: d.Type,
    Depth: +d.Depth,
    DepthError: d["Depth Error"],
    DepthSeismicStations: d["Depth Seismic Stations"],
    Magnitude: parseFloat(d.Magnitude),
    MagnitudeType: d["Magnitude Type"],
    MagnitudeError: d["Magnitude Error"],
    MagnitudeSeismicStations: d["Magnitude Seismic Stations"],
    AzimuthalGap: +d["Azimuthal Gap"],
    HorizontalDistance: +d["Horizontal Distance"],
    HorizontalError: +d["Horizontal Error"],
    RootMeanSquare: + d["Root Mean Square"],
    ID: d.ID,
    Source: d.Source,
    LocationSource: d["Location Source"],
    MagnitudeSource: d["Magnitude Source"],
    Status: d.Status,
  }

  return data
}

// Leemos nuestros datos. El primer dataset contiene los datos para poder crear el mapa, 
// mientras que el segundo contiene toda la información de los terremotos
d3.json("data/countries.geojson").then((datos) => {
  d3.csv("data/database.csv", parseFunction).then((datosTerremotos) => {
    crearMapa(datos, datosTerremotos)
  })
});