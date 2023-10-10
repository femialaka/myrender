const PersonForm = (props) => {

    const {
      newName,
      handleNameChange,
      newNumber,
      handleNumberChange,
      addPerson,
    } = props
 
  //console.log('PersonForm Props: ', props)
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number:
          <input type="tel" value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
}

export default PersonForm