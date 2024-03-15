function crearCirculo(svgElement, x, y, r, clase){
    let circulo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circulo.setAttribute("cx", x);
    // COMPLETAR ACA LOS OTROS ATRIBUTOS DE UN CIRCULO

    svgElement.appendChild(circulo);
    return circulo;
}

function crearRectangulo(svgElement, x, y, ancho, alto, clase){
    let rectangulo = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    // COMPLETAR ACA LOS OTROS ATRIBUTOS DE UN RECTANGULO

    svgElement.appendChild(rectangulo);
    return rectangulo; 
}

function crearEllipse(svgElement, x, y, rx, ry, clase){
    let ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    // COMPLETAR ACA LOS OTROS ATRIBUTOS DE UNA ELIPSE

    svgElement.appendChild(ellipse);
    return ellipse;
}

function rotarElemento(element, grado, x, y) {
    // Construimos la cadena de transformación para rotar
    let transformValue = "rotate(" + grado + "," + x + "," + y + ")";
    // Establecemos el atributo 'transform' con la nueva transformación
    element.setAttribute("transform", transformValue);
}

function pochita(){
    let SVG = document.getElementById("pochita");
    SVG.setAttribute("width", "500");
    SVG.setAttribute("height", "500");
    // OCUPAR ACA LAS FUNCIONES ANTERIORES PARA CREAR CIRCULOS, RECTANGULOS Y ELIPSES



    
}

pochita()