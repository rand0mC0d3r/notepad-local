import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { notes, setNotes, toggleSidebar } from '../store/notes';
import { themeMode, toggleTheme } from '../store/theme';
import { themeStyles, baseStyles } from '../styles/theme';
import { SignalWatcher } from '@lit-labs/preact-signals';

@customElement('app-header')
export class AppHeader extends SignalWatcher(LitElement) {
  static styles = [
    themeStyles,
    baseStyles,
    css`
      :host {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md);
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-divider);
      }
      
      .left-section {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }
      
      .right-section {
        display: flex;
        gap: var(--spacing-xs);
      }
      
      h1 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--color-text);
      }
      
      button {
        width: 36px;
        height: 36px;
        font-size: 1.2rem;
      }
      
      input[type="file"] {
        display: none;
      }
    `
  ];

  private async handleDownloadZip() {
    const currentNotes = notes.value;
    if (currentNotes.length === 0) {
      alert('No notes to download');
      return;
    }

    const zip = new JSZip();
    
    // Add notes data as JSON
    zip.file('notes.json', JSON.stringify(currentNotes, null, 2));
    
    // Add each note as a markdown file
    currentNotes.forEach((note, index) => {
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
  }

  private async handleUploadZip(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
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
      alert('Error reading ZIP file: ' + (error as Error).message);
    }
    
    // Reset file input
    input.value = '';
  }

  render() {
    const mode = themeMode.value;
    this.classList.remove('light', 'dark');
    this.classList.add(mode);
    
    return html`
      <div class="left-section">
        <button @click=${toggleSidebar} title="Toggle sidebar">
          ☰
        </button>
        <h1>📝 NotePadie</h1>
      </div>
      <div class="right-section">
        <button @click=${toggleTheme} title="Switch to ${mode === 'dark' ? 'light' : 'dark'} mode">
          ${mode === 'dark' ? '☀️' : '🌙'}
        </button>
        <button @click=${this.handleDownloadZip} title="Download all notes as ZIP">
          ⬇️
        </button>
        <label>
          <button title="Upload ZIP to restore notes">
            ⬆️
          </button>
          <input
            type="file"
            accept=".zip"
            @change=${this.handleUploadZip}
          />
        </label>
      </div>
    `;
  }
}
