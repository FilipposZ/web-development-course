import React from 'react';
import Header from './Header';
import Note from './Note';
import Footer from './Footer';
import TakeNoteArea from './TakeNoteArea';
import defaultNotes from '../notes';

function App() {
  const [notes, setNotes] = React.useState([...defaultNotes]);

  function addNote(note) {
    setNotes([...notes, note]);
  }

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
