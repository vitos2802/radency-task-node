const fs = require('fs/promises')
const path = require('path')

const { v4: uuidv4 } = require('uuid')
const { formatDate } = require('../helpers/date')

const notesPath = path.join('model', './notes.json')
const readNotes = () =>
  fs.readFile(notesPath).then((data) => JSON.parse(data.toString()))

const listNotes = async () => {
  return readNotes()
}

const getNotesStats = async () => {
  const notes = await readNotes()
  console.log(notes)
  const stats = notes.reduce((acc, obj) => {
    const newObj = {
      id: uuidv4(),
      icon: '',
      category: obj.category,
      active: 0,
      archived: 0,
    }

    obj.archived ? (newObj.archived += 1) : (newObj.active += 1)

    const filterAcc = acc.find((obj) => obj.category === newObj.category)

    if (filterAcc && filterAcc.category === obj.category) {
      obj.archived ? (filterAcc.archived += 1) : (filterAcc.active += 1)
    } else {
      acc.push(newObj)
    }

    return acc
  }, [])

  return stats
}

const getNoteById = async (noteId) => {
  const notes = await readNotes()
  const conditionId = Number(noteId) || noteId
  const findNote = notes.find((note) => note.id === conditionId)
  return findNote
}

const removeNote = async (noteId) => {
  const notes = await readNotes()
  const conditionId = Number(noteId) || noteId
  const note = notes.find((note) => note.id === conditionId)
  const filteredNotes = notes.filter((note) => note.id !== conditionId)
  if (!filteredNotes) {
    console.log('Contact is not found!')
    return false
  }
  await fs.writeFile(notesPath, JSON.stringify(filteredNotes))
  return note
}

const addNote = async (body) => {
  const id = uuidv4()
  const icon = ''
  const created = formatDate
  const dates = ''
  const archived = false
  const note = {
    id,
    icon,
    created,
    dates,
    archived,
    ...body,
  }
  const notes = await readNotes()
  notes.push(note)
  await fs.writeFile(notesPath, JSON.stringify(notes))
  return note
}

const updateNote = async (noteId, body) => {
  const notes = await readNotes()
  const conditionId = Number(noteId) || noteId
  const checkId = notes.find((note) => note.id === conditionId)

  const updatedNote = {
    ...checkId,
    ...body,
  }
  const updateList = notes.map((note) => {
    if (note.id === conditionId) {
      note = updatedNote
    }
    return note
  })

  await fs.writeFile(notesPath, JSON.stringify(updateList))
  return updatedNote.id ? updatedNote : null
}

module.exports = {
  listNotes,
  getNoteById,
  removeNote,
  addNote,
  updateNote,
  getNotesStats,
}
