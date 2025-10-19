import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  CreateNewFolder as CreateNewFolderIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import './Sidebar.css';

const Sidebar = () => {
  const {
    notes,
    folders,
    activeNoteId,
    setActiveNoteId,
    createNote,
    deleteNote,
    createFolder,
    deleteFolder,
    isSidebarOpen,
    moveNoteToFolder,
  } = useNotes();

  const [expandedFolders, setExpandedFolders] = useState({});
  const [createFolderDialog, setCreateFolderDialog] = useState({
    open: false,
    parentId: null,
  });
  const [folderName, setFolderName] = useState('');
  const [draggedNote, setDraggedNote] = useState(null);
  const [dragOverFolder, setDragOverFolder] = useState(null);

  const handleDeleteNote = (e, noteId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
    }
  };

  const handleDeleteFolder = (e, folderId) => {
    e.stopPropagation();
    const result = deleteFolder(folderId);
    if (!result) {
      alert('Cannot delete folder: it contains notes or subfolders.');
    }
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      createFolder(folderName.trim(), createFolderDialog.parentId);
      setFolderName('');
      setCreateFolderDialog({ open: false, parentId: null });
    }
  };

  const openCreateFolderDialog = (parentId = null) => {
    setCreateFolderDialog({ open: true, parentId });
    setFolderName('');
  };

  // Drag and drop handlers
  const handleDragStart = (e, noteId) => {
    setDraggedNote(noteId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedNote(null);
    setDragOverFolder(null);
  };

  const handleDragOver = (e, folderId) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverFolder(folderId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only clear if we're leaving the folder area
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setDragOverFolder(null);
    }
  };

  const handleDrop = (e, folderId) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedNote) {
      moveNoteToFolder(draggedNote, folderId);
      setDraggedNote(null);
      setDragOverFolder(null);
    }
  };

  // Recursive function to render folders and their contents
  const renderFolder = (folderId, level = 0) => {
    const subfolders = folders.filter((f) => f.parentId === folderId);
    const folderNotes = notes.filter((n) => n.folderId === folderId);
    const isExpanded = expandedFolders[folderId] ?? true;

    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return null;

    const isDragOver = dragOverFolder === folderId;

    return (
      <Box key={folderId}>
        <ListItem
          disablePadding
          sx={{ 
            pl: level * 2,
            bgcolor: isDragOver ? 'action.hover' : 'transparent',
            transition: 'background-color 0.2s'
          }}
          secondaryAction={
            <Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  openCreateFolderDialog(folderId);
                }}
                title="Create subfolder"
              >
                <CreateNewFolderIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => handleDeleteFolder(e, folderId)}
                title="Delete folder"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          }
          onDragOver={(e) => handleDragOver(e, folderId)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, folderId)}
        >
          <ListItemButton onClick={() => toggleFolder(folderId)}>
            {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            <CreateNewFolderIcon sx={{ mr: 1, ml: 1 }} />
            <ListItemText primary={folder.name} />
          </ListItemButton>
        </ListItem>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List disablePadding>
            {subfolders.map((subfolder) => renderFolder(subfolder.id, level + 1))}
            {folderNotes.map((note) => (
              <ListItem
                key={note.id}
                disablePadding
                sx={{ 
                  pl: (level + 1) * 2,
                  cursor: 'grab',
                  '&:active': {
                    cursor: 'grabbing'
                  },
                  opacity: draggedNote === note.id ? 0.5 : 1
                }}
                secondaryAction={
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteNote(e, note.id)}
                    title="Delete note"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
                draggable
                onDragStart={(e) => handleDragStart(e, note.id)}
                onDragEnd={handleDragEnd}
              >
                <ListItemButton
                  selected={note.id === activeNoteId}
                  onClick={() => setActiveNoteId(note.id)}
                >
                  <FileIcon sx={{ mr: 1, ml: 3 }} fontSize="small" />
                  <ListItemText
                    primary={note.title || 'Untitled'}
                    secondary={new Date(note.updatedAt).toLocaleDateString()}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>
    );
  };

  // Get root folders and notes
  const rootFolders = folders.filter((f) => f.parentId === null);
  const rootNotes = notes.filter((n) => n.folderId === null);

  return (
    <Box
      className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
      sx={{
        width: 280,
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Notes</Typography>
        <Box>
          <IconButton
            color="primary"
            onClick={() => openCreateFolderDialog(null)}
            title="Create new folder"
            size="small"
          >
            <CreateNewFolderIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => createNote(null)}
            title="Create new note"
            size="small"
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      <List sx={{ flex: 1, overflow: 'auto' }}>
        {rootFolders.map((folder) => renderFolder(folder.id, 0))}
        {rootNotes.map((note) => (
          <ListItem
            key={note.id}
            disablePadding
            secondaryAction={
              <IconButton
                size="small"
                onClick={(e) => handleDeleteNote(e, note.id)}
                title="Delete note"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            }
            draggable
            onDragStart={(e) => handleDragStart(e, note.id)}
            onDragEnd={handleDragEnd}
            sx={{
              cursor: 'grab',
              '&:active': {
                cursor: 'grabbing'
              },
              opacity: draggedNote === note.id ? 0.5 : 1
            }}
          >
            <ListItemButton
              selected={note.id === activeNoteId}
              onClick={() => setActiveNoteId(note.id)}
            >
              <FileIcon sx={{ mr: 1, ml: 1 }} fontSize="small" />
              <ListItemText
                primary={note.title || 'Untitled'}
                secondary={new Date(note.updatedAt).toLocaleDateString()}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Create Folder Dialog */}
      <Dialog open={createFolderDialog.open} onClose={() => setCreateFolderDialog({ open: false, parentId: null })}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            variant="outlined"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateFolder();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateFolderDialog({ open: false, parentId: null })}>Cancel</Button>
          <Button onClick={handleCreateFolder} variant="contained" disabled={!folderName.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
