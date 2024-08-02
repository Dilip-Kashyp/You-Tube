const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  subscriber: {
      type: Schema.Types.ObjectId, 
      ref: "User"
  },
  channel: {
      type: Schema.Types.ObjectId, 
      ref: "User"
  }
}, {timestamps: true})

module.exports = mongoose.model("Subscription", subscriptionSchema);
