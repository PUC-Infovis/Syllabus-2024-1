// Constantes
const HEIGHT = 200;
const WIDTH = 400;

// Crear un SVG, le agregamos borde para saber donde termina el SVG
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)
  .style("border", '1px solid')
  .style("margin", '10px 10px');

// Agregamos un círculo
const circle = svg
  .append("circle")
  .attr("r", 50)
  .attr("fill", "orange")
  .attr("stroke", "black")
  .attr("cx", 200)
  .attr("cy", 100);

// Función encargada de manejar el zoom.
// Recibe un evento transformador que indica 
// cuanto se desplaza el X, Y y la escala (K)
const manejadorZoom = (evento) => {
  const transformacion = evento.transform;
  // Solo agregando esta línea, se aplica una traslación y zoom.
  circle.attr("transform", transformacion);
};

// Creamos objeto zoom
// Definimos los rangos de escalas (máximo alejarse 0.5 y acercarse el doble)
// Los eventos de start y end las conectamos a funciones que imprimen en consola
// El evento principal (zoom) la conectamos con nuestra función que actualiza la vis.

// Panning. Definimos el tamaño de nuestra cámara (con extent)
// Definimos el cuadro máximo donde se puede mover nuestra cámara (con translateExtent)
// Recomendación: siempre dejar extent == translateExtent == tamaño svg
const zoom = d3.zoom()
  .scaleExtent([0.5, 2])
  .extent([[0, 0], [WIDTH, HEIGHT]])
  .translateExtent([[0, 0], [WIDTH, HEIGHT]])
  .on("start", () => console.log("empecé"))
  .on("zoom", manejadorZoom)
  .on("end", () => console.log("terminé"));

// Conectamos el objeto zoom con el SVG para que se encargue de definir
// todos los eventos necesarios para que funcione el zoom.
svg.call(zoom);
