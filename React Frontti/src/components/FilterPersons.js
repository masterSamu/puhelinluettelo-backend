import React from "react";

export default function FilterPersons({ setFilterValue }) {
  const handleChange = (event) => setFilterValue(event.target.value);

  return (
    <div>
      filter shown with <input onChange={handleChange} />
    </div>
  );
}
