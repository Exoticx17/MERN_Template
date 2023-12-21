const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'),fileController.filePost)
router.get('/one/:name', fileController.fileGetOne)
router.get('/metadata/:name', fileController.fileGetMetadata)
router.get('/alljson', fileController.fileGetAllJSON)
router.get('/onejson/:id', fileController.fileGetOneJSON)
router.get('/type', fileController.fileGetType)
router.get('/search', fileController.fileGetSearch)
router.delete('/delete', fileController.fileDelete)


module.exports = router;