const express = require('express') // Importa el módulo Express para crear un servidor web
const app = express() // Crea una instancia de Express
const cors = require('cors') // Importa el módulo CORS para permitir solicitudes desde diferentes orígenes

app.use(cors()) // Habilita CORS para todas las rutas

app.use(express.json()) // Middleware para parsear el cuerpo de las solicitudes como JSON

let notes = [ // Array de notas iniciales
  {
    id: 1,
    content: 'Esta es la nota 1',
    important: true
  },
  {
    id: 2,
    content: 'Esta es la nota 2',
    important: false
  },
  {
    id: 3,
    content: 'Esta es la nota 3',
    important: true
  }
]
// Middleware para parsear el cuerpo de las solicitudes como JSON
app.get('/', (request,response)=>{
    response.send('<h1>Hello World!</h1>') // Responde con un mensaje HTML cuando se accede a la raíz del servidor  
})

// Ruta para obtener todas las notas
app.get('/api/notes', (request, response) => {
  response.json(notes)  // Responde con el array de notas en formato JSON cuando se accede a /api/notes
})

// Ruta para obtener una nota específica por ID
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id) // Obtiene el ID de la nota desde los parámetros de la URL
   const note = notes.find(note => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id',(request, response) =>{
    const id = Number(request.params.id) // Obtiene el ID de la nota desde los parámetros de la URL
    notes = notes.filter(note => note.id !== id) // Filtra el array de notas para eliminar la nota con el ID especificado

    response.status(204).end() // Responde con un estado 204 No Content para indicar que la eliminación fue exitosa 
})

const generateId = () => { // Función para generar un nuevo ID único para una nota
     const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) // Encuentra el ID máximo actual en el array de notas
    :0 // Si no hay notas, el ID máximo es 0
    return maxId + 1 // Retorna el nuevo ID, que es el ID máximo actual más uno
}

app.post('/api/notes', (request, response) => { 
    const body = request.body // Obtiene el cuerpo de la solicitud, que contiene la nueva nota
    if(!body.content){ // Verifica si el contenido de la nota está presente
        return response.status(400).json({
            error: 'content missing' // Si no hay contenido, responde con un error 400 Bad Request y un mensaje de error
        })
    }

    const note = {
        content: body.content, // Contenido de la nueva nota
        important: Boolean(body.important)|| false, // Importancia de la nota, convertida a booleano
        id: generateId() // Genera un nuevo ID para la nota utilizando la función generateId
    }
     notes = notes.concat(note) // Agrega la nueva nota al array de notas existente

    console.log(note) // Imprime la nueva nota en la consola para depuración
    response.json(note) // Responde con la nueva nota en formato JSON
})

const PORT = process.env.PORT || 3001
app.listen(PORT) // Inicia el servidor y lo hace escuchar en el puerto definido
console.log(`Server running on port ${PORT}`) // Imprime un mensaje en la consola indicando que el servidor está corriendo  