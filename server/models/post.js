import mongoose from 'mongoose'

const PostSchema=mongoose.Schema({
    topic:{type:String,required:"post must have topic"},
    body:{type:String},
    image:{type:String},
    date:{type:Date,default:Date.now},
    uplike:{type:[String],default:[]},
    downlike:{type:[String],default:[]},
    postedby:[{
        username:String,
        useremail:String,
        userId:String,
    }]

})

export default mongoose.model("Post",PostSchema);