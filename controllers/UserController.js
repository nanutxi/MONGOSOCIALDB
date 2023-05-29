const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const transporter = require('../config/nodemailer')

require('dotenv').config()

const UserController = {
    async newUser(req, res, next) {
        try {
          req.body['password'] = req.body?.password ? bcrypt.hashSync(req.body.password, 10)  : null
         const user = await User.create({...req.body, confirmed:false})
         const emailToken = jwt.sign({email:req.body.email},process.env.JWT_SECRET,{expiresIn:'48h'})
         const url = 'http://localhost:3000/users/confirm/'+ emailToken
         transporter.sendMail({
            to: req.body.email,
            subjet: 'confirm your register',
            html: `<h3>Welcome, We have sent an email to confirm the registration </h3>
            <a href="${url}"> Click here to confirm your registration </a>
            `,
      
          })
         res.status(201).send({ message: '"We have sent an email to confirm the registration"', user}) 
        } catch (error) {
          error.origin = 'user'
          next(error)
         }
    },
    async login(req, res) {
       try {
        const user = await User.findOne({
            email: req.body.email,
            // password: req.body.password
        })
        if(!user) {
          return res.status(400).send({message: 'email or password incorrect'})
        }
        if(!user.confirmed) {
          return res.status(400).send({ message: 'you must confirm your email'})
        }
        const isMatch = bcrypt.compareSync(req.body.password, user.password )
        if(!isMatch) {
          return res.status(400).send({message: 'email or password incorrect'})
        }
        const token = jwt.sign({_id: user._id, password: user.password}, process.env.JWT_SECRET) 
        if(user.tokens.legth > 4) user.tokens.shift()
        user.tokens.push(token)
        await user.save()
        res.send({ message: 'Welcome ' + user.name, token, user})
       } catch (error) {
        console.error(error)
       }
    },
    async logout(req, res) {
        try {
          await User.findByIdAndUpdate(req.user._id, {
            $pull: {tokens: req.headers.authorization}
          })
          res.send({message: 'disconnected succesfully'})
        } catch (error) {
          res.status(500).send({message: 'There is a problem with logout'}) 
        }
    },
    async getUserLogin(req, res) {
      try {
        const userLogin = req.user._id
        const user = await User.find(userLogin)
        if(!user) {
          return res.status(404).send({message: 'user not found'})
        }
        res.send(user)
      } catch (error) {
        console.error(error)
      }
    },
    async getUserByName(req, res) {
      try {
        const user = await User.find({
          $text: {
            $search: req.params.name
          }
        })
        res.send(user)
      } catch (error) {
        console.error(error)       
      }
    },
    async getUserById(req, res) {
      try {
        const user = await User.findById(req.params._id)
        res.send(user)
      } catch (error) {
       console.error(error) 
      }
    },
    async updateUserImg(req, res) {
      try {
        const user = await User.findByIdAndUpdate(req.params._id, {image: req.file.filename} ,{new: true})
        res.send({message: 'user succesfully updated', user}) 
      } catch (error) {
        console.error(error)
        res.send({message: 'There is a problem'}, error)  
      }
  },
  async confirm(req,res){
    try {
      const token = req.params.emailToken
    const payload = jwt.verify(token, process.env.JWT_SECRET)
      await User.findOne({email: payload.email}, {confirmed:true})
      res.status(201).send( "user confirmed successfully" );
    } catch (error) {
      console.error(error)
    }
  },

    
}

module.exports = UserController