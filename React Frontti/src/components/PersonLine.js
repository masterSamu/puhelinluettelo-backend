import React from "react";

export default function PersonLine({ person, deletePerson }) {
  return (
    <div>
      <span>
        {person.name} {person.number}
      </span>
      <button onClick={() => deletePerson(person)}>Delete</button>
    </div>
  );
}
