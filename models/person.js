const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: (value) => {
        return /\b\d{2,3}-\d{6,8}\b/.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
  id: Number,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
