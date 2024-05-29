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
  const pack = d3
    .pack()
    .size([width, height])
    .padding(5);

  pack(raiz);

  const color = d3.scaleSequential([8, 0], d3.interpolateMagma);

  contenedor
    .selectAll("circle")
    .data(raiz.descendants())
    .join("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r)
    .attr("fill", (d) => color(d.height))
    .attr("stroke", "black");
};

d3.json("jerarquia_anidada.json")
  .then((datos) => {
    const raiz = d3.hierarchy(datos, (d) => d.hijos);
    raiz.sum((d) => d.valor);
    console.log(raiz);

    dibujarJerarquia(raiz);
  })
  .catch((error) => {
    console.log(error);
  });
