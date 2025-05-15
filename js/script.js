// const respuesta = document.querySelectorAll('.emocion')
// const emociones = {
//   feliz: "¡Qué alegría! 😊",
//   triste: "Estoy contigo 💙",
//   molesto: "Respirá hondo, todo pasa 🧘",
//   ansioso: "Tomá un minuto, estás a salvo ⏳"
// }
// const emociones = [
//   {
//     nombre: "Feliz",
//     frase: "¡Qué alegría! 😊",
//     imagen: "feliz.jpeg"
//   },

//   {
//     nombre: "Triste",
//     frase: "Estoy contigo 💙",
//     imagen: "triste.jpeg"
//   },

//   {
//     nombre: "Ansioso",
//     frase: "Respira, todo está bien ⏳",
//     imagen: "ansioso.jpeg"
//   },

//   {
//     nombre: "Molesto",
//     frase: "Respira hondo, todo pasa 🧘",
//     imagen: "molesto.jpeg"
//   }
// ]

// const botones = document.querySelectorAll('.boton-emocion')
// botones.forEach(e => {
//   e.addEventListener('click', (event) => {
//    const emocionClickeada = event.target.id
//     const busqueda= emociones.find(emocion => emocion.nombre.toLocaleLowerCase() === emocionClickeada.toLocaleLowerCase())

//     const miArticle = document.createElement('article')
//     miArticle.classList.add('tarjetas-generadas');
//     const tituloEmocion = document.createElement('h2')
//     tituloEmocion.innerText = busqueda.nombre;

//     const parrafoEmocion = document.createElement('p')
//     parrafoEmocion.innerText = busqueda.frase

//     const imagenEmocion = document.createElement('img')
//     imagenEmocion.src = `assets/img/${busqueda.imagen}`

//     miArticle.appendChild(tituloEmocion)
//     miArticle.appendChild(parrafoEmocion)
//     miArticle.appendChild(imagenEmocion)

//     const contenedor = document.getElementById('contenedor-tarjetas')
//     if (contenedor.firstChild) {
//       contenedor.firstChild.remove()
//     }
//     contenedor.appendChild(miArticle)

//     setTimeout(()=> {
//       miArticle.remove();
//     }, 5000)
//   })
// })

import emociones from "../js/emociones.js";
import { obtenerTokenSpotify, buscarPlaylist } from "./spotify.js";

async function obtenerFrase() {
  const response = await fetch(
    "https://api.quotable.io/random?tags=inspirational"
  );
  const data = response.json();
  return data;
}
/* mostrar saludo si hay emocion guardada */
window.addEventListener("DOMContentLoaded", () => {
  mostrarHistorial();
  const emocionGuardada = localStorage.getItem("ultimaEmocion");
  if (emocionGuardada) {
    const mensaje = document.createElement("div");
    mensaje.classList.add("mensaje-bienvenida");
    mensaje.innerText = `Hola de nuevo ¿Sigues sintiendote "${emocionGuardada}"?`;
    document.body.prepend(mensaje);
  }
  console.log("Valor recuperado del localStorage:", emocionGuardada);
});
/* logica principal al hacer click en una emocion */
document.querySelectorAll(".emocion").forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    const emocionId = e.currentTarget.id;
    const keyword = emociones[emocionId];
    localStorage.setItem("ultimaEmocion", emocionId);
    try {
      const token = await obtenerTokenSpotify();
      const playlist = await buscarPlaylist(keyword, token);
      const frase = await obtenerFrase();

      document.getElementById("resultado").innerHTML = `
          <p class="titulo-emocion">Estado emocional: <strong>${emocionId}</strong></p>
          <p>Te recomendamos esta playlist:</p>
          <div style="display: flex; align-items: center; gap: 20px;">
          <img src="${
            playlist.images?.[0]?.url ||
            "https://via.placeholder.com/150?text=Sin+imagen"
          }" width="150" style="border-radius: 8px;">

          </div>
          <p><strong>${playlist.name}</strong></p>
          <p>Creada por: <em>${playlist.owner.display_name}</em></p>
          <a href="${playlist.external_urls.spotify}" target="_blank">${
        playlist.name
      }</a><br>
        `;
      guardarHistorial(emocionId, playlist, frase);
      mostrarHistorial();
    } catch (error) {
      console.error(error);
      document.getElementById("resultado").innerText =
        "Error al obtener recomendación. Intenta de nuevo.";
    }
    function guardarHistorial(emocionId, playlist, frase) {
      const historial =
        JSON.parse(localStorage.getItem("historialEmociones")) || [];

      historial.unshift({
        fecha: new Date().toISOString(),
        emocion: emocionId,
        playlist: playlist.name,
        frase: frase.content,
        autor: frase.author,
      });

      localStorage.setItem("historialEmociones", JSON.stringify(historial));
    }

    function mostrarHistorial() {
      const contenedor = document.getElementById("historial");
      const historial =
        JSON.parse(localStorage.getItem("historialEmociones")) || [];

      contenedor.innerHTML = "<h3>🧠 Historial emocional</h3>";

      historial.slice(0, 5).forEach((item) => {
        contenedor.innerHTML += `
      <div class="historial-item">
        <p><strong>${item.emocion}</strong> – ${new Date(
          item.fecha
        ).toLocaleString()}</p>
        <p>🎵 ${item.playlist}</p>
        <p>💬 "${item.frase}" — <em>${item.autor}</em></p>
        <hr>
      </div>
    `;
      });
    }
  });
});
