const LINK = "https://gist.githubusercontent.com/Hernan4444/d50f10a188b144360b77ca7f0ed0fa49/raw/b907326fce33434b2e765fba4a57e323d1d7df23/iris.json"

d3.select("body").append("h3").text("Revisar la consola")

d3.json(LINK).then((data) => {
  console.log("DATA");
  console.log(data);
  console.log("\n");

  ////////////////////////////////////////////////////
  // Uso de d3.mean
  ////////////////////////////////////////////////////
  const promedios = {
    sepalLength: d3.mean(data, (d) => d.sepalLength),
    sepalWidth: d3.mean(data, (d) => d.sepalWidth),
    petalLength: d3.mean(data, (d) => d.petalLength),
    petalWidth: d3.mean(data, (d) => d.petalWidth),
  };
  console.log("Promedios");
  console.log(promedios);
  console.log("\n");

  ////////////////////////////////////////////////////
  // Uso de d3.groups
  ////////////////////////////////////////////////////
  const agrupadosPorEspecie = d3.groups(data, (d) => d.species)
  console.log("Agrupados por especie");
  console.log(agrupadosPorEspecie);
  console.log("\n");

  ////////////////////////////////////////////////////
  // Uso de d3.rollups
  ////////////////////////////////////////////////////
  const contadorPorEspecie = d3.rollups(data,
    (grupoDeDatos) => grupoDeDatos.length, // A cada grupo (lista) le sacamos el largo
    (dato) => dato.species // Agrupamos por especie
  )
  console.log("Contador por Especie");
  console.log(contadorPorEspecie);
  console.log("\n");

  ////////////////////////////////////////////////////
  // Uso de d3.rollups y d3.mean
  ////////////////////////////////////////////////////
  const promediosPorEspecie = d3.rollups(data,
    (grupo) => ({ // Para cada grupo (lista) generamos un diccionario con datos promedios
      sepalLength: d3.mean(grupo, (d) => d.sepalLength),
      sepalWidth: d3.mean(grupo, (d) => d.sepalWidth),
      petalLength: d3.mean(grupo, (d) => d.petalLength),
      petalWidth: d3.mean(grupo, (d) => d.petalWidth),
    }),
    (dato) => dato.species // Agrupamos por especie
  )
  console.log("Promedio por Especie");
  console.log(promediosPorEspecie);
  console.log("\n");

  ////////////////////////////////////////////////////
  // Uso de d3.bin
  ////////////////////////////////////////////////////
  const binSepalLength = d3.bin()
    .thresholds(40) // Valor para intentar generar dicha cantidad de bins
    .value((d) => d.sepalLength);
  console.log("Bins");
  console.log(binSepalLength(data));
  console.log("\n");

  ////////////////////////////////////////////////////
  // Uso de d3.hexbin
  ////////////////////////////////////////////////////
  const hexbin = d3
    .hexbin()
    .radius(0.3)
    .x((d) => d.sepalLength)
    .y((d) => d.sepalWidth);

  const hexagonos = hexbin(data);
  console.log("Hexbins");
  console.log(hexagonos);

  // Forma del hexagono
  console.log(hexbin.hexagon());
});
