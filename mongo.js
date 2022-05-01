const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://FullStack-Samu:${password}@fullstackcluster.6uj5k.mongodb.net/puhelinluetteloApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
});

const Person = mongoose.model("Person", personSchema);
const savePerson = () => {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    id: new Date(),
  });
  person.save().then((result) => {
    console.log("Person saved!");
    console.log(`Added ${result.name} ${result.number} to phonebook`);
    mongoose.connection.close();
  });
};

const findPerson = () => {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
};

if (process.argv.length === 3) {
  findPerson();
}
if (process.argv.length > 3) {
  savePerson();
}
