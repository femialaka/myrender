const Filter = ({newFilter, handleFilterChange }) => {
  //console.log("FILTER: ", newFilter)
  return (
    <div>
      filter shown with{" "}
      <input value={newFilter} onChange={handleFilterChange} />
    </div>
  )
}

export default Filter;
