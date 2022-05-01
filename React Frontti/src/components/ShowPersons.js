import React from "react";
import PersonLine from "./PersonLine";

export default function ShowPersons({ persons, deletePerson }) {
  return (
    <>
      {persons.map((person) => {
        return (
          <PersonLine
            key={person.name}
            person={person}
            deletePerson={deletePerson}
          />
        );
      })}
    </>
  );
}
