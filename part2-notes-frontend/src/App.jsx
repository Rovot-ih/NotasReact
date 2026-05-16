// Importaciones necesarias de React
import { useState, useEffect } from 'react'
// Importación del componente Note
import Note from './components/Note'
import axios, { Axios } from 'axios'
import noteService from './services/notes'
import ErrorAlert from './components/errorAlert'

// Definición del componente principal App
const App = () => {
  // Estados del componente
  const [notes, setNotes] = useState([]) // Array para almacenar las notas
  const [newNote, setNewNote] = useState('a new note...') // Texto para la nueva nota
  const [showAll, setShowAll] = useState(true) // Booleano para mostrar todas las notas o solo importantes
  const [errorMessage, setErrorMessage] = useState("Mensaje de error...")
 
  const hook = () => {
    console.log('effect') // Solo para ver en consola que se ejecutó el efecto
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }

  useEffect(hook, []) // Se ejecuta una vez al cargar el componente

  // Función para agregar una nueva nota
  const addNote = (event) => {
    event.preventDefault() // Previene el comportamiento por defecto del formulario
    const noteObject = {
      content: newNote, // Contenido de la nota
      important: Math.random() > 0.5, // Importancia aleatoria (true o false)
      //id: String(notes.length + 1), // ID único basado en la longitud del array
    }

    // 
    noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote)) // Agrega la nueva nota al array de notas
      setNewNote('') // Limpia el campo de entrada después de agregar la nota
    } )

    // setNotes(notes.concat(noteObject)) // Agrega la nueva nota al array
    // setNewNote('') // Limpia el campo de entrada
  }

  // Función para manejar el cambio en el input de nueva nota
  const handleNoteChange = (event) => {
    console.log(event.target.value) // Imprime el valor en consola para depuración
    setNewNote(event.target.value) // Actualiza el estado con el nuevo valor
  }

  // El componente guarda en notesToShow las notas que se van a mostrar. Estas notas cambian dependiendo del estado del componente.
  const notesToShow = showAll
    ? notes // Si showAll es true, muestra todas las notas
    : notes.filter(note => note.important) // Si no, filtra solo las importantes

  // Función para alternar la importancia de una nota 
const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }
  noteService
    .update(id, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
   setErrorMessage(`Note '${note.content}' was already removed from server`)// Si ocurre un error, muestra un mensaje de error indicando que la nota ya fue eliminada del servidor
      setTimeout(() => {setErrorMessage(null)}, 5000) // Limpia el mensaje de error después de 5 segundos\
      setNotes(notes.filter(n => n.id !== id)) // Elimina la nota del estado local si ya no existe en el servidor
    })
}


  // Renderizado del componente
  return (
    <div>
      <h1>Notes</h1> {/* Título de la aplicación */}
      <ErrorAlert message={errorMessage} /> {/* Componente para mostrar mensajes de error */} 

      <div>
        <button onClick={() => setShowAll(!showAll)}> {/* Botón para alternar entre mostrar todas o importantes */}
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {/* Lista de notas a mostrar, mapeando cada nota a un componente Note */}
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} 
          toggleImportance={() => toggleImportanceOf(note.id)} />
        ))}
      </ul>
      <form onSubmit={addNote}> {/* Formulario para agregar nuevas notas */}
        <input value={newNote} onChange={handleNoteChange} /> {/* Input controlado por el estado newNote */}
        <button type="submit">save</button> {/* Botón para enviar el formulario */}
      </form>
    </div>
  )
}

// Exportación del componente para usarlo en otros archivos
export default App
