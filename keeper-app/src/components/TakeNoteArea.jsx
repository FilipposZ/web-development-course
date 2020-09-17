import React from 'react';

/*
 * The TakeNoteArea controlled component implements the add note function.
 * The two inputs title and content are controlled via the note state.
 * When the user adds the note, the title and content are reset.
 */
function TakeNoteArea(props) {
  const [note, setNote] = React.useState({title: "", content: ""});

  function noteChange(e) {
    const {name, value} = e.target;
    setNote({...note, [name]: value});
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input onChange={noteChange} name='title' value={note.title} type='text' placeholder='Note Title' />
      <hr />
      <textarea onChange={noteChange} name='content' value={note.content} cols='30' rows='5'></textarea>
      <button
        onClick={() => {
          props.addNote(note);
          setNote({title: "", content: ""});
        }}>
        Add
      </button>
    </form>
  );
}

export default TakeNoteArea;
