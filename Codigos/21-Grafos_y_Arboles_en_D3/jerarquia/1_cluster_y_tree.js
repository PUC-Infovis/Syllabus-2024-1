const WIDTH = 600;
const HEIGHT = 400;

const margin = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50,
};

const width = WIDTH - margin.left - margin.right;
const height = HEIGHT - margin.top - margin.bottom;


const dibujarJerarquia = (datos, contenedor, metodo_jerarquico) => {

  // Por defecto generamos un tree
  let layout = d3.tree()
  if (metodo_jerarquico == "cluster") {
    // Si metodo_jerarquico es cluster, cambiamos nuestro layout por d3.cluster
    layout = d3.cluster()
  }

  // IMPORTANTE
  // Actualizamos el tamaño del layout para que posicione los nodos
  // y enlaces en ese rango de valores
  layout.size([width, height]);


  // Actualizamos los datos con nuestro layout para calcular los x,y de cada
  // nodo y enlace
  layout(datos);

  console.log(datos)
  // Cosntruirmos un objeto de D3 encargado de generar path para enlaces
  // así no tenemos que usar "line".
  const generadorDeEnlace = d3
    .linkVertical()
    .source((d) => d.source)
    .target((d) => d.target)
    .x((d) => d.x)
    .y((d) => d.y);



  // Agregamos cada path que representa un enlace
  contenedor
    .selectAll("path")
    .data(datos.links()) // links --> todos los enlaces
    .join("path")
    .attr("d", generadorDeEnlace)
    .attr("stroke", "magenta")
    .attr("fill", "none");

  // Agregamos cada círculo que representa un nodo
  contenedor
    .selectAll("circle")
    .data(datos.descendants()) // descendants --> todos los nodos
    .join("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", 5);

  // Agregamos un texto para el nombre del nodo
  contenedor
    .selectAll("text")
    .data(datos.descendants()) // descendants --> todos los nodos
    .join("text")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .text((d) => d.data.nombre)
    .attr("font-size", 12)
    .attr("dx", -15)
    .attr("dy", 4);
};

// Cargar datos
d3.csv("jerarquia_tabular.csv")
  .then((datos) => {
    // Definir nuestro procesador de datos
    const stratify = d3
      .stratify()
      .id((d) => d.nombre)
      .parentId((d) => d.padre);

    // Procesar los datos para la primera vis
    const raiz1 = stratify(datos);
    // Crear un SVG para el cluster
    const contenedorCluster = d3
      .select("#cluster-div")
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .append("g")
      .attr("transform", `translate(${margin.top} ${margin.left})`);

    // LLenar el SVG con el dibujo del árbol usando el layout cluster
    dibujarJerarquia(raiz1, contenedorCluster, "cluster");

    // Procesar los datos para la segunda vis
    const raiz2 = stratify(datos);

    // Crear un SVG para el tree
    const contenedorTree = d3
      .select("#tree-div")
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .append("g")
      .attr("transform", `translate(${margin.top} ${margin.left})`);
    // LLenar el SVG con el dibujo del árbol usando el layout tree
    dibujarJerarquia(raiz2, contenedorTree, "tree");
  })
  .catch((error) => {
    console.log(error);
  });
