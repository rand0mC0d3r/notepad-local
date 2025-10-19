/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load notes and folders from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notepad-notes');
    const savedFolders = localStorage.getItem('notepad-folders');
    
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
        content: '# Welcome to NotePadie\n\nStart writing your notes here!',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        folderId: null, // Root folder
      };
      setNotes([defaultNote]);
      setActiveNoteId(defaultNote.id);
    }

    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notepad-notes', JSON.stringify(notes));
    }
  }, [notes]);

  // Save folders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notepad-folders', JSON.stringify(folders));
  }, [folders]);

  const createNote = (folderId = null) => {
    const newNote = {
      id: uuidv4(),
      title: 'Untitled',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId,
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

  const createFolder = (name, parentId = null) => {
    const newFolder = {
      id: uuidv4(),
      name,
      parentId,
      createdAt: new Date().toISOString(),
    };
    setFolders([...folders, newFolder]);
    return newFolder;
  };

  const deleteFolder = (id) => {
    // Check if folder has any notes
    const hasNotes = notes.some(note => note.folderId === id);
    if (hasNotes) {
      return false; // Cannot delete folder with notes
    }
    
    // Check if folder has any subfolders
    const hasSubfolders = folders.some(folder => folder.parentId === id);
    if (hasSubfolders) {
      return false; // Cannot delete folder with subfolders
    }
    
    setFolders(folders.filter(folder => folder.id !== id));
    return true;
  };

  const renameFolder = (id, newName) => {
    setFolders(folders.map(folder =>
      folder.id === id ? { ...folder, name: newName } : folder
    ));
  };

  const moveNoteToFolder = (noteId, folderId) => {
    updateNote(noteId, { folderId });
  };

  const getActiveNote = () => {
    return notes.find(note => note.id === activeNoteId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        folders,
        activeNoteId,
        setActiveNoteId,
        createNote,
        updateNote,
        deleteNote,
        createFolder,
        deleteFolder,
        renameFolder,
        moveNoteToFolder,
        getActiveNote,
        setNotes,
        isSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
