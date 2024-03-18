const selection = d3.selectAll("div");

selection.append("h1")
    .style("color", "orange")
    .style("background-color", "magenta")
    .text("uwu");

selection.append("h1").text("uwucito");

// Prueben descomentando cada caso para ver qué ocurre :D
// // Caso 1
// d3.selectAll("div")
//     .selectAll("h1")
//     .text((d, i) => i) // ¿qué ocurre al ejecutar esto?

// // Caso 2
// d3.selectAll("h1")
//     .text((d, i) => i) // ¿qué ocurre al ejecutar esto?

// // Caso 3
// d3.selectAll("div")
//     .select("h1")
//     .text((d, i) => i) // ¿qué ocurre al ejecutar esto?