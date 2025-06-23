import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  // Other fields in your schema
  numbers: [Number],
});

const MatchOrder = mongoose.model("MatchOrder", orderSchema);

export default MatchOrder;
