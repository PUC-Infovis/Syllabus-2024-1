WIDTH = 800;
HEIGHT = 500;

margin = {
    top: 30,
    left: 30,
    right: 30,
    bottom: 30
};

HEIGHTVIS = HEIGHT - margin.top - margin.bottom;
WIDTHVIS = WIDTH - margin.left - margin.right;

HEIGHTLEYENDA = HEIGHTVIS - 80
WIDTHLEYENDA = 250

SVG = d3
    .select("#grafo")
    .attr("width", WIDTHVIS)
    .attr("height", HEIGHTVIS)

SVGLEYENDA = d3
    .select("#leyenda")
    .attr("width", WIDTHLEYENDA)
    .attr("height", HEIGHTLEYENDA)

function joinDeDatos(data) {
    const nodos = data.nodes;
    const enlaces = data.links;

    console.log(nodos);
    console.log(enlaces);

    const posX = WIDTHVIS / 6;
    const posY = HEIGHTVIS / 6;

    const grupos = [...new Set(nodos.map(nodo => nodo.group))]
    const escalaColores = d3.scaleOrdinal()
        .domain(grupos)
        .range(d3.schemePaired)

    const fuerzaEnlace = d3.forceLink(enlaces)
        .id(d => d.id)

    const simulacion = d3
        .forceSimulation(nodos)
        .force("enlaces", fuerzaEnlace)
        .force("x", d3.forceX(d => WIDTHVIS / (d.group + 1)))
        .force("y", d3.forceY(d => HEIGHTVIS / (d.group + 1)))
        .force("centro", d3.forceCenter(WIDTHVIS / 2, HEIGHTVIS / 2))
        .force("colision", d3.forceCollide(20))
        .force("carga", d3.forceManyBody().strength(20))

    const lineas = SVG
        .append("g")
        .selectAll("line")
        .data(enlaces)
        .join("line")
        .attr("stroke", "gray")
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", 2);

    const circulos = SVG
        .append("g")
        .selectAll("circle")
        .data(nodos)
        .join("circle")
        .attr("r", 10)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr("fill", d => escalaColores(d.group))
        .on("mouseover", (_, d) => cambiarInfo(d))
        .call(drag(simulacion));

    simulacion.on("tick", () => {
        circulos
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    
        lineas
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    });

    function drag(simulacion) {    
        function inicioDrag(evento) {
            if (evento.active === 0) {
                simulacion.alphaTarget(0.3).restart();
            }
            evento.subject.fx = evento.subject.x;
            evento.subject.fy = evento.subject.y;
        }
        
        function draggeando(evento) {
            evento.subject.fx = evento.x;
            evento.subject.fy = evento.y;
        }
        
        function finDrag(evento) {
            if (evento.active === 0) {
                simulacion.alphaTarget(0);
            }
            evento.subject.fx = null;
            evento.subject.fy = null;
        }
        
        return d3.drag()
            .on("start", inicioDrag)
            .on("drag", draggeando)
            .on("end", finDrag);
    }

    SVGLEYENDA
        .selectAll("rect")
        .data(escalaColores.range())
        .join("rect")
        .attr("x", WIDTHLEYENDA / 3)
        .attr("y", (d, i) => i * 25 + 50)
        .attr("height", 15)
        .attr("width", 10)
        .attr("fill", d => d)

    SVGLEYENDA
        .selectAll("text")
        .data(escalaColores.domain())
        .join("text")
        .attr("x", WIDTHLEYENDA / 2)
        .attr("y", (d, i) => i * 28 + 57.5)
        .text(d => "Grupo " + d)

    texto = SVGLEYENDA
        .append("text")
        .attr("id", "informacion")
        .attr("x", WIDTHLEYENDA / 2)
        .attr("text-anchor", "middle")
        .attr("y", 25)
        .text("Nodo actual:")

    function cambiarInfo(d) {
        texto.text(`Nodo actual: ${d.id}`)
    }

    SVGLEYENDA
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", HEIGHTLEYENDA)
        .attr("width", WIDTHLEYENDA)
        .attr("fill", "transparent")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
}

d3.json('miserables.json').then(data => 
    joinDeDatos(data)
)