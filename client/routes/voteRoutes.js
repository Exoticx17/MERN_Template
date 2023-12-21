const express = require('express')
const voteController = require('../controllers/voteController')


const router = express.Router()

router.post('/', voteController.voteSheetPost)
router.patch('/voting', voteController.addVote)
router.patch('/discount', voteController.deleteVote)
router.get('/sheet', voteController.getVoteSheet)
router.get('/industry', voteController.getIndustryValueByName)
router.get('/average', voteController.getAvgVotesPerIndustry)
router.get('/median', voteController.getMedianVotesPerIndustry)
router.get('/range', voteController.getMinMaxVotesPerIndustry)
router.delete('/delete', voteController.deleteVoteSheetByName)

module.exports = router;