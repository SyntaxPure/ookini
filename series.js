"use strict";

const seriesIniciales = [
  {id:1,titulo:"Breaking Bad",valoracion:10,genero:"Drama criminal"},
  {id:2,titulo:"Better Call Saul",valoracion:10,genero:"Drama criminal"},
  {id:3,titulo:"Malcolm in the Middle",valoracion:9,genero:"Comedia"},
  {id:4,titulo:"Game of Thrones",valoracion:9,genero:"Fantasía"},
  {id:5,titulo:"Dark",valoracion:9,genero:"Ciencia ficción"},
  {id:6,titulo:"Mr. Robot",valoracion:10,genero:"Thriller"},
  {id:7,titulo:"Avatar: La leyenda de Aang",valoracion:10,genero:"Animación"},
  {id:8,titulo:"Gravity Falls",valoracion:9,genero:"Animación"},
  {id:9,titulo:"Dexter",valoracion:8,genero:"Drama criminal"},
  {id:10,titulo:"Fullmetal Alchemist: Brotherhood",valoracion:10,genero:"Anime"},
  {id:11,titulo:"Attack on Titan",valoracion:10,genero:"Anime"},
  {id:12,titulo:"Invincible",valoracion:9,genero:"Animación"}
];
const CLAVE_STORAGE = "miArchivoDeSeries";
let series = cargarSeries();

const contenedor = document.getElementById("series-container");
const formulario = document.getElementById("form-serie");
const campoTitulo = document.getElementById("titulo");
const campoValoracion = document.getElementById("valoracion");
const campoGenero = document.getElementById("genero");
const campoBusqueda = document.getElementById("busqueda");
const filtroValoracion = document.getElementById("filtro-valoracion");
const selectorOrden = document.getElementById("orden");

function cargarSeries() {
  try {
    const guardadas = localStorage.getItem(CLAVE_STORAGE);
    if (guardadas !== null) {
      const datos = JSON.parse(guardadas);
      if (Array.isArray(datos)) return datos;
    }
  } catch (error) {
    console.warn("No se pudieron cargar los datos guardados.", error);
  }
  return seriesIniciales.map(serie => ({...serie}));
}

function guardarSeries() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(series));
  } catch (error) {
    console.warn("No se pudieron guardar los cambios.", error);
    alert("No se pudieron guardar los cambios en este navegador.");
  }
}

function validarSerie(titulo, valoracion) {
  if (titulo.trim() === "") {
    return "Escribe el título de la serie.";
  } else if (!Number.isFinite(valoracion) || valoracion < 0 || valoracion > 10) {
    return "La valoración debe estar entre 0 y 10.";
  } else {
    return "";
  }
}

function calcularPromedio(listaSeries) {
  if (listaSeries.length === 0) return 0;
  let suma = 0;
  for (const serie of listaSeries) suma += serie.valoracion;
  return suma / listaSeries.length;
}

function crearTarjeta(serie) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "card";
  const titulo = document.createElement("h3");
  titulo.textContent = serie.titulo;
  const genero = document.createElement("span");
  genero.className = "tag";
  genero.textContent = serie.genero || "Género no especificado";
  const valoracion = document.createElement("p");
  valoracion.className = "rating";
  valoracion.textContent = `⭐ ${serie.valoracion.toFixed(1)}/10`;
  const espacio = document.createElement("div");
  espacio.className = "spacer";
  const botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.className = "danger";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.setAttribute("aria-label", `Eliminar ${serie.titulo}`);
  botonEliminar.addEventListener("click", () => eliminarSerie(serie.id));
  tarjeta.append(titulo, genero, valoracion, espacio, botonEliminar);
  return tarjeta;
}

function renderizarSeries() {
  const texto = campoBusqueda.value.trim().toLocaleLowerCase("es");
  const minima = Number(filtroValoracion.value);
  let resultado = [];

  for (const serie of series) {
    const coincideTexto = serie.titulo.toLocaleLowerCase("es").includes(texto);
    const coincideValoracion = serie.valoracion >= minima;
    if (coincideTexto && coincideValoracion) resultado.push(serie);
  }

  if (selectorOrden.value === "rating-desc") {
    resultado.sort((a,b) => b.valoracion-a.valoracion || a.titulo.localeCompare(b.titulo,"es"));
  } else if (selectorOrden.value === "rating-asc") {
    resultado.sort((a,b) => a.valoracion-b.valoracion || a.titulo.localeCompare(b.titulo,"es"));
  } else if (selectorOrden.value === "title-asc") {
    resultado.sort((a,b) => a.titulo.localeCompare(b.titulo,"es"));
  } else if (selectorOrden.value === "title-desc") {
    resultado.sort((a,b) => b.titulo.localeCompare(a.titulo,"es"));
  }

  contenedor.replaceChildren();
  if (resultado.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "empty";
    mensaje.textContent = "No se encontraron series. Cambia la búsqueda o el filtro.";
    contenedor.appendChild(mensaje);
  } else {
    for (const serie of resultado) contenedor.appendChild(crearTarjeta(serie));
  }

  document.getElementById("resultado-count").textContent = `${resultado.length} de ${series.length} series`;
  document.getElementById("total-series").textContent = series.length;
  document.getElementById("promedio").textContent = `${calcularPromedio(series).toFixed(2)}/10`;
  const mejorValoracion = series.length ? Math.max(...series.map(serie => serie.valoracion)) : 0;
  const mejores = series.filter(serie => serie.valoracion === mejorValoracion);
  document.getElementById("mejor-serie").textContent = mejores.length ? mejores[0].titulo : "—";
}

formulario.addEventListener("submit", event => {
  event.preventDefault();
  const titulo = campoTitulo.value.trim();
  const valoracion = Number(campoValoracion.value);
  const genero = campoGenero.value.trim();
  const error = validarSerie(titulo, valoracion);
  if (error) {
    alert(error);
    return;
  }

  const duplicada = series.some(serie => serie.titulo.toLocaleLowerCase("es") === titulo.toLocaleLowerCase("es"));
  if (duplicada) {
    alert("Esa serie ya está en tu colección.");
    return;
  }

  series.push({id:Date.now(),titulo,valoracion,genero});
  guardarSeries();
  formulario.reset();
  renderizarSeries();
  campoTitulo.focus();
});

function eliminarSerie(id) {
  const serie = series.find(item => item.id === id);
  if (!serie) return;
  if (confirm(`¿Seguro que quieres eliminar "${serie.titulo}"?`)) {
    series = series.filter(item => item.id !== id);
    guardarSeries();
    renderizarSeries();
  }
}

campoBusqueda.addEventListener("input", renderizarSeries);
filtroValoracion.addEventListener("change", renderizarSeries);
selectorOrden.addEventListener("change", renderizarSeries);
document.getElementById("limpiar-filtros").addEventListener("click", () => {
  campoBusqueda.value = "";
  filtroValoracion.value = "0";
  selectorOrden.value = "rating-desc";
  renderizarSeries();
});

renderizarSeries();
