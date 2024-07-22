const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BranchSchema = new Schema({
  branch_name: {
    type: String,
    required: true,
    unique: true,
  },
  shop_id: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  day_number: {
    type: Number,
    required: true,
  },
  opening_time: {
    type: String,
    required: true,
  },
  closing_time: {
    type: String,
    required: true,
  },
  shift_status: {
    type: Boolean,
    default: false,
  },
});

const Branch = mongoose.model("Branch", BranchSchema);
module.exports = Branch;