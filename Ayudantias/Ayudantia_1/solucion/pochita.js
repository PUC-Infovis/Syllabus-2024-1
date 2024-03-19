function crearCirculo(svgElement, x, y, r, clase){
    let circulo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circulo.setAttribute("cx", x);
    circulo.setAttribute("cy", y);
    circulo.setAttribute("r", r);
    circulo.setAttribute("class", clase);
    svgElement.appendChild(circulo);
    return circulo;
}

function crearRectangulo(svgElement, x, y, ancho, alto, clase){
    let rectangulo = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rectangulo.setAttribute("x", x);
    rectangulo.setAttribute("y", y);
    rectangulo.setAttribute("width", ancho);
    rectangulo.setAttribute("height", alto);
    rectangulo.setAttribute("class", clase);
    svgElement.appendChild(rectangulo);
    return rectangulo; 
}

function crearEllipse(svgElement, x, y, rx, ry, clase){
    let ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    ellipse.setAttribute("cx", x);
    ellipse.setAttribute("cy", y);
    ellipse.setAttribute("rx", rx);
    ellipse.setAttribute("ry", ry);
    ellipse.setAttribute("class", clase);
    svgElement.appendChild(ellipse);
    return ellipse;
}

function rotarElemento(element, grado, x, y) {
    // Construimos la cadena de transformación
    let transformValue = "rotate(" + grado + "," + x + "," + y + ")";
    // Establecemos el atributo 'transform' con la nueva transformación
    element.setAttribute("transform", transformValue);
}

function pochita(){
    let SVG = document.getElementById("pochita");
    SVG.setAttribute("width", "500");
    SVG.setAttribute("height", "500");

    // CUERPO
    crearCirculo(SVG, 300, 300, 150, "orange");
    crearRectangulo(SVG, 150, 300, 300, 400, "orange");

    // SIERRA
    // manilla sierra
    crearCirculo(SVG, 410, 225, 30, "black");
    crearRectangulo(SVG, 380, 130, 60, 100, "black");
    crearRectangulo(SVG, 220, 100, 220, 40, "black");
    // dientes sierra
    crearRectangulo(SVG, 230, 115, 25, 25, "dientes-sierra");
    crearRectangulo(SVG, 175, 60, 25, 25, "dientes-sierra");
    crearRectangulo(SVG, 75, 55, 25, 25, "dientes-sierra");
    crearRectangulo(SVG, 90, 140, 25, 25, "dientes-sierra");
    crearRectangulo(SVG, 140, 190, 25, 25, "dientes-sierra");
    // cuerpo sierra
    crearCirculo(SVG, 135, 100, 60, "cuerpo-sierra");
    let sierra = crearRectangulo(SVG, 100, 150, 120, 150, "cuerpo-sierra");
    rotarElemento(sierra, -45, 100, 150);
    crearCirculo(SVG, 137, 102, 55, "grey");
    crearEllipse(SVG, 285, 225, 90, 75, "orange");

    // BOCA
    crearEllipse(SVG, 225, 350, 40, 80, "red");
    // dientes
    let colmilloIzquierdo = crearRectangulo(SVG, 175, 345, 20, 20, "white");
    rotarElemento(colmilloIzquierdo, -45, 175, 345);
    let colmilloDerecho = crearRectangulo(SVG, 235, 345, 20, 20, "white");
    rotarElemento(colmilloDerecho, -45, 235, 345);
    // Labio izquierdo
    crearCirculo(SVG, 185, 300, 50, "black");
    crearCirculo(SVG, 185, 295, 50, "orange");
    // Labio derecho
    crearCirculo(SVG, 250, 300, 50, "black");
    crearCirculo(SVG, 250, 295, 50, "orange");

    // OJOS
    crearCirculo(SVG, 325, 255, 45, "white");
    crearCirculo(SVG, 320, 250, 40, "black");
}

pochita()