// Creamos constantes para cada visualización.
const WIDTH = 500;
const HEIGHTSVG1 = 500;
const HEIGHTSVG2 = 500;

const MARGIN = {
  top: 10,
  bottom: 40,
  right: 20,
  left: 100,
};

const MARGIN2 = {
  top: 10,
  bottom: 40,
  right: 10,
  left: 80,
};

const HEIGHTVIS = HEIGHTSVG1 - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

const HEIGHTVIS2 = HEIGHTSVG2 - MARGIN2.top - MARGIN2.bottom;
const WIDTHVIS2 = WIDTH - MARGIN2.right - MARGIN2.left;

// =============================================
// Creamos los elementos principales de la vis 1
// =============================================

// Creamos el título de la primera visualización
d3.select("#vis1")
  .append("h2")
  .text("Cantidad de animes por categoría")

// Creamos un SVG en body junto con su tamaño ya definido.
const svg_barras = d3.select("#vis1")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHTSVG1)

// Creamos un contenedor específico para cada eje, y para cada visualización.
const contenedorEjeY = svg_barras
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

const contenedorEjeX = svg_barras
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top + HEIGHTVIS})`)

const contenedorVis = svg_barras
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

// =============================================
// Creamos los elementos principales de la vis 2
// =============================================
  
// Creamos el título de la segunda visualización
d3.select("#vis2")
  .append("h2")
  .text("Puntaje y miembros por anime")

// Creamos SVG de la segunda visualización
const contenedorVis2 = d3.select("#vis2")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHTSVG2)

  // Creamos los títulos de cada eje
contenedorVis2
  .append("text")
  .text("Miembros")
  .attr("dominant-baseline", "text-before-edge")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(270)")
  .attr("font-weight", "bold")
  .attr('x', -HEIGHTSVG2/2)
  
contenedorVis2
  .append("text")
  .text("Puntaje")
  .attr('y', HEIGHTSVG2)
  .attr('x', WIDTHVIS2/2)
  .attr("font-weight", "bold")
  .attr("dominant-baseline", "text-after-edge")

const contenedorEjeY2 = contenedorVis2
  .append("g")
  .attr("transform", `translate(${MARGIN2.left}, ${MARGIN2.top})`)

const contenedorEjeX2 = contenedorVis2
  .append("g")
  .attr("transform", `translate(${MARGIN2.left}, ${HEIGHTVIS2 + MARGIN2.top})`)

// Asignamos nuestro clip al contenedor de la visualización.
const contenedorPuntos = contenedorVis2
  .append("g")
  .attr("transform", `translate(${MARGIN2.left} ${MARGIN2.top})`)
  .attr("clip-path", "url(#clip)");

// Definimos el clipPath de la segunda visualización
contenedorVis2
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", WIDTHVIS2)
  .attr("height", HEIGHTVIS2);


// ========================
// ===== Código Vis 1 =====
// ========================

/** Función para crear/actualizar las barras
 * 
 * @param {Array} generos_animes 
 * @param {d3.scale} escalaX 
 * @param {d3.scale} escalaY 
 * @returns {d3.selection}
 */
function barrasVis1(generos_animes, escalaX, escalaY) {
  const rectangulos = contenedorVis
    .selectAll(".bar")
    .data(generos_animes, d => d.genre)
    .join(enter => enter
      .append("rect")
      .attr("class", "bar")
      .attr("height", escalaY.bandwidth())
      .attr("y", d => escalaY(d.genre))
      .attr("width", d => escalaX(d.ids.length))
      .attr("fill", "black")
      ,
      update => update.attr("fill", d => d.selected ? 'red' : 'black'),
      // Cabe mencionar que no usaremos el exit en esta visualización, pero 
      // igualo de definimos para acordarnos del data-join completo
      exit => exit.remove()
    )
  return rectangulos
}

/** Función para cargar los datos e instanciar la primera visualización
 * Dentro de esta función se llama la creación/modificación de la segunda visualización
 * @param datos Información de cada anime
 */
function joinDeDatos(datos) {
  // Hacemos un log de los datos por si los queremos ver en consola
  console.log(datos)

  // Obtenemos la lista de todos los géneros de anime disponibles
  let genres = d3.reduce(datos, (d, e) => d.union(e.genres), new Set())

  // Obtenemos los animes que tienen cada género y los agrupamos por género.
  // Notar que un ánime puede tener mas de un género
  let generos_animes = d3.map(genres, genre => [
    genre, d3.map(d3.filter(datos, d => d.genres.has(genre)), d => d.id)
  ])
  // Luego nos quedamos con los géneros que tienen a lo menos
  // 10 animes
  .filter(d => d[1].length >= 10).map(d => ({
    "genre": d[0],
    "ids": d[1],
    "selected": false
  }))

  // Ordenamos los géneros por orden alfabético
  genres = generos_animes.map(d => d.genre).sort(d3.ascending)
  console.log(generos_animes)

  const max_anime_genero = d3.max(generos_animes, d => d.ids.length)

  // Creamos las escalas
  // Escala con las cantidades de anime
  const escalaX = d3.scaleLinear()
    .domain([0, max_anime_genero])
    .range([0, WIDTHVIS]);
  const ejeX = d3.axisBottom(escalaX)

  contenedorEjeX
    .transition()
    .duration(500)
    .call(ejeX)
    .selectAll("line")
    .attr("y1", -HEIGHTVIS)
    .attr("opacity", 0.5)

  // Escala con los nombres de los géneros
  const escalaY = d3.scaleBand()
    .domain(genres)
    .range([0, HEIGHTVIS])
    .padding(0.2);
  const ejeY = d3.axisLeft(escalaY);
  contenedorEjeY.transition()
    .duration(500)
    .call(ejeY)
    .selectAll("text")
    .attr("font-size", 14);

  // Podemos usar esta función para obtener el
  // ancho de la banda de esta escala
  console.log(["bw", escalaY.bandwidth()])

  // Llamamos a la función para crear el gráfico de barras
  rectangulos = barrasVis1(generos_animes, escalaX, escalaY)


  // Este brush funciona un poco distinto
  // con el fin de poder seleccionar géneros
  // no adyascentes.
  // Funciona de forma similar a usar Ctrl al
  // seleccionar archivos. Solo que
  // para esta vis se usa el Shift.

  // Creamos el brush
  const brush = d3.brushY()
    .extent([[0, 0], [WIDTHVIS, HEIGHTVIS]])
    // Al iniciar setea los géneros seleccionados actualmente
    .on("start", getSelected)
    // Mientras se hace el brush verá si se agregan o sacan géneros
    .on("brush", brushed)
    // Finalmente, llama a la segunda visualización
    .on("end", clearBrush)


  // Creamos una función para quedarnos con los géneros selecionados actualmente
  let generosSeleccionados = new Set();
  function getSelected() {
    let seleccionados = generos_animes.filter(d => d.selected)
    generosSeleccionados = new Set(seleccionados.map(d => d.genre));
    return
  }

  // Hacemos el link entre el brush y la visualización
  contenedorVis.append("g").call(brush)

  // Para cada género determinar donde comienza la barra
  const genresPosition = genres.map(d => [d, escalaY(d)]);

  function brushed(event) {
    // Obtenemos el rango seleccinado
    selection = event.selection

    // Obtenemos si se está oprimiendo Shift
    shiftKey = event.sourceEvent && event.sourceEvent.shiftKey

    // Si no hay elementos seleccionados, no hay algo que hacer
    if (!selection) return;

    // Determinar la posición superior e inferior del brush
    const topPos = selection[0];
    const bottomPos = selection[1];

    // Géneros tocados por el brush
    filteredGenres = genresPosition.filter(d => {
      const position = d[1];
      // El borde inferior de la barra está por encima del brush
      if (position + escalaY.bandwidth() < topPos) {
        return false;
      }
      // El borde superio de la barra está por debajo del brush
      if (position > bottomPos) {
        return false;
      }
      // En otro caso, la barra está siendo tocada por el brush
      return true;
    })

    // Me quedo únicamente con los géneros seleccionados
    selected_brush_genres = new Set(filteredGenres.map(d => d[0]))

    // Si hago shift mientras tengo el brush
    if (shiftKey) {
      generos_animes.map(d => {
        // Si el género está afectado por el brush mientras tengo shift
        if (selected_brush_genres.has(d.genre)) {
          // En caso de estar seleccioando, se des-selecciona.
          // Si no está seleccionado, se selecciona.
          d.selected = !generosSeleccionados.has(d.genre)
        }
        // Si el género no es afectado por el brush toma el valor de
        // los géneros seleccionados antes de empezar el brush.
        else {
          d.selected = generosSeleccionados.has(d.genre)
        }
        return d;
      })
    }
    // Si tengo brush normal, es decir, sin shift.
    else {
      // Me quedo con los géneros seleccionados por el brush.
      generos_animes.map(d => d.selected = selected_brush_genres.has(d.genre))
    }

    // Actualizo las barras según la selección.
    barrasVis1(generos_animes, escalaX, escalaY)
  }

  // Al finalizar el brush cargamos la segunda visualización
  function clearBrush(event) {
    // Esta línea se encarga que la función no se llame infinitamente
    // ya que el clear llama a esta función también
    if (!event.sourceEvent) return;
    // Sacamos el cuadro de selección
    // para que sea mas fácil seleccionar
    // elementos después
    brush.clear(d3.select(this), null)
    cargarVis2(generosSeleccionados, datos)
  }

  // Inicialmente mostramos la segunda visualización con todos los datos disponibles
  cargarVis2(new Set(genres), datos)
}

/** Carga la segunda visualización
 * @param {Set<string>} generos Géneros a visualizar
 * @param {*} data Información de todos los animes
 */
function cargarVis2(generos, data) {
  // Nos quedamos con los animes que tienen un
  datos = data.filter(d => !d.genres.isDisjointFrom(generos))

  // Restamos 50 para tener un valor un poco más pequeño que el mínimo
  const minValueY = d3.min(datos, (d) => d.members) * 0.91
  // Ya que el puntaje es fijo entre 0 y 10, lo dejamos hardcodeado
  // con un poco de padding, aquí es el caso del 0
  const minValueX = -0.5

  // Sumamos 30 para para tener un valor un poco más grande que el máximo
  const maxValueY = d3.max(datos, (d) => d.members) * 1.1
  // y este es el caso del 10
  const maxValueX = 10.5

  // Creamos las escalas
  const escalaY = d3
    .scaleLinear()
    .domain([minValueY, maxValueY])
    .range([HEIGHTVIS2, 0]);

  const escalaX = d3
    .scaleLinear()
    .domain([minValueX, maxValueX])
    .range([0, WIDTHVIS2]);

  // Crear objetos Eje que usan las escalas definidas anteriormente
  const ejeY = d3.axisLeft(escalaY);
  const ejeX = d3.axisBottom(escalaX);

  // Hacemos una animación en el eje Y cuando cambia por la primera vis
  contenedorEjeY2.transition().duration(500).call(ejeY);

  // El eje X no cambia por la primera vis
  contenedorEjeX2.call(ejeX);

  // creamos el gráfico de puntos
  const puntos = contenedorPuntos
    .selectAll("circle")
    .data(datos, d => d.id)
    .join(enter => {
      circles = enter
        .append("circle")
        .attr("cx", (d) => escalaX(d.score))
        .attr("cy", (d) => escalaY(d.members))
        .attr("r", 0)
        .attr("fill", "black")

      circles.append("title")
        .text(d => `${d.name}\nPuntaje: ${d.score}\nMiembros: ${d.members}`)
      
        circles
        .transition()
        .duration(500)
        .attr("r", 5)

      return circles
    },
      update => {
        update
          .transition()
          .duration(500)
          .attr("cx", (d) => escalaX(d.score))
          .attr("cy", (d) => escalaY(d.members))

        return update
      },
      exit => {
        exit
          .transition()
          .duration(500)
          .attr("r", 0)
        exit.transition("eliminar").delay(500).remove()
        
        return exit
      }
    );
  
  // Creamos la función que se encarga cuando se llama el zoom
  // Pueden ver que el ({transform}) se escribe algo extraño
  // es una función que nos permite llamar directo a una variable 
  // si especificamos su nombre
  // Mas información: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  const manejadorZoom = ({ transform }) => {
    // Creamos nuevas escalas según la transformación
    let escalaX_V2 = transform.rescaleX(escalaX)
    let escalaY_V2 = transform.rescaleY(escalaY)

    // Actualizamos posición de los elementos reubicándolos con la escala
    // Al solo cambiar la posición, el tamaño se mantiene
    puntos.attr("cx", (d) => escalaX_V2(d.score));
    puntos.attr("cy", (d) => escalaY_V2(d.members));

    // Actualizamos las escalas a los ejes visualizados
    contenedorEjeX2.call(ejeX.scale(escalaX_V2));
    contenedorEjeY2.call(ejeY.scale(escalaY_V2));
  };

  // Creamos objeto zoom
  // Definimos los rangos de escalas (máximo acercarse 20 veces)
  // El evento principal (zoom) la conectamos con nuestra función que actualiza la vis.

  // Panning. Definimos el tamaño de nuestra cámara (con extent)
  // Definimos el cuadro máximo donde se puede mover nuestra cámara (con translateExtent)
  // Recomendación: extent == translateExtent == tamaño svg
  const zoom = d3.zoom()
    .scaleExtent([1, 20])
    .extent([[0, 0], [WIDTHVIS2, HEIGHTVIS2]])
    .translateExtent([[0, 0], [WIDTHVIS2, HEIGHTVIS2]])
    .on("zoom", manejadorZoom)

  // Conectamos el objeto zoom con el SVG para que se encargue de definir
  // todos los eventos necesarios para que funcione el zoom.
  contenedorVis2.call(zoom);
}


// Función para parsear la información
function parseoCaracteristicas(d) {
  return {
    "name": d.Name,
    "score": +d.Score,
    "genres": new Set(d.Genres.split(', ')),
    "members": +d.Members,
    "episodes": +d.Episodes,
    "id": +d.MAL_ID,
  }
}
////////////////////////////////////////////
////                                    ////
////          CODIGO A EJECUTAR         ////
////                                    ////
////////////////////////////////////////////

function runCode() {
  // Cargamos el csv 
  const BASE_URL = "./";
  const LINK = BASE_URL + "anime.csv"
  
  d3.csv(LINK, parseoCaracteristicas).then(datos => {
    datosFinales = datos.filter(d =>
      // nos quedamos con los datos que no tengan NaN
      !isNaN(d.score) && !isNaN(d.members) && d.members >= 500000
    )
    joinDeDatos(datosFinales);
  })
}

runCode();
