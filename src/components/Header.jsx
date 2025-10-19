import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useNotes } from '../hooks/useNotes';
import './Header.css';

const Header = () => {
  const { notes, setNotes } = useNotes();

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
      const filename = `${index + 1}-${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
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
    <header className="app-header">
      <div className="header-left">
        <h1>📝 Notepad Local</h1>
      </div>
      <div className="header-right">
        <button className="btn-header" onClick={handleDownloadZip} title="Download all notes as ZIP">
          ⬇️ Export
        </button>
        <label className="btn-header" title="Upload ZIP to restore notes">
          ⬆️ Import
          <input
            type="file"
            accept=".zip"
            onChange={handleUploadZip}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </header>
  );
};

export default Header;
