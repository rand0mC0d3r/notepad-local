import { signal, computed, effect } from '@preact/signals-core';
import { v4 as uuidv4 } from 'uuid';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  folderId: string | null;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

// Signals for state
export const notes = signal<Note[]>([]);
export const folders = signal<Folder[]>([]);
export const activeNoteId = signal<string | null>(null);
export const isSidebarOpen = signal<boolean>(true);

// Computed values
export const activeNote = computed(() => {
  const id = activeNoteId.value;
  return notes.value.find(note => note.id === id) || null;
});

// Initialize from localStorage
const initializeNotes = () => {
  const savedNotes = localStorage.getItem('notepad-notes');
  const savedFolders = localStorage.getItem('notepad-folders');
  
  if (savedNotes) {
    const parsedNotes = JSON.parse(savedNotes);
    notes.value = parsedNotes;
    if (parsedNotes.length > 0) {
      activeNoteId.value = parsedNotes[0].id;
    }
  } else {
    // Create a default note if none exist
    const defaultNote: Note = {
      id: uuidv4(),
      title: 'Welcome',
      content: '# Welcome to NotePadie\n\nStart writing your notes here!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: null,
    };
    notes.value = [defaultNote];
    activeNoteId.value = defaultNote.id;
  }

  if (savedFolders) {
    folders.value = JSON.parse(savedFolders);
  }
};

// Save to localStorage on changes
effect(() => {
  if (notes.value.length > 0) {
    localStorage.setItem('notepad-notes', JSON.stringify(notes.value));
  }
});

effect(() => {
  localStorage.setItem('notepad-folders', JSON.stringify(folders.value));
});

// Actions
export const createNote = (folderId: string | null = null): Note => {
  const newNote: Note = {
    id: uuidv4(),
    title: 'Untitled',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    folderId,
  };
  notes.value = [...notes.value, newNote];
  activeNoteId.value = newNote.id;
  return newNote;
};

export const updateNote = (id: string, updates: Partial<Note>): void => {
  notes.value = notes.value.map(note =>
    note.id === id
      ? { ...note, ...updates, updatedAt: new Date().toISOString() }
      : note
  );
};

export const deleteNote = (id: string): void => {
  const filteredNotes = notes.value.filter(note => note.id !== id);
  notes.value = filteredNotes;
  
  // If we deleted the active note, select another one
  if (id === activeNoteId.value) {
    if (filteredNotes.length > 0) {
      activeNoteId.value = filteredNotes[0].id;
    } else {
      activeNoteId.value = null;
    }
  }
};

export const createFolder = (name: string, parentId: string | null = null): Folder => {
  const newFolder: Folder = {
    id: uuidv4(),
    name,
    parentId,
    createdAt: new Date().toISOString(),
  };
  folders.value = [...folders.value, newFolder];
  return newFolder;
};

export const deleteFolder = (id: string): boolean => {
  // Check if folder has any notes
  const hasNotes = notes.value.some(note => note.folderId === id);
  if (hasNotes) {
    return false; // Cannot delete folder with notes
  }
  
  // Check if folder has any subfolders
  const hasSubfolders = folders.value.some(folder => folder.parentId === id);
  if (hasSubfolders) {
    return false; // Cannot delete folder with subfolders
  }
  
  folders.value = folders.value.filter(folder => folder.id !== id);
  return true;
};

export const renameFolder = (id: string, newName: string): void => {
  folders.value = folders.value.map(folder =>
    folder.id === id ? { ...folder, name: newName } : folder
  );
};

export const moveNoteToFolder = (noteId: string, folderId: string | null): void => {
  updateNote(noteId, { folderId });
};

export const toggleSidebar = (): void => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

export const setNotes = (newNotes: Note[]): void => {
  notes.value = newNotes;
};

// Initialize on module load
initializeNotes();
