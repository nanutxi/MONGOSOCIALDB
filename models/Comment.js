const mongoose = require('mongoose')
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema =  new mongoose.Schema({
    comment: String,
    postId: {
        type: ObjectId,
        ref: 'Post'
    },
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    likes: [{type: ObjectId}],
    image:String
}, {timestamps: true})

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment