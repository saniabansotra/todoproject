import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, 
  },
});


const todoModel = mongoose.models.Todo || mongoose.model("Todo", Schema);

export default todoModel;