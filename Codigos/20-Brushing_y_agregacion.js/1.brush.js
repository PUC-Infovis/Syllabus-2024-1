////////////////////////////////////////////////////
// Definir constantes
////////////////////////////////////////////////////
const WIDTH = 600;
const HEIGHT = 400;
const margin = {
  top: 30,
  bottom: 30,
  right: 30,
  left: 30,
};

const WIDTHVIS = WIDTH - margin.right - margin.left
const HEIGHTVIS = HEIGHT - margin.top - margin.bottom

////////////////////////////////////////////////////
// Generar datos aleatorios
////////////////////////////////////////////////////
const datos = d3
  .range(500)
  .map(() => (
    {
      x: Math.random() * 400 + 20,
      y: Math.random() * 50 + 10
    }));


////////////////////////////////////////////////////
// Obtener min y max para cada eje (X e Y)
////////////////////////////////////////////////////

// Restamos 50 para tener un valor un poco más pequeño que el mínimo
const minValueY = d3.min(datos, (d) => d.y) - 50
const minValueX = d3.min(datos, (d) => d.x) - 50

// Sumamos 30 para para tener un valor un poco más grande que el máximo
const maxValueY = d3.max(datos, (d) => d.y) + 30
const maxValueX = d3.max(datos, (d) => d.x) + 30

////////////////////////////////////////////////////
// Crear SVG y sus escalas
////////////////////////////////////////////////////

// Crear SVG
const SVG = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Crear escala en EJE X y EJE Y
const escalaY = d3
  .scaleLinear()
  .domain([minValueY, maxValueY])
  .range([HEIGHTVIS, 0]);

const escalaX = d3
  .scaleLinear()
  .domain([minValueX, maxValueX])
  .range([0, WIDTHVIS]);

// Crear objetos Eje que usan las escalas definidas anteriormente
const ejeY = d3.axisLeft(escalaY);
const ejeX = d3.axisBottom(escalaX);


// Al SVG le agregamos nuestras escalas 
SVG
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .call(ejeY);

SVG
  .append("g")
  .attr("transform", `translate(${margin.left}, ${HEIGHTVIS + margin.bottom})`)
  .call(ejeX);


////////////////////////////////////////////////////
// Crear visualización
////////////////////////////////////////////////////

const contenedorPuntos = SVG
  .append("g")
  .attr("transform", `translate(${margin.left} ${margin.top})`);

const puntos = contenedorPuntos
  .selectAll("circle")
  .data(datos)
  .join("circle")
  .attr("fill", "gray")
  .attr("r", 2)
  .attr("opacity", 0.2)
  .attr("cx", (d) => escalaX(d.x))
  .attr("cy", (d) => escalaY(d.y));


////////////////////////////////////////////////////
// Brush
////////////////////////////////////////////////////

// Contenedor de nuestro brush. 
// Este tiene que estar posicionado en el mismo lugar que nuestro
// contendeorPuntos
const contenedorBrush = SVG
  .append("g")
  .attr("transform", `translate(${margin.left} ${margin.top})`);

// Función que detecta el blush y hará lo que nosotros querramos
const brushed = (evento) => {
  const seleccion = evento.selection;

  // Seleccion nos dice la posición del cuadro del brush
  console.log(seleccion)
  // ES una matriz de la forma
  // [
  //  [esquina_superior_izquierda_X, esquina_superior_izquierda_Y],
  //  [esquina_inferior_derecha_X, esquina_inferior_derecha_Y],
  // ]

  const xMin = escalaX.invert(seleccion[0][0]);
  const yMax = escalaY.invert(seleccion[0][1]);

  const xMax = escalaX.invert(seleccion[1][0]);
  const yMin = escalaY.invert(seleccion[1][1]);

  console.log([[xMin, yMin], [xMax, yMax]])


  const filtro = (d) =>
    xMin <= d.x && d.x <= xMax &&
    yMin <= d.y && d.y <= yMax;

  puntos
    .attr("fill", (d) => (filtro(d) ? "orange" : "gray"))
    .attr("opacity", (d) => (filtro(d) ? 1 : 0.2))
    .attr("r", (d) => (filtro(d) ? 5 : 3));

  // Extra. Obtenemos los datos filtrados e indicamos cuantos son
  actualizarOtroElemento(datos.filter(filtro));
};

////////////////////////////////////////////////////
// Extra, crear un div con un texto que actualizaremos
////////////////////////////////////////////////////

let texto = d3.select("body").append("div")

function actualizarOtroElemento(datos_filtrados) {
  texto.text(`Se han seleccionado ${datos_filtrados.length} datos`);
}

// Crear nuestro objeto brush
const brush = d3.brush()
  // Definir la extensión donde se puede mover el brush
  .extent([
    [0, 0],
    [WIDTHVIS, HEIGHTVIS],
  ])
  // Conectar el evento brush con nuestra función
  .on("brush", brushed);

// Definir posibles filtros para cuando activar el evento brush o no
brush.filter((event) => {
  console.log(event)

  // Detectar si oprimió ctrl
  const ctrlKeyEvent = event.ctrlKey;

  // Detectar qué boton del mouse oprimió 
  // (0 click izquierdo, 2 derecho)
  const buttonEvent = event.button;

  // Detectar el tipo de brush. En la visualización o en el cuadro de selección
  const typeEvent = event.target.__data__.type

  console.log({
    ctrlKey: ctrlKeyEvent,
    button: buttonEvent,
    type: typeEvent,
  });

  return (
    !event.ctrlKey &&
    !event.button &&
    typeEvent !== "overlay"
  );
})

// Llenar nuestro contenedorBrush con los elementos
// necesarios para que funcione nuestro brush
contenedorBrush.call(brush)

// Activar el brush de antemano en alguna zona
contenedorBrush.call(brush.move, [
  [100, 100],
  [200, 200],
]);

// Aplicar cambios al rect que representa el cuadro de selección
contenedorBrush.select(".selection").attr("fill", "orange");

// Aplicar cambios al rect que representa toda la zona de brush
contenedorBrush.select(".overlay").style("cursor", "default");

// Aplicar cambios a los rect de las orillas del cuadro de selección
// que permiten cambiar su tamaño. en este caso, eliminar esos
// rect para que no se pueda cambiar el tamaño
contenedorBrush.selectAll(".handle").remove();
