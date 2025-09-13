import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
const Review = mongoose.model("Review",reviewSchema)
export default Review