// Creamos constantes para esta visualización.
const WIDTH = 800;
const HEIGHT = 400;
const MARGIN = {
  top: 70,
  bottom: 30,
  right: 10,
  left: 50,
};

const HEIGHTVIS = HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

// Creamos un SVG en body junto con su tamaño ya definido.
const SVG = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)
  .style("border", "1px solid black") // Estilo adicional para ver el borde del SVG

// Creamos un contenedor específico para agregar la visualización.
// El resto del espacio lo usaremos para incluir los ejes.
const contenedor = SVG
  .append("g")
  .attr("transform", `translate(${MARGIN.left} ${MARGIN.top})`);


// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function joinDeDatos(datos) {

  // Obtenemos los rangos de los datos. En este caso solo necesitamos el máximo.
  // Multiplicamos el máximo por 1.1 para que el eje sea un poco más grande
  const maximaFrecuencia = 1.1 * d3.max(datos, (d) => d.frecuencia);
  

  // Definimos una escala lineal para determinar la altura.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre 0 y (HEIGHT - los margenes)
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaAltura = d3
    .scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([0, HEIGHTVIS]);

  // Definimos una escala lineal para determinar la posición en el eje Y.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre (HEIGHT - los margenes) y 0.
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaY = d3
    .scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([HEIGHTVIS, 0]);

  // Creamos un eje izquierdo con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeY = d3.axisLeft(escalaY);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeY a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  SVG
    .append("g")
    .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
    .call(ejeY);

  // Definimos una escala de datos categóricos para determinar la posición en el eje X.
  // Esta escala genera una banda por cada cateoría. 
  // Esta escala determinará la posición y ancho de cada banda en función del dominio y rango.
  // Mapea cada categoría a una banda específica.
  const escalaX = d3
    .scaleBand()
    .domain(datos.map((d) => d.categoria))
    .range([0, WIDTHVIS])
    .padding(0.1); // Un poco de espacio entre las barras

  // Creamos un eje inferior con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeX = d3.axisBottom(escalaX);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeX a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  SVG
    .append("g")
    .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top + HEIGHTVIS})`)
    .call(ejeX);

  // Vinculamos los datos con cada elemento rect con el comando data y join.
  // Personalizamos según la información de los datos.
  // Usamos nuestras escalas para determinar las posiciones y altura de las barras.
  contenedor
    .selectAll("rect")
    .data(datos)
    .join("rect")
    .attr("width", escalaX.bandwidth())
    .attr("fill", "orange")
    .attr("height", (d) => escalaAltura(d.frecuencia))
    .attr("x", (d) => escalaX(d.categoria))
    .attr("y", (d) => escalaY(d.frecuencia));

}

////////////////////////////////////////////
////                                    ////
////          CODIGO A EJECUTAR         ////
////                                    ////
////////////////////////////////////////////

const parseo = (d) => ({
  categoria: d.categoria,
  frecuencia: parseInt(d.frecuencia),
});


const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
const URL_FINAL = BASE_URL + "7f34b01b0dc34fbc6ad8dd1e686b6875/raw/dd40aa34b287ce6869ce9d495412df2514833b9e/letter.csv"
d3.csv(URL_FINAL, parseo)
  .then((datos) => {
    console.log(datos);
    joinDeDatos(datos);
  })
  .catch((error) => console.log(error));
