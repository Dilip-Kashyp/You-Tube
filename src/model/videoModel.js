const mongoose = require('mongoose');
const mongooseaggregate = require('npm i mongoose-aggregate-paginate-v2');
const videoSchema = mongoose.Schema({
    video : {
        type : String,
        required : true,
    },
    thembnail : {
        type : String,
        required : true,
    },
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    duration : {
        type : Number,
        required : true,
    }, 
    view : {
        type : Number,
        default : 0
    },
    isPublised : {
        type : Boolean,
        default : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
    
},{
    timestamps : true,
});




module.exports = mongoose.model("Video", videoSchema);