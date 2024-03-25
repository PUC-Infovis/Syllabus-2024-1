// Encontrar el SVG según su ID
const SVG = d3.select("#vis");

// Datos a visualizar
const DATOS = [
  { nombre: "Alex", nota_promedio: 52, desviacion: 3 },
  { nombre: "Fran", nota_promedio: 60, desviacion: 9 },
  { nombre: "Luis", nota_promedio: 40, desviacion: 16 },
  { nombre: "Pepe", nota_promedio: 90, desviacion: 10 }
]

// Crear una función que genera un data join entre los datos y G
// Dentro de cada G pondremos los elementos que correspondan
function datajoin(filtrar_datos) {
  let datos = DATOS;

  // Si filtrar_datos es true, filtramos el dataset
  if (filtrar_datos) {
    datos = datos.filter(d => d.nota_promedio > 50);
  }

  // Agregar un G para cada dato. Este será nuestro contenedor.
  // Buscaremos por una clase "casita" en vez de por un tag
  const nuestroG = SVG.selectAll(".casita")
    .data(datos)
    .join(
      enter => {
        // Agregar un G con clase "casita" para cada dato.
        // IMPORTANTE: siempre lo agregado al enter debe ser lo buscado
        // En este caso, buscamos por ".casita" así que el elemento de
        // "append" debe tener la clase "casita"
        const CASITA = enter.append("g").attr("class", "casita")

        // Agregar rect para mostrar el promedio de nota
        // Le daremos una clase específica porque agregaremos más
        // de un "rect" dentro de nuestro G
        CASITA.append("rect")
          .attr("class", "bar")
          .attr("height", 20)
          .attr("x", 0)
          .attr("y", 0)
          .attr("fill", "orange")
          .attr("width", d => d.nota_promedio);

        // Agregar text para mostrar el nombre de la persona
        CASITA.append("text")
          .attr("x", 0)
          .attr("y", 0)
          .text(d => d.nombre)

        // Agregar rect para la desvicación de las notas
        // Le daremos una clase específica porque agregaremos más
        // de un "rect" dentro de nuestro G
        CASITA.append("rect")
          .attr("class", "desv")
          .attr("height", 2)
          .attr("x", d => d.nota_promedio - d.desviacion)
          .attr("fill", "red")
          .attr("width", d => 2 * d.desviacion)
          .attr("y", 10)

        // Retornamos lo creado a "enter". En este caso "G"
        return CASITA
      },
      update => {
        // Update será lo que buscamos en el "selectAll". En este
        // caso será cada elemento de clase "grupo", que corresponde
        // a cada G.

        // Vamos a actualizar los elementos dentro del G
        // Así que usamos select para buscar el elemento a editar

        // Actualizamos la barra
        update.select(".bar")
          .attr("width", d => d.nota_promedio);

        // Actualizamos el texto
        update.select("text").text(d => d.nombre);

        // Actualizamos la barra de desviación
        update.select(".desv")
          .attr("x", d => d.nota_promedio - d.desviacion)
          .attr("width", d => 2 * d.desviacion);

        // Retornamos update
        return update
      },
      exit => {
        // Opcional: Buscar cada elemento y eliminarlo
        // Spoiler: cuando veamos transiciones será util hacer esto
        exit.selectAll(".bar").remove();
        exit.selectAll("text").remove()
        exit.selectAll(".desv").remove()

        // Eliminamos el G
        exit.remove()
        // Retornamos exit
        return exit
      }
    )
  // Finalmente trasladamos nuestra "casita", es decir, cada G.
  // Todos sus hijos tambien se van a trasladar junto al "G"
  nuestroG.attr("transform", (dato, i) => `translate(0, ${i * 40 + 40})`);
}

document.querySelector("#button1").addEventListener("click", () => {
  datajoin(false)
})
document.querySelector("#button2").addEventListener("click", () => {
  datajoin(true)
})
document.querySelector("#button3").addEventListener("click", () => {
  d3.selectAll("g").remove()
})