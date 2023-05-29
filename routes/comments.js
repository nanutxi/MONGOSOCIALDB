const express = require('express')
const router = express.Router()
const CommentController = require('../controllers/CommentController')
const {authentication, isAuthorComment} = require('../middlewares/authentication')

const multer = require('multer')
const upload = multer({dest: 'uploads/'})

router.post('/newComment', authentication, CommentController.newComment)
router.put('/updateComment/:_id', authentication, isAuthorComment, CommentController.updateComment)
router.delete('/deleteComment/:_id', authentication, isAuthorComment, CommentController.deleteComment)
router.put('/likeComment/:_id', authentication, CommentController.likeComment)
router.delete('/removeLikeComment/:_id', authentication, CommentController.removeLikeComment)
router.get('/getAll', CommentController.getAll)
router.put('/updateCommentImg/:_id', authentication, upload.single('image'), CommentController.updateCommentImg )

module.exports = router