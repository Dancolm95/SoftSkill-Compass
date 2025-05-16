import emociones from "../js/emociones.js";
import { obtenerTokenSpotify, buscarPlaylist } from "./spotify.js";

function mostrarHistorial() {
  const contenedor = document.getElementById("historial");
  const historial =
    JSON.parse(localStorage.getItem("historialEmociones")) || [];

  contenedor.innerHTML = "";

  if (historial.length === 0) {
    contenedor.innerHTML = "";
    return;
  }

  //tarjeta que contendra el historial
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta-historial");

  const titulo = document.createElement("h3");
  titulo.textContent = "🧠 Historial emocional";
  tarjeta.appendChild(titulo);

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

async function obtenerFrase() {
  const response = await fetch(
    "https://api.quotable.io/random?tags=inspirational"
  );
  const data = response.json();
  return data;
}
/* mostrar saludo si hay emocion guardada */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("resultado-box").classList.add("oculto");
  document.getElementById("resultado").innerHTML = "";
  mostrarHistorial();
  const emocionGuardada = localStorage.getItem("ultimaEmocion");
  console.log("Valor crudo drecuperado del localstorage: ", emocionGuardada)
  if (
    !emocionGuardada ||
    typeof emocionGuardada !== "string" ||
    emocionGuardada.trim() === ""
  ) {
    console.warn('⚠️ No se recuperó una emoción válida del localStorage');
    return;
  }
    const emocionData = emociones.find(
      emocion => emocion.nombre.toLocaleLowerCase() === emocionGuardada.toLocaleLowerCase()
    );

    if (!emocionData) {
      console.warn('❌ Emoción no encontrada para el ID (a pesar de ser string): ', emocionGuardada);
      return
    }
  
    const mensaje = document.createElement("div");
    mensaje.classList.add("mensaje-bienvenida");
    mensaje.innerText = `Hola de nuevo ¿Sigues sintiéndote "${emocionGuardada}"?`;
    document.body.prepend(mensaje);
    console.log("Valor recuperado del localStorage:", localStorage.getItem('ultimaEmocion'));
  }
);
/* logica principal al hacer click en una emocion */
document.querySelectorAll(".boton-emocion").forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    const emocionId = e.currentTarget.id;
    const emocionData = emociones.find(
      (emocion) => emocion.nombre.toLowerCase() === emocionId.toLowerCase()
    );
    if (!emocionData) {
      console.warn("Emocion no encontrada para el ID: ", emocionId);
      return;
    }
    localStorage.setItem("ultimaEmocion", emocionId);
    try {
      const token = await obtenerTokenSpotify();
      const playlist = await buscarPlaylist(emocionId, token);
      if (!emocionId) {
        throw new Error("Emocion no definida al buscar playlist");
      }
      const frase = await obtenerFrase();
      document.getElementById("resultado-box").classList.remove("oculto");

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
      guardarHistorial(emocionData, playlist, frase);
      mostrarHistorial();
    } catch (error) {
      console.error(error);
      document.getElementById("resultado").innerText =
        "Error al obtener recomendación. Intenta de nuevo.";
    }
    function guardarHistorial(emocionData, playlist, frase) {
      const historial =
        JSON.parse(localStorage.getItem("historialEmociones")) || [];

      historial.unshift({
        fecha: new Date().toISOString(),
        emocion: emocionData.nombre,
        playlist: playlist.name,
        frase: frase.content,
        autor: frase.author,
      });

      localStorage.setItem("historialEmociones", JSON.stringify(historial));
    }
  });
});
