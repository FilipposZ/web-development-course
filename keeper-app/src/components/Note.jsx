import React from 'react';

/*
 * The component that implements each note. It's props are
 * id - the unique identifier of the note
 * title, content - the title and content of the note
 * deleteNote() - the function to delete the note
 */
function Note(props) {
  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={() => props.deleteNote(props.id)}>DELETE</button>
    </div>
  );
}

export default Note;
