const express = require('express')
const ideaController = require('../controllers/ideaController')

const router = express.Router()

router.post('/', ideaController.ideaPost)
router.get('/', ideaController.getIdeas)
router.get('/one', ideaController.getIdeaOne)
router.get('/itags', ideaController.getIdeaItags)
router.get('/search', ideaController.searchIdeasByTitle)
router.patch('/edit', ideaController.ideaEdit)
router.delete('/delete', ideaController.ideaDelete)

module.exports = router;