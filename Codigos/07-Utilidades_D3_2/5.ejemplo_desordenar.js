
// Creamos un SVG en body junto con su tamaño ya definido.
const svg = d3.select("body")
  .append("svg")
  .attr("width", 500)
  .attr("height", 400)
  .style("border", "solid 1px");

const datos = [
  { id: "A", valor: 10 },
  { id: "B", valor: 60 },
  { id: "C", valor: 40 },
  { id: "D", valor: 3 },
  { id: "E", valor: 6 },
]

// Definiremos un color distinto por letra
const escalaColor = d3.scaleOrdinal(d3.schemeCategory10)
  .domain(datos.map(d => d.id))

// Extent develve [min, max]. 
// Haremos que el circulo más chico como mínimo tenga un radio de 10


const escalaRadio = d3.scaleSqrt()
  .domain(d3.extent(datos, d => d.valor))
  .range([10, 30])

svg.on("click", evento => {
  let datosDesordenados = datos.sort((a, b) => Math.random() - 0.5)
  joinDeDatos(datosDesordenados)
})

joinDeDatos(datos)

function joinDeDatos(datos) {
  svg.selectAll("g")
    // .data(datos) // Versión sin data join personalizado
    .data(datos, d => d.id) // Versión CON data join personalizado. 
    .join(
      enter => {
        const G = enter.append("g");

        G.append("circle")
          .attr("cx", 40)
          .attr("cy", 60)
          .attr("fill", d => escalaColor(d.id))
          .attr("r", d => escalaRadio(d.valor));

        // Agregar texto
        G.append("text")
          .attr("x", 40)
          .attr("y", 120)
          .attr("text-anchor", "middle")
          .text(d => d.id);

        G.attr("transform", (d, i) => {
          const x = i * 100;
          const y = 60;
          return `translate(${x}, ${y})`;
        })
        return G
      },
      update => {
        // update es cada G. Si el dato asignado al G 
        // cambia su ID o valor, actualizo mi color, radio y texto.
        update.select("circle")
          .transition("nueva_posicion")
          .duration(1000)
          .attr("fill", d => escalaColor(d.id))
          .attr("r", d => escalaRadio(d.valor));
        update.select("text").text(d => d.id);

        // update es cada G. Si el dato asignado al G
        // cambió su posición en la lista, actualizo mi traslación
        update.transition("nueva_posicion")
          .duration(1000)
          .attr("transform", (d, indice_dato) => {
            const x = indice_dato * 100;
            const y = 60;
            return `translate(${x}, ${y})`;
          })

        return update
      }
    )
}
