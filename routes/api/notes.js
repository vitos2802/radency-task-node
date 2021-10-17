const express = require('express')
const router = express.Router()
const {
  getNoteById,
  listNotes,
  removeNote,
  updateNote,
  addNote,
  getNotesStats,
} = require('../../model/notes.js')
const { HttpCode } = require('../../helpers/constants')
const {
  validationCreatNote,
  validationUpdateNote,
  validationUpdateIsArchiveNote,
} = require('./validation/validationNotesRouter')

router.get('/', async (req, res, next) => {
  try {
    const notes = await listNotes()
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        notes,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.get('/stats', async (req, res, next) => {
  try {
    const stats = await getNotesStats()
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        stats,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:notetId', async (req, res, next) => {
  try {
    const note = await getNoteById(req.params.notetId)
    if (note) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          note,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', validationCreatNote, async (req, res, next) => {
  try {
    const note = await addNote(req.body)
    return res.status(201).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        note,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/:noteId', async (req, res, next) => {
  try {
    const note = await removeNote(req.params.noteId)
    if (note) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          message: 'note deleted',
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:noteId', validationUpdateNote, async (req, res, next) => {
  try {
    const note = await updateNote(req.params.noteId, req.body)
    if (note) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          note,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
})

router.patch(
  '/:noteId',
  validationUpdateIsArchiveNote,
  async (req, res, next) => {
    try {
      const note = await updateNote(req.params.noteId, req.body)
      if (note) {
        return res.json({
          status: 'success',
          code: HttpCode.OK,
          data: {
            note,
          },
        })
      } else {
        return res.status(404).json({
          status: 'error',
          code: HttpCode.NOT_FOUND,
          data: 'Not Found',
        })
      }
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
