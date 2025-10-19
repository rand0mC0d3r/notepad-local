import { useNotes } from '../hooks/useNotes';
import './Sidebar.css';

const Sidebar = () => {
  const { notes, activeNoteId, setActiveNoteId, createNote, deleteNote, isSidebarOpen } = useNotes();

  const handleDeleteNote = (e, noteId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
    }
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>Notes</h2>
        <button className="btn-new" onClick={createNote} title="Create new note">
          +
        </button>
      </div>
      <div className="notes-list">
        {notes.map(note => (
          <div
            key={note.id}
            className={`note-item ${note.id === activeNoteId ? 'active' : ''}`}
            onClick={() => setActiveNoteId(note.id)}
          >
            <div className="note-item-content">
              <div className="note-title">{note.title || 'Untitled'}</div>
              <div className="note-date">
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <button
              className="btn-delete"
              onClick={(e) => handleDeleteNote(e, note.id)}
              title="Delete note"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
