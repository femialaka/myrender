import axios from "axios";
import { useState, useEffect } from "react";
import Persons from "./Persons";
import PersonForm from "./PersonForm";
import Filter from "./Filter";
import "./index.scss";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNameAdded, setNewNameAdded] = useState("");
  const [nameDeleted, setNameDeleted] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [personUpdate, setPersonUpdate] = useState(false);
  const [showNameAddedMessage, setShowNameAddedMessage] = useState(false);
  const [showNameDeletedMessage, setShowNameDeletedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const notifyPeriod = 5000

  //   console.log("PERSON: ", person.name)
  // })

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const deleteHandler = (person) => {
    event.preventDefault();

    let userResponse = confirm(`Delete ${person.name}?`);

    //console.log('DELETE RESPONSE', userResponse)

    if (userResponse) {
      personService
        .deletebyId(person.id)
        .then(notifyDeleted(person.name))
        .then(setPersonUpdate(true))
        .catch((error) => {
          console.log(`ERROR: ${error} STATUS: ${error.response.status}`);

          if (error.response.status === 404) {
            notifyDeleted("")
            notifyErrorMessage(
              `Information of ${person.name} has already been removed from the server`
            );
          } else {
            alert(`Unable to delete ID ${person.name}`);
          }
        });
    }
  };

  const addPerson = (event) => {
    event.preventDefault();

    let existingPerson = nameExists(newName);

    console.log("existingPerson", existingPerson[0]);

    if (existingPerson[0] !== undefined) {
      //alert(`${existingPerson[0].name} Already exists`)
      let changeNumber = confirm(
        `${existingPerson[0].name} already exists, replace the old number with a new one?`
      );
      if (changeNumber) {
        const updatedPerson = {
          name: existingPerson[0].name,
          number: newNumber,
        };
        personService
          .update(existingPerson[0].id, updatedPerson)
          .then(notifyAdded(newName))
          .then(setPersonUpdate(true))
          .catch((error) => {
            alert(`Unable to add ${newName}`);
          });
      }
    } else {
      const updatedPerson = { name: newName, number: newNumber };
      personService
        .create(updatedPerson)
        .then(notifyAdded(newName))
        .then(setPersonUpdate(true))
        .catch((error) => {
          alert(`Unable to add ${newName}`);
        });
    }
  };

  const nameExists = (nameToCheck) =>
    persons.filter(
      (person) =>
        person.name.toLowerCase() === nameToCheck.toLowerCase().trimEnd()
    );

  const notifyAdded = (name) => {
    console.log("Added ", name);
    setNewNameAdded(`Added ${name}`);
    setShowNameAddedMessage(true);
    setTimeout(() => {
      setNewNameAdded("");
      setShowNameAddedMessage(false);
    }, notifyPeriod);
  };

  const notifyDeleted = (name) => {
    if (name === "") {
      setNameDeleted("");
      setShowNameDeletedMessage(false);
    } else {
      console.log("Deleted ", name);
      setNameDeleted(`Deleted ${name}`);
      setShowNameDeletedMessage(true);
      setTimeout(() => {
        setNameDeleted("");
        setShowNameDeletedMessage(false);
      }, notifyPeriod);
    }
  };

  const notifyErrorMessage = (message) => {
    console.log("Message ", message);
    setErrorMessage(message);
    setShowErrorMessage(true);
    setTimeout(() => {
      setErrorMessage("");
      setShowErrorMessage(false);
    }, notifyPeriod);
  };

  useEffect(() => {
    personService.getAll().then((initialPeople) => {
      setPersons(initialPeople);
    });
  }, []);

  //Used to keep the Person database in sync
  useEffect(() => {
    setNewName("");
    setNewNumber("");
    personService.getAll().then((initialPeople) => {
      setPersons(initialPeople);
      setPersonUpdate(false);
    });
  }, [personUpdate]);

  return (
    <div>
      <h2>Phonebook</h2>
      {showNameAddedMessage && <div className="added">{newNameAdded}</div>}
      {showNameDeletedMessage && <div className="error">{nameDeleted}</div>}
      {showErrorMessage && <div className="error">{errorMessage}</div>}

      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      <Persons
        filtervalue={newFilter}
        persons={persons}
        deleteHandler={deleteHandler}
      />
    </div>
  );
};

export default App;
