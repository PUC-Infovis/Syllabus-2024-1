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

const contenedor = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)
  .append("g")
  .attr("transform", `translate(${margin.top} ${margin.left})`);

const dibujarJerarquia = (raiz) => {
  const treemap = d3
    .treemap()
    .size([width, height])
    .padding(15);

  treemap(raiz);

  const color = d3.scaleSequential([8, 0], d3.interpolateMagma);

  contenedor
    .selectAll("rect")
    .data(raiz.descendants())
    .join("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => color(d.height))
    .attr("stroke", "black");
};


d3.json("jerarquia_anidada.json")
  .then((datos) => {
    const raiz = d3.hierarchy(datos, (d) => d.hijos);

    // A cada nodo se le asigna el atributo "value" 
    // con la cantidad de hijos totales
    raiz.count()

    // A cada nodo padre se le asigne el atributo value como
    // la suma del value de sus hijos. Es necesario definir
    // qué valor tomarán los nodos hijos donde no se puede aplicar
    // la recursión.

    // raiz.sum((d) => d.valor);

    console.log(raiz);
    dibujarJerarquia(raiz);
  })
  .catch((error) => {
    console.log(error);
  });
