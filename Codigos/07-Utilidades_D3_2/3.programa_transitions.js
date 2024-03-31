// Creamos constantes para esta visualización.
const WIDTH = 1000;
const HEIGHT = 400;
const MARGIN = {
  top: 70,
  bottom: 70,
  right: 30,
  left: 70,
};

const HEIGHTVIS = HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

// Creamos un SVG en body junto con su tamaño ya definido.
const svg = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)
  .style("border", "solid 1px");

// Creamos un boton y un párrafo en el body.
const boton = d3.select("body").append("button").text("Agregar elemento");
const parrafo = d3.select("body").append("p");
const parrafo2 = d3.select("body").append("p");

// Creamos un contenedor específico para cada eje y la visualización.
const contenedorEjeY = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

const contenedorEjeX = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${HEIGHTVIS + MARGIN.top})`)

const contenedorVis = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)


// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function joinDeDatos(datos) {

  const maximaFrecuencia = d3.max(datos, (d) => d.frecuencia);

  // Definimos una escala lineal para determinar la altura.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre 0 y (HEIGHT - los margenes)
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaAltura = d3.scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([0, HEIGHTVIS]);

  // Definimos una escala lineal para determinar la posición en el eje Y.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre (HEIGHT - los margenes) y 0.
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaY = d3.scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([HEIGHTVIS, 0]);

  // Creamos un eje izquierdo con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeY = d3.axisLeft(escalaY);

  // Agregamos al SVG el eje.
  contenedorEjeY.call(ejeY)

  // Definimos una escala de datos categóricos para determinar la posición en el eje X.
  // Esta escala genera una banda por cada cateoría. 
  // Esta escala determinará la posición y ancho de cada banda en función del dominio y rango.
  // Mapea cada categoría a una banda específica.
  const escalaX = d3.scaleBand()
    .domain(datos.map((d) => d.categoria))
    .rangeRound([0, WIDTHVIS])
    .padding(0.5);

  // Creamos un eje inferior con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeX = d3.axisBottom(escalaX);

  // Agregamos al SVG el eje.
  // Luego personalizamos el texto de dicho eje.
  contenedorEjeX
    .call(ejeX)
    .selectAll("text")
    .attr("font-size", 20);

  // Vinculamos los datos con cada elemento rect con el comando join.
  // Usamos el enter para personalizar nuestros rect cuando se crean.
  // Los creamos con largo 0 pero ya posicionados donde corresponde.
  const rectangulos = contenedorVis
    .selectAll("rect")
    .data(datos)
    .join(enter => {
      // Defino estado inicial de los rectangulos
      const rect = enter
        .append("rect")
        .attr("fill", "orange")
        .attr("width", escalaX.bandwidth())
        .attr("height", 0)
        .attr("y", HEIGHTVIS)
        .attr("x", (d) => escalaX(d.categoria))

      return rect
    }

    )

  ////////////////////////////////////////////
  ////      Inicio Nuevo Codigo           ////
  ////////////////////////////////////////////
  // Personalizamos según la información de los datos.
  // Usamos nuestras escalas para actualizar sus posiciones y altura de
  // las barras que ya estaban creadas y las nuevas.
  rectangulos.transition("update")
    .duration(5000)
    .attr("width", escalaX.bandwidth())
    .attr("height", (d) => escalaAltura(d.frecuencia))
    .attr("x", (d) => escalaX(d.categoria))
    .attr("y", (d) => escalaY(d.frecuencia))
  ////////////////////////////////////////////
  ////        Fin Nuevo Codigo            ////
  ////////////////////////////////////////////

  // Definimos eventos. En particular:
  // (1) [mouseenter] Pasar el mouse sobre una barra
  // (2) [mouseleave] Sacar el mouse de una barra
  // (3) [click] Click en una barra
  rectangulos.on("mouseenter", (evento, dato_evento) => {
    // Seleccionar elemento visual y cambiar su color
    d3.select(evento.currentTarget).attr("fill", "magenta");
  })
    .on("mouseleave", (evento, d) => {
      // Devolver color original a todas
      rectangulos.attr("fill", "orange");
    })
    .on("click", (evento, dato_evento) => {
      // Cambiar texto
      let t = `Categoría: ${dato_evento.categoria}, Frecuencia: ${dato_evento.frecuencia}`;
      parrafo.text(t);
      // Cambiar color según una condición
      rectangulos.attr("fill", data => {
        if (data.categoria == dato_evento.categoria) {
          return "red";
        }
        return "blue";
      })
    });
  // Cuando hacemos click en el SVG
  svg.on("click", (evento, dato_evento) => {
    console.log(evento)
    const pos = d3.pointer(evento);
    let t = `Posición dentro del SVG(${pos[0]},${pos[1]})`
    t += ` - Posición en el HTML(${evento.pageX},${evento.pageY})`
    parrafo2.text(t)

  })
}

// Lista global para guardar todos los datos.
let datosFinales = [
  { categoria: "A", frecuencia: Math.floor(Math.random() * 800) }
];

// Función encargada de crear un nuevo dato.
// Revisa la última categoría de la lista y utiliza la siguiente letra
// para definir la nueva categoría.
const datoNuevoRandom = (datos) => {
  return {
    categoria: String.fromCharCode(
      datos[datos.length - 1].categoria.charCodeAt(0) + 1
    ),
    frecuencia: Math.floor(Math.random() * 800)
  }
};

// Vinculamos el click del boton con una función encargada de
// generar un nuevo dato, agregarlo a la lista global y de llamar
// a la función joinDeDatos para actualizar la visualización.
boton.on("click", () => {
  const nuevoValor = datoNuevoRandom(datosFinales)
  datosFinales.push(nuevoValor);
  joinDeDatos(datosFinales);
});
joinDeDatos(datosFinales);