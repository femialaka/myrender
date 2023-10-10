const Persons = ({ persons, filtervalue, deleteHandler }) => {
  //const { persons, filtervalue, deleteHandler } = props
  //console.log('FILTER: ', filtervalue)
  return (
    <div>
      {persons.map(
        (person) =>
          person.name.toLowerCase().match(filtervalue.toLowerCase()) && (
            <div key={person.id}>
              {person.name} &nbsp; {person.number} &nbsp;
              <button
                onClick={() => deleteHandler(person)}
                style={{ background: "red", color: "white" }}>
                delete
              </button>
              <p></p>
            </div>
          )
      )}
    </div>
  )
  }

  export default Persons