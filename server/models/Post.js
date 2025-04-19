const mongoose= require('mongoose')

const postSchema =mongoose.Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    content:{
        type:String
    },
    
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }]
},
{ timestamps: true }
);

module.exports= mongoose.model('Post',postSchema);