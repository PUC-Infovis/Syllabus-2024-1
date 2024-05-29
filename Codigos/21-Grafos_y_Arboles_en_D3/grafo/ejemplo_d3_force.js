const WIDTH = 600;
const HEIGHT = 600;


const SVG = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

const iniciarSimulacion = (nodos, enlaces) => {
  const FuerzaEnlace = d3.forceLink(enlaces)
    .id((d) => d.nombre) // Llave para conectar source-target con el nodo

  const simulacion = d3
    .forceSimulation(nodos)
    .force("enlaces", FuerzaEnlace)
    .force("centro", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
    .force("colision", d3.forceCollide(20))
    .force("carga", d3.forceManyBody().strength(20))


  const lineas = SVG
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(enlaces)
    .join("line")
    .attr("stroke-width", 2);

  const circulos = SVG
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodos)
    .join("circle")
    .attr("r", 10)
    .attr("fill", (d) => d.color);

  simulacion.on("tick", () => {
    // console.log({ ...nodos[0] });
    // console.log({ ...enlaces[0] });
    // console.log(simulacion.alpha(), simulacion.alpha() < simulacion.alphaMin());

    circulos
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);

    lineas
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  });

  d3.select("#restart").on("click", () => {
    simulacion.alpha(1.3).restart()
  })

  // Hacer click en un nodo hará que este deje de actualizar
  // su posición.
  d3.selectAll("circle").on("click", (event, data) => {
    // X puede quedar bloqueado y si ya lo está,
    // libero su bloqueo
    if (data.fx == null) {
      data.fx = data.x
    }
    else {
      data.fx = null
    }
    // Y siempre quedará bloqueado
    data.fy = data.y
  })
};

d3.json("ejemplo.json")
  .then((datos) => {
    const nodos = datos.nodos;
    const enlaces = datos.enlaces;
    iniciarSimulacion(nodos, enlaces);
  })
  .catch((error) => {
    console.log(error);
  });
