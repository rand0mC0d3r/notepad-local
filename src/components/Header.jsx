import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useNotes } from '../hooks/useNotes';
import { useTheme } from '../hooks/useTheme';
import { Box, IconButton, Typography } from '@mui/material';
import {
  Menu as MenuIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import './Header.css';

const Header = () => {
  const { notes, setNotes, toggleSidebar } = useNotes();
  const { mode, toggleTheme } = useTheme();

  const handleDownloadZip = async () => {
    if (notes.length === 0) {
      alert('No notes to download');
      return;
    }

    const zip = new JSZip();
    
    // Add notes data as JSON
    zip.file('notes.json', JSON.stringify(notes, null, 2));
    
    // Add each note as a markdown file
    notes.forEach((note, index) => {
      const sanitizedTitle = note.title
        .replace(/[^a-z0-9\-_\s]/gi, '')
        .replace(/\s+/g, '_')
        .toLowerCase();
      const filename = `${index + 1}-${sanitizedTitle}.md`;
      const content = `# ${note.title}\n\n${note.content}`;
      zip.file(filename, content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `notepad-backup-${new Date().toISOString().split('T')[0]}.zip`);
  };

  const handleUploadZip = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      // Try to find and load notes.json
      const notesFile = contents.file('notes.json');
      if (notesFile) {
        const notesData = await notesFile.async('string');
        const parsedNotes = JSON.parse(notesData);
        
        if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
          if (window.confirm('This will replace all your current notes. Continue?')) {
            setNotes(parsedNotes);
            alert('Notes restored successfully!');
          }
        } else {
          alert('No valid notes found in the ZIP file');
        }
      } else {
        alert('No notes.json found in the ZIP file');
      }
    } catch (error) {
      alert('Error reading ZIP file: ' + error.message);
    }
    
    // Reset file input
    e.target.value = '';
  };

  return (
    <Box
      className="app-header"
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        p: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={toggleSidebar} title="Toggle sidebar">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="h1">
          📝 NotePadie
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton onClick={toggleTheme} title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <IconButton onClick={handleDownloadZip} title="Download all notes as ZIP">
          <DownloadIcon />
        </IconButton>
        <IconButton component="label" title="Upload ZIP to restore notes">
          <UploadIcon />
          <input
            type="file"
            accept=".zip"
            onChange={handleUploadZip}
            style={{ display: 'none' }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;
