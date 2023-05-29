const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const {authentication} = require('../middlewares/authentication')

const multer = require('multer')
const upload = multer({dest: 'uploads/'})

router.post('/newUser', UserController.newUser)
router.post('/login', UserController.login)
router.delete('/logout', authentication, UserController.logout)
router.get('/getUserLogin', authentication, UserController.getUserLogin)
router.get('/getUserByName/:name', UserController.getUserByName)
router.get('/getUserById/:_id', UserController.getUserById)
router.put('/updateUserid/:_id', authentication, upload.single('image'), UserController.updateUserImg)
router.get('/confirm/:emailToken', UserController.confirm )

module.exports = router
