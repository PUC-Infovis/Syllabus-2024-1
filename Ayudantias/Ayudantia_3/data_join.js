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

function joinDeDatos(datos){
  console.log(datos)
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
