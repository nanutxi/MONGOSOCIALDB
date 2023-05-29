const Comment = require('../models/Comment')

const CommentController = {
    async newComment(req, res) {
        try {
            const comment = await Comment.create({...req.body, userId: req.user._id})
            res.status(200).send(comment)
        } catch (error) {
           console.error(error)
            res.status(500).send({message:'There is a problem'})
        }
    },
    async updateComment(req, res) {
        try {
          const comment = await Comment.findByIdAndUpdate(req.params._id, req.body, {new: true})
          res.send({message: 'comment succesfully updated', comment}) 
        } catch (error) {
          console.error(error)
          res.send({message: 'There is a problem'}, error)  
        }
    },
    async deleteComment(req, res) {
        try {
          const comment = await Comment.findByIdAndDelete(req.params._id)
          res.send({message: 'comment deleted'})
        } catch (error) {
         console.error(error)
         res.status(500).send({message: 'There is a problem'}) 
        }
    },
    async likeComment(req, res) {
      try {
        const comment = await Comment.findByIdAndUpdate(
          req.params._id, 
          {$push: {likes: req.user._id}},
          {new:true}
          )
          res.send(comment)
      } catch (error) {
        console.error(error)
        res.statuts(500).send({message: 'There is a problem with your like'})
      }
    },
    async removeLikeComment(req, res) {
      try {
        const comment = await Comment.findByIdAndUpdate(
          req.params._id,
          {$pull: {likes: req.user._id}},
          {new:true}
        )
        res.send(comment)
      } catch (error) {
        comnsole.error(error)
        res.status(500).send({message: 'There is a problem with your remove like'})
      }
    },
     async getAll(req, res) {
      try {
          const {page = 1, limit= 10} = req.query
         const comments = await Comment.find().populate({
          path:'postId',
          populate: {
              path:'userId'}
          })
         .limit(limit)
         .skip((page -1) * limit)
         res.send(comments) 
      } catch (error) {
         console.error(error) 
      }
  },
  async updateCommentImg(req, res) {
    try {
      const comment = await Comment.findByIdAndUpdate(req.params._id, {image: req.file.filename} ,{new: true})
      res.send({message: 'comment succesfully updated', comment}) 
    } catch (error) {
      console.error(error)
      res.send({message: 'There is a problem'}, error)  
    }
},
}

module.exports = CommentController