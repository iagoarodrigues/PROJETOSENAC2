// Buscar elemento pai
var elemento_pai = document.body;

// Criar elemento
var titulo = document.createElement('h1');

// Criar o nó de texto
var texto = document.createTextNode("Doces");

// Anexar o nó de texto ao elemento h1
titulo.appendChild(texto);

// Agora sim, inserir (anexar) o elemento filho (titulo) ao elemento pai (body)
elemento_pai.appendChild(titulo);