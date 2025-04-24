const respuesta = document.querySelectorAll('.emocion')
const emociones = {
  feliz: "¡Qué alegría! 😊",
  triste: "Estoy contigo 💙",
  molesto: "Respirá hondo, todo pasa 🧘",
  ansioso: "Tomá un minuto, estás a salvo ⏳"
}
  respuesta.forEach( boton => {
    boton.addEventListener('click', (event) => {
      alert(emociones[event.target.id]);
    })
  });