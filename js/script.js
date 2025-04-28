// const respuesta = document.querySelectorAll('.emocion')
// const emociones = {
//   feliz: "¡Qué alegría! 😊",
//   triste: "Estoy contigo 💙",
//   molesto: "Respirá hondo, todo pasa 🧘",
//   ansioso: "Tomá un minuto, estás a salvo ⏳"
// }

  const emociones = [
    {
      nombre: "Feliz",
      frase: "¡Qué alegría! 😊",
      imagen: "feliz.jpeg"
    },

    {
      nombre: "Triste",
      frase: "Estoy contigo 💙",
      imagen: "triste.jpeg"
    },

    {
      nombre: "Ansioso",
      frase: "Respira, todo está bien ⏳",
      imagen: "ansioso.jpeg"
    },

    {
      nombre: "Molesto",
      frase: "Respira hondo, todo pasa 🧘",
      imagen: "molesto.jpeg"
    }
  ]

  const botones = document.querySelectorAll('.boton-emocion')
  botones.forEach(e => {
    e.addEventListener('click', (event) => {
     const emocionClickeada = event.target.id
      const busqueda= emociones.find(emocion => emocion.nombre.toLocaleLowerCase() === emocionClickeada.toLocaleLowerCase())
      console.log(busqueda)

      const miArticle = document.createElement('article')
      miArticle.classList.add('tarjetas-generadas');
      const tituloEmocion = document.createElement('h2')
      tituloEmocion.innerText = busqueda.nombre;

      const parrafoEmocion = document.createElement('p')
      parrafoEmocion.innerText = busqueda.frase

      const imagenEmocion = document.createElement('img')
      imagenEmocion.src = `assets/img/${busqueda.imagen}`
      console.log(busqueda.imagen)

      miArticle.appendChild(tituloEmocion)
      miArticle.appendChild(parrafoEmocion)
      miArticle.appendChild(imagenEmocion)

      const contenedor = document.getElementById('contenedor-tarjetas')
      if (contenedor.firstChild) {
        contenedor.firstChild.remove()
      }
      contenedor.appendChild(miArticle)

      setTimeout(()=> {
        miArticle.remove();
      }, 5000)
    })
  })

  // respuesta.forEach( boton => {
  //   boton.addEventListener('click', (event) => {
  //     alert(emociones[event.target.id]);
  //   })
  // });