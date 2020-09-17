import React from 'react';
import Header from './Header';
import Note from './Note';
import Footer from './Footer';
import TakeNoteArea from './TakeNoteArea';
import defaultNotes from '../notes';

function App() {
  // The notes are considered a state so that the page is automatically re-rendered
  // whenever the user adds or deletes a note
  const [notes, setNotes] = React.useState([...defaultNotes]);

  // Adds a note to the list. The function is passed to the TakeNoteArea component
  // because the form to add a note is implemented there.
  function addNote(note) {
    setNotes([...notes, note]);
  }

  // Deletes the note with the specified id from the list. The function is passed
  // to each Note component so that the ID of the clicked note can be easily accessible.
  function deleteNote(noteId) {
    setNotes(notes.filter((note, indx) => {
      return indx !== noteId;
    }));
  }

  return (
    <div>
      <Header />
      <TakeNoteArea addNote={addNote}/>
      {notes.map((note, indx) =>
        <Note
          key={indx}
          id={indx}
          title={note.title}
          content={note.content}
          deleteNote={deleteNote}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
