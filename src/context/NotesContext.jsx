/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notepad-notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) {
        setActiveNoteId(parsedNotes[0].id);
      }
    } else {
      // Create a default note if none exist
      const defaultNote = {
        id: uuidv4(),
        title: 'Welcome',
        content: '# Welcome to Notepad Local\n\nStart writing your notes here!',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([defaultNote]);
      setActiveNoteId(defaultNote.id);
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notepad-notes', JSON.stringify(notes));
    }
  }, [notes]);

  const createNote = () => {
    const newNote = {
      id: uuidv4(),
      title: 'Untitled',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
    return newNote;
  };

  const updateNote = (id, updates) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (id) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    setNotes(filteredNotes);
    
    // If we deleted the active note, select another one
    if (id === activeNoteId) {
      if (filteredNotes.length > 0) {
        setActiveNoteId(filteredNotes[0].id);
      } else {
        setActiveNoteId(null);
      }
    }
  };

  const getActiveNote = () => {
    return notes.find(note => note.id === activeNoteId);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        activeNoteId,
        setActiveNoteId,
        createNote,
        updateNote,
        deleteNote,
        getActiveNote,
        setNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
