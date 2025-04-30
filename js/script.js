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

document.querySelectorAll(".emocion").forEach((boton) => {
  boton.addEventListener("click", async () => {
    const emocionId = boton.id;
    const keyword = emociones[emocionId];

    try {
      const token = await obtenerTokenSpotify();
      const playlist = await buscarPlaylist(keyword, token);

      document.getElementById("resultado").innerHTML = `
          <p>Estado emocional: <strong>${emocionId}</strong></p>
          <p>Te recomendamos esta playlist:</p>
          <div style="display: flex; allign-items: center; gap: 20px;">
          <img src="${playlist.images?.[0]?.url || 'https://via.placeholder.com/150?text=Sin+imagen'}" width="150" style="border-radius: 8px;">

          </div>
          <p><strong>${playlist.name}</strong></p>
          <p>Creada por: <em>${playlist.owner.display_name}</em></p>
          <a href="${playlist.external_urls.spotify}" target="_blank">${playlist.name}</a><br>
        `;
    } catch (error) {
      console.error(error);
      document.getElementById("resultado").innerText =
        "Error al obtener recomendación. Intenta de nuevo.";
    }
  });
});

const emocionSeleccionada = document.querySelectorAll(".emociones");
emocionSeleccionada.forEach((boton) => {
  boton.addEventListener("click", (evento) => {
    const idEmocion = evento.target.id;
    console.log("emocion seleccionada", idEmocion);
  });
});
