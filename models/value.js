const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const valueSchema=new Schema({
    bmi:{
        type:Number,
        default:0
    },
    steps:{
        type:Number,
        default:0
    },
    calories:{
        type:Number,
        default:0
    },
    workout:{
        type:String,
        default:""
    },
    owner:{
        type:Schema.Types.ObjectId,
            ref:"User"
    },
    water:{
        type:Number,
        default:0
    },
    sleep:{
        type:Number,
        default:0
    }
});

module.exports=mongoose.model("Value",valueSchema);