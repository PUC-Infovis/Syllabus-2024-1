// Creamos un SVG en body
const SVG = d3.select("body").append("svg");

// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function joinDeDatos(datos) {
  // Datos es una lista de objetos

  // Definimos el ancho y largo del SVG.
  SVG.attr("width", 50 + datos.length * 100).attr("height", 500);

  // Vinculamos los datos con cada elemento rect con el comando data y join
  // Personalizamos según la información de los datos.
  SVG
    .selectAll("rect")
    .data(datos)
    .join("rect")
    .attr("fill", "orange")
    .attr("width", 40)
    .attr("height", (d, i) => {
      console.log("Hola, estoy ejecutando esta función")
      console.log("Dato: ", d)
      console.log("Indice: ", i)
      return d.frecuencia
    })
    .attr("x", (d, i) => 50 + (i * 100));

}


////////////////////////////////////////////
////                                    ////
////          CODIGO A EJECUTAR         ////
////                                    ////
////////////////////////////////////////////

// Creamos una función que parsea los datos del csv al formato deseado.
const parseo = (d) => ({
  categoria: d.categoria,
  frecuencia: parseInt(d.frecuencia),
});


// Esta función es equivalente a la anterior
function parseoV2(d) {

  return {
    categoria: d.categoria,
    frecuencia: parseInt(d.frecuencia)
  }
}


function runCode(option) {
  if (option == 1) {
    // Opción 1: Cargamos el CSV y le indicamos que ocupe la función
    // parseo para procesar cada línea.
    // No olviden levantar un servidor con live-server en VSCode
    d3.csv("datos_mate.csv", parseoV2)
      .then((datos) => {
        // Usamos .then para acceder a los datos ya cargados
        // y actualizamos el svg.
        console.log(datos);
        joinDeDatos(datos);
      })
      .catch((error) => console.log(error));
  }

  else if (option == 2) {
    // opción 2: Cargamos el CSV de internet.
    // Esta opción no requiere de servidor.
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    const URL_FINAL = BASE_URL + "7f34b01b0dc34fbc6ad8dd1e686b6875/raw/dd40aa34b287ce6869ce9d495412df2514833b9e/letter.csv"
    d3.csv(URL_FINAL, parseoV2)
      .then((datos) => {
        console.log(datos);
        joinDeDatos(datos);
      })
      .catch((error) => console.log(error));
  }
}

const OPTION = 1;
runCode(OPTION);