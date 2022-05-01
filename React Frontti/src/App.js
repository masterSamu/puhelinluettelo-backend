import { useState, useEffect } from "react";
import personService from "./services/persons";
import AddPerson from "./components/AddPerson";
import ShowPersons from "./components/ShowPersons";
import FilterPersons from "./components/FilterPersons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    type: null,
  });
  let personsToShow = [];

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const deletePerson = (person) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${person.name}`
    );
    if (confirmDelete) {
      personService
        .deleteItem(person.id)
        .then(() => {
          setNotificationMessage({
            message: `Deleted ${person.name}`,
            type: "success",
          });
          setTimeout(() => {
            setNotificationMessage({ message: null, type: null });
          }, 3000);
          setPersons(persons.filter((item) => item.id !== person.id));
        })
        .catch((error) => {
          setNotificationMessage({
            message: `Information of '${person.name}' was already removed from server`,
            type: "error",
          });
          setTimeout(() => {
            setNotificationMessage({ message: null, type: null });
          }, 5000);
          setPersons(persons.filter((item) => item.id !== person.id));
        });
    }
  };

  if (filterValue.length > 0) {
    personsToShow = persons.filter(
      (person) =>
        person.name.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
    );
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {notificationMessage && (
        <Notification
          message={notificationMessage.message}
          type={notificationMessage.type}
        />
      )}

      <FilterPersons setFilterValue={setFilterValue} />
      <h2>Add new</h2>
      <AddPerson
        persons={persons}
        setPersons={setPersons}
        personsToShow={personsToShow}
        setNotificationMessage={setNotificationMessage}
      />
      <h2>Numbers</h2>
      {filterValue.length > 0 ? (
        <ShowPersons persons={personsToShow} deletePerson={deletePerson} />
      ) : (
        <ShowPersons persons={persons} deletePerson={deletePerson} />
      )}
    </div>
  );
};

export default App;
