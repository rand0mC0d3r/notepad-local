import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNotes } from '../hooks/useNotes';
import MarkdownToolbar from './MarkdownToolbar';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import './Editor.css';

const Editor = () => {
  const { getActiveNote, updateNote, folders, moveNoteToFolder } = useNotes();
  const activeNote = getActiveNote();
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && activeNote) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [activeNote]);

  if (!activeNote) {
    return (
      <Box
        className="editor"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a note or create a new one to get started
        </Typography>
      </Box>
    );
  }

  const handleTitleChange = (e) => {
    updateNote(activeNote.id, { title: e.target.value });
  };

  const handleContentChange = (e) => {
    updateNote(activeNote.id, { content: e.target.value });
  };

  const handleFolderChange = (e) => {
    const newFolderId = e.target.value === 'root' ? null : e.target.value;
    moveNoteToFolder(activeNote.id, newFolderId);
  };

  const handleFormat = (formatFn) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = activeNote.content.substring(start, end);
    const formattedText = formatFn(selectedText || 'text');

    const newContent =
      activeNote.content.substring(0, start) +
      formattedText +
      activeNote.content.substring(end);

    updateNote(activeNote.id, { content: newContent });

    // Restore focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Build folder options with hierarchy
  const buildFolderOptions = () => {
    const options = [{ id: 'root', name: 'Root', level: 0 }];
    
    const addFolderWithChildren = (parentId, level) => {
      const children = folders
        .filter(f => f.parentId === parentId)
        .sort((a, b) => a.name.localeCompare(b.name));
      
      children.forEach(folder => {
        options.push({ id: folder.id, name: folder.name, level });
        addFolderWithChildren(folder.id, level + 1);
      });
    };
    
    addFolderWithChildren(null, 1);
    return options;
  };

  const folderOptions = buildFolderOptions();

  return (
    <Box className="editor" sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.default' }}>
      <Box
        className="editor-header"
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={activeNote.title}
          onChange={handleTitleChange}
          placeholder="Note title"
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Folder</InputLabel>
          <Select
            value={activeNote.folderId || 'root'}
            label="Folder"
            onChange={handleFolderChange}
          >
            {folderOptions.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {'\u00A0'.repeat(option.level * 4)}{option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant={showPreview ? 'contained' : 'outlined'}
          onClick={() => setShowPreview(!showPreview)}
          sx={{ minWidth: 100 }}
        >
          {showPreview ? '✏️ Edit' : '👁️ Preview'}
        </Button>
      </Box>
      <MarkdownToolbar onFormat={handleFormat} />
      <Box className="editor-content" sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'background.default' }}>
        {showPreview ? (
          <Box className="markdown-preview" sx={{ color: 'text.primary' }}>
            <ReactMarkdown>{activeNote.content}</ReactMarkdown>
          </Box>
        ) : (
          <textarea
            ref={textareaRef}
            className="note-textarea"
            value={activeNote.content}
            onChange={handleContentChange}
            placeholder="Start writing your note..."
            style={{
              width: '100%',
              minHeight: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '14px',
              fontFamily: 'inherit',
              color: 'inherit',
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Editor;
