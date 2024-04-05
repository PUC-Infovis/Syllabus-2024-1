// Creamos constantes para esta visualización.
const WIDTH = 1100;
const HEIGHTSVG1 = 400;
const HEIGHTSVG2 = 1000;
const HEIGHT = HEIGHTSVG1 + HEIGHTSVG2
const MARGIN = {
  top: 70,
  bottom: 70,
  right: 30,
  left: 70, // se agranda este margen para asegurar que se vean los números
};

const HEIGHTVIS = HEIGHTSVG1 - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

const HEIGHTVIS2 = HEIGHTSVG2 - MARGIN.top - MARGIN.bottom;

// Creamos un SVG en body junto con su tamaño ya definido.
const svg_barras = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHTSVG1)

// Creamos el título de la segunda visualización
d3.select("body")
  .append("h2")
  .text("Datos de cada run")

// Creamos el checkbox
const checkbox = d3.select("body")
  .append("div")
  .append("text")
  .text("Ordenar por posición en vez de fecha") 
  .append("input")
  .attr("type", "checkbox")

// Creamos SVG de la segunda visualización
const svg_glifos = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHTSVG2)

// Creamos un contenedor específico para cada eje, y para cada visualización.
const contenedorEjeY = svg_barras
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

const contenedorEjeX = svg_barras
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

const contenedorVis = svg_barras
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

const contenedorVis2 = svg_glifos
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)


// Definimos variables que usaremos para la visualización
let escalaCategoria;
let escalaPosicion;
let sortBy = "date";
let dataActual = null

// El código que carga el gráfico de barras es una función modificada de una ayudantía
// del año pasado, la que es una modificación del código en el
// material del curso

/** Función para cargar los datos e instanciar la primera visualización
 * Dentro de esta función se llama la creación/modificación de la segunda visualización
 * @param datos Información de cada run del juego
 */
function joinDeDatos(datos) {
  // Hacemos un log de los datos por si los queremos ver en consola
  console.log(datos)

  // Agrupamos los datos por año, ya que la fecha es del tipo de dato Date,
  // usamos el getFullYear()
  const datos_agrupados = d3.groups(datos, d => d.fecha.getFullYear())
  // Notar que cada grupo es un arreglo de tamaño 2
  // El primer elemento es el valor con el que se agrupó (en este caso el mes)
  // El segundo elemento son los elementos del grupo (en este caso cada accidente
  // de cierto mes).
  console.log(datos_agrupados)

  // Obtenemos la posición promedio de cada grupo
  const promedioPosicion = d3.map(datos_agrupados, d => d3.mean(d[1], _d => _d.lugar))

  // Obtenemos los rangos de los datos. En este caso solo necesitamos el máximo.
  const maximaPosicion = d3.max(promedioPosicion);
  console.log("maxima posición " + maximaPosicion)

  // Definimos una escala lineal para determinar la posición en el eje Y.
  // Mapea un número entre 0 y maximaPosicion a un rango entre 0,y HEIGHTVIS.
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaY = d3.scaleLinear()
    .domain([1, maximaPosicion*1.1])
    .range([0, HEIGHTVIS]);

  // Creamos un eje izquierdo con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeY = d3.axisLeft(escalaY);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeY a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  // Luego personalizamos las líneas del eje.
  contenedorEjeY.transition()
    .duration(500)
    .call(ejeY)
    .selectAll("line")
    .attr("x1", WIDTHVIS)
    .attr("stroke-dasharray", "5")
    .attr("opacity", 0.5);

  // Definimos una escala de datos categóricos para determinar la posición en el eje X.
  // Esta escala genera una banda por cada categoría. 
  // Esta escala determinará la posición y ancho de cada banda en función del dominio y rango.
  // Mapea cada categoría a una banda específica.
  let anyos_ordenados = datos_agrupados.map(d => d[0]).sort((a, b) => a - b)
  const escalaX = d3.scaleBand()
    .domain(anyos_ordenados)
    .range([0, WIDTHVIS])
    .padding(1);

  // Creamos un eje inferior con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeX = d3.axisTop(escalaX);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeX a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  // Luego personalizamos el texto de dicho eje.
  contenedorEjeX.transition()
    .duration(500)
    .call(ejeX)
    .selectAll("text")
    .attr("font-size", 20);

  // Vinculamos los datos con cada elemento del lollipop con el comando join.
  // Usamos el enter para personalizar nuestros rect cuando se crean.
  // Los creamos con largo 0 pero ya posicionados donde corresponde.
  const rectangulos = contenedorVis
    .selectAll("g.lollipop")
    .data(datos_agrupados)
    .join(enter => {
        const g_lollipop = enter
          .append("g")
          .attr("class", "lollipop")

        g_lollipop
          .append("line")
          .attr("stroke", "orange")
          .attr("y1", 0)
          .attr("y2", 0)
          .attr("x1", (d) => escalaX(d[0]))
          .attr("x2", (d) => escalaX(d[0]))
          // Animamos la aparición de las líneas
          .transition("enter")
          .duration(500)
          .attr("y2", (d) => escalaY(d3.mean(d[1], _d => _d.lugar)))
        
        g_lollipop
          .append("circle")
          .attr("cx", (d) => escalaX(d[0]))
          .attr("cy", 0)
          .attr("r", 10)
          .attr("fill", "black")
          .attr("id", d=>`circle-${d[0]}`)
          // Cambiamos el cursor sobre el círculo
          .style("cursor", "pointer")
          // y animamos la de los círculos
          .transition("enter") 
          .duration(500)
          .attr("cy", (d) => escalaY(d3.mean(d[1], _d => _d.lugar)))

        return g_lollipop
      },
      update => update,
      exit => exit
    )
  // Definimos las escalas a partir de los datos
  escalaPosicion = d3.scaleLinear(
    d3.extent(datos, d=>d.lugar),
    ["#F0F", "#0FF"]
  )

  // Obtenemos las categorías de run distintas
  // y creamos la escala ordinal de las categorías
  escalaCategoria = d3.scaleOrdinal(d3.schemeDark2)
    .domain(d3.map(datos, d=> d.categoria))

  // Podemos mostrar en consola los elementos del dominio
  console.log(`Elementos dominio ${escalaCategoria.domain()}`)
  
  // Definimos un dataActual para usarlo en la segunda vis
  dataActual = datos_agrupados[0][1];

  // Al hacer click sobre el gráfico de lollipop,
  // mostramos los datos del mes seleccionado
  rectangulos.on("click", (_, dato) => {
    // Le pasamos solo los datos del año seleccionado a la segunda visualización
    dataActual = dato[1]

    rectangulos.selectAll("g.lollipop > circle")
      .transition("color-circulo") 
      .duration(500)
      .attr("fill", "black")

    rectangulos.select(`#circle-${dato[0]}`)
      .transition("color-circulo2") 
      .duration(500)
      .attr("fill", "red")
    
    // Llamamos a la segunda visualización
    cargarVis2(dataActual)
  })
  // Al hacer click en la checkbox, cambiamos el orden de los datos
  // de la segunda vis
  checkbox.on("click", () => {
    // Aquí cambiamos el criterio de ordenamiento
    // Notar que usamos el operador ternario. Este funciona de la siguiente forma:
    // (operacion_a_evaluar ? hacer_si_verdadero : hacer_si_falso)
    sortBy = (sortBy == "date" ? "posicion" : "date")
    // Llamamos a la segunda visualización
    cargarVis2(dataActual)
  })

  // == Hacemos las leyendas de la visualización ==
  let altura_texto = -45
  const diferencia_altura = 30

  // Leyenda del color de los botones
  // Primero colocamos el texto de la categoría
  contenedorVis2
    .append("text")
    .text("Lugar (color botón):")
    .attr("transform", `translate(0, ${altura_texto})`)
    .attr("dominant-baseline", "middle")

  // Luego ubicamos la leyenda de qué significa cada color
  contenedorVis2
    .selectAll("g.lugar")
    // Ya que la escala es linear, solo mostraremos los extremos
    .data(escalaPosicion.range())
    .join(
      enter => {
        const informacion_lugar = enter.append("g")
          .attr("class", "lugar")
          .attr("transform", (_, i) => `translate(${(i+1)*200+100}, ${altura_texto})`)

        informacion_lugar.append("text")
          // Aquí, en "i ?" aprovechamos que el primer índice es 0,
          // por lo que al evaluar si es verdadero o falso,
          // retorna falso, mientras que para el segundo índice
          // su valor es verdadero
          .text((_, i) => i ? "Último lugar" : "Primer lugar")
          .attr("dominant-baseline", "middle")

        informacion_lugar.append("circle")
          .attr("r", 10)
          .attr("cx", -12)
          .style("fill", d=>d)

        return informacion_lugar
      }
    )

  // Leyenda del rectángulo superior
  // Primero, actualizamos la altura_texto
  // para ubicat la leyenda justo abajo de la anterior
  altura_texto += diferencia_altura
  // Colocamos el texto de la categoría
  contenedorVis2
    .append("text")
    .text("Categoría (mitad superior base botón):")
    .attr("transform", `translate(0, ${altura_texto})`)
    .attr("dominant-baseline", "middle")

  // Luego ubicamos la leyenda de qué significa cada color
  contenedorVis2
    .selectAll("g.categoria")
    .data(escalaCategoria.domain())
    .join(
      enter => {
        const informacion_categoria = enter.append("g")
          .attr("class", "caregoria")
          .attr("transform", (_, i) => `translate(${(i+3)*100}, ${altura_texto})`)

        informacion_categoria.append("text")
          .text(d=>d)
          .attr("dominant-baseline", "middle")

        informacion_categoria.append("circle")
          .attr("r", 10)
          .attr("cx", -12)
          .style("fill", d=>escalaCategoria(d))

        return informacion_categoria
      }
    )

  // Leyenda del rectángulo inferior
  altura_texto += diferencia_altura
  // Primero colocamos el texto de la categoría
  contenedorVis2
    .append("text")
    .text("Categoría (mitad inferior base botón):")
    .attr("transform", `translate(0, ${altura_texto})`)
    .attr("dominant-baseline", "middle")

  // Luego ubicamos la leyenda de qué significa cada color
  contenedorVis2
    .selectAll("g.fecha")
    .data(["green", "red"])
    .join(
      enter => {
        const informacion_fecha = enter.append("g")
          .attr("class", "fecha")
          .attr("transform", (_, i) => `translate(${(i+1)*200+100}, ${altura_texto})`)  

        informacion_fecha.append("text")
          .text((_, i) => i ? "Último día del año" : "Primer día del año")
          .attr("dominant-baseline", "middle")

        informacion_fecha.append("circle")
          .attr("r", 10)
          .attr("cx", -12)
          .style("fill", d=>d)

        return informacion_fecha
      }
    )

  // Hacemos la leyenda de la plataforma
  altura_texto += diferencia_altura
  // Primero colocamos el texto de la plataforma
  contenedorVis2
    .append("text")
    .text("Plataforma:")
    .attr("transform", `translate(0, ${altura_texto})`)
    .attr("dominant-baseline", "middle")
  // Luego ubicamos la leyenda de qué significa cada plataforma
  contenedorVis2
    .selectAll("g.platadorma")
    .data(["N64", "VC", "EMU"])
    .join(
      enter => {
        const informacion_plataforma = enter.append("g")
          .attr("class", "plataforma")
          .attr("transform", (_, i) => `translate(${(i+1)*200+100}, ${altura_texto})`)  

        informacion_plataforma.append("text")
          .text(d=>d)
          .attr("dominant-baseline", "middle")

        informacion_plataforma.append("circle")
          .attr("r", 10)
          .attr("cx", -12)
        informacion_plataforma.append("text")
          .attr("x", -12)
          .attr("dominant-baseline", "middle")
          .attr("text-anchor", "middle")
          .text(d=>plataformaAString(d))
          .style("fill", "white")

        return informacion_plataforma
      }
    )
}

/** Función para generar la segunda visualización
 * Crea glifos con update, join, exit, Posee eventos de mouseenter y mouseleave
 * @param datos Información de cada accidente en particular
 */
function cargarVis2(datos) {
  const escalaFecha = d3.scaleLinear(
    d3.extent(datos, d=>d.fecha),
    ["green", "red"]
  )

  // Ordenamos los datos según el criterio pedido
  datos = d3.sort(datos, d=> sortBy == "date" ? d.fecha : d.lugar)
  // Lo anterior equivale a:
  // if (sortBy == "date")
  //   datos = d3.sort(datos, d=> d.fecha)
  // else
  //   datos = d3.sort(datos, d=> d.lugar)

    
  // Usamos una constante para determinar cuántos elementos
  // hay por fila en la visualización
  const N = 7

  // Creamos la visualización 2
  contenedorVis2
    .selectAll("g.glifo")
    // Usamos que el id de cada dato permita diferenciar entre cada dato
    // Solo nos quedaremos con los primeros 40 datos de la lista
    .data(datos.slice(0, 40), d => d.id)
    .join(
      enter => {
        // Creamos un <g> para dejar todos los elementos de la visualización
        // esto nos permite ordenar todos los elementos dentro del <g> con
        // los mismos valores para cada elemento, sin importar si pertenecen
        // a un <g> distinto
        const glifo = enter.append("g")
          .attr("class", "glifo")
          .style("opacity", 0)
          .attr("transform", (_, i) => {
            // Ubicamos cada elemento en forma de grilla
            // Definimos la posición en X usando el módulo
            let x = (i % N) * 150;
            // Definimos la posición en Y usando la división entera
            let y = Math.floor(i / N) * 150;
            // Retornamos el translate que traslada cada <g> a
            // la posición que le corresponda
            return `translate(${x + 30}, ${y + 100})`;
          })
        
        // Agregamos la transición del glifo
        // Notar que no lo podemos hacer antes, porque 
        // la constante "glifo" guardaría la transición en
        // vez del glifo
        glifo
          .transition("enter-glifo")
          .duration(500)
          .style("opacity", 1)

        // Esta es una forma de hacer tooltip
        glifo.append("title")
          .text(d=>`Fecha: ${d.fecha}\nPosición: ${d.lugar}°\nCategoria: ${d.categoria} estrella(s)\nPlataforma: ${d.plataforma}`)

        // Agregamos la parte superior del botón
        glifo
          .append("rect")
          .attr("class", "rect_superior")
          .attr("fill", d => escalaPosicion(d.lugar))
          .attr("y", -30)
          .attr("height", 70)
          .attr("width", 60)
          .attr("x", -30)
          // Le agregamos esquinas redondeadas
          .attr("rx", 15)
          .attr("ry", 15)
          
        glifo
          .append("rect")
          .attr("class", "rect_inferior1")
          .attr("fill", d => escalaCategoria(d.categoria))
          .attr("y", 20)
          .attr("height", 10)
          .attr("width", 80)
          .attr("x", -40)

        glifo
          .append("rect")
          .attr("class", "rect_inferior2")
          .attr("fill", d => escalaFecha(d.fecha))
          .attr("y", 30)
          .attr("height", 10)
          .attr("width", 80)
          .attr("x", -40)

        // Agregamos el texto
        glifo.append("text")
          .style("opacity", 0)
          // Definimos de donde parte el texto en Y
          .attr("dominant-baseline", "top")
          // Definimos de donde parte el texto en X
          .attr("text-anchor", "middle")
          // El texto es el id del dato
          .text(d => plataformaAString(d.plataforma))
          .style("fill", "white")
          .style("font-size", "30px")
          .attr("y", 5)
          .style("opacity", 0)
          .transition("enter_text")
          .duration(1000)
          .style("opacity", 1)

        // Eventos
        // mouseenter es lo que ocurre cuuando entra el mouse.
        // Al llamarlo desde el glifo, se activa por glifo.
        // el parámetro 'd' es el dato del glifo con el que se hizo
        // el mouseenter
        glifo
          .on("mouseenter", (_, d) => {
            // Usamos el contenedor de los glifos
            contenedorVis2
              // seleccionamos cada glifo
              .selectAll("g.glifo")
              // nos quedamos con el glifo al cual el mouse entró
              .filter(dato => dato.id == d.id)
              // Hacemos la transición para que se esconda el glifo
              .transition("escoder_glifo")
              .duration(300)
              .style("opacity", 0.1)
          })
          // Al salir del mouse, dejamos el glifo como estaba antes
          .on("mouseleave", (_, d) => {
            contenedorVis2
              .selectAll("g.glifo")
              .filter(dato => dato.id == d.id)
              .transition("aparecer_glifo")
              .duration(500)
              .style("opacity", 1)
          })
        return glifo
      },
      update => {
        // Movemos el glifo de forma animada
        update
          .transition(500)
          .attr("transform", (_, i) => {
          let x = (i % N) * 150;
          let y = Math.floor(i / N) * 150;
          return `translate(${x + 30}, ${y + 100})`;
        })
        return update
      },
      exit => {
        // Le cambiamos la clase para que luego el selectAll("g.glifo") no pesque estos 
        // G que deseamos eliminar
        exit.attr("class", "delete")

        // Hacemos una transición en el exit
        exit
          .transition("exit_glifo")
          .duration(500)
          .style("opacity", 0)
          .attr("transform", (_, i) => {
            let x = (i % N) * 150;
            let y = Math.floor(i / N) * 150;
            return `translate(${x + 30}, ${y + 100}) scale(5)`;
          })
        // Luego, eliminamos los elementos de la visualización  
        exit.transition("eliminar").delay(500).remove();

        // Finalmente retornamos exit
        return exit
      }
    )
}


function plataformaAString(plataforma){
  return plataforma == 'N64' ? "!" : (plataforma == 'VC'?"?":"&")
}


function parseoCaracteristicas(d) {
  return {
      "fecha": new Date(d.submitted_date),
      "lugar": +d.place,
      "id": d.id,
      "tiempo": +d.primary_time_seconds,
      "categoria": +d.category,
      "plataforma": d.platform
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
  const LINK = BASE_URL + "data.csv"
  // const LINK = "https://gist.githubusercontent.com/Hernan4444/d80ae2bfbb0eac5cf737dab6ce23ac57/raw/16712ed9132fc39ba57e95138e2ecfa3d9362748/caracteristics.csv"

  // Si usamos URL se requiere hacer "python3 -m http.server" o usar Live Server 
  // Podemos usar LINK para no necesitar Live Server
  d3.csv(LINK, parseoCaracteristicas).then(datos => {
    datosFinales = datos;
    joinDeDatos(datos);
  })
  // .catch(error => {
  //   console.log("UPS hubo un error: " + error)
  // })
}

runCode();
