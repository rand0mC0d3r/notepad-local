import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/preact-signals';
import { 
  notes, 
  folders, 
  activeNoteId, 
  isSidebarOpen,
  createNote, 
  deleteNote,
  createFolder,
  deleteFolder,
  moveNoteToFolder
} from '../store/notes';
import { themeStyles, baseStyles } from '../styles/theme';
import type { Folder } from '../store/notes';

@customElement('app-sidebar')
export class AppSidebar extends SignalWatcher(LitElement) {
  @state() private expandedFolders: Record<string, boolean> = {};
  @state() private dialogOpen = false;
  @state() private dialogParentId: string | null = null;
  @state() private folderName = '';
  @state() private draggedNote: string | null = null;
  @state() private dragOverFolder: string | null = null;

  static styles = [
    themeStyles,
    baseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        background: var(--color-surface);
        border-right: 1px solid var(--color-divider);
        width: 280px;
        transition: transform var(--transition-speed);
      }
      
      :host(.closed) {
        transform: translateX(-100%);
      }
      
      .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--color-divider);
        min-height: 64px;
      }
      
      .sidebar-header h2 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--color-text);
      }
      
      .sidebar-actions {
        display: flex;
        gap: var(--spacing-xs);
      }
      
      .notes-list {
        flex: 1;
        overflow-y: auto;
        padding: var(--spacing-sm);
      }
      
      .note-item, .folder-item {
        display: flex;
        align-items: center;
        padding: var(--spacing-sm);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: background-color var(--transition-speed);
        margin-bottom: var(--spacing-xs);
      }
      
      .note-item:hover, .folder-item:hover {
        background-color: var(--color-hover);
      }
      
      .note-item.active {
        background-color: var(--color-active);
      }
      
      .note-item.dragging {
        opacity: 0.5;
      }
      
      .folder-item.drag-over {
        background-color: var(--color-hover);
      }
      
      .note-icon, .folder-icon {
        margin-right: var(--spacing-sm);
        font-size: 1rem;
      }
      
      .note-content, .folder-content {
        flex: 1;
        min-width: 0;
      }
      
      .note-title, .folder-name {
        font-weight: 500;
        color: var(--color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .note-date {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
      }
      
      .note-actions, .folder-actions {
        display: flex;
        gap: var(--spacing-xs);
        opacity: 0;
        transition: opacity var(--transition-speed);
      }
      
      .note-item:hover .note-actions,
      .folder-item:hover .folder-actions {
        opacity: 1;
      }
      
      .action-btn {
        padding: var(--spacing-xs);
        font-size: 0.9rem;
      }
      
      .folder-children {
        padding-left: var(--spacing-lg);
      }
      
      .folder-toggle {
        margin-right: var(--spacing-xs);
        font-size: 0.8rem;
      }
      
      .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      
      .dialog {
        background: var(--color-surface);
        border-radius: var(--border-radius);
        padding: var(--spacing-lg);
        min-width: 300px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      
      .dialog h3 {
        margin: 0 0 var(--spacing-md) 0;
        color: var(--color-text);
      }
      
      .dialog-input {
        width: 100%;
        margin-bottom: var(--spacing-md);
      }
      
      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-sm);
      }
      
      .btn-primary {
        background: var(--color-primary);
        color: white;
        padding: var(--spacing-sm) var(--spacing-md);
      }
      
      .btn-primary:hover {
        background: #005fa3;
      }
    `
  ];

  private handleDeleteNote(e: Event, noteId: string) {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
    }
  }

  private handleDeleteFolder(e: Event, folderId: string) {
    e.stopPropagation();
    const result = deleteFolder(folderId);
    if (!result) {
      alert('Cannot delete folder: it contains notes or subfolders.');
    }
  }

  private toggleFolder(folderId: string) {
    this.expandedFolders = {
      ...this.expandedFolders,
      [folderId]: !this.expandedFolders[folderId]
    };
  }

  private openCreateFolderDialog(parentId: string | null) {
    this.dialogOpen = true;
    this.dialogParentId = parentId;
    this.folderName = '';
  }

  private handleCreateFolder() {
    if (this.folderName.trim()) {
      createFolder(this.folderName.trim(), this.dialogParentId);
      this.dialogOpen = false;
      this.folderName = '';
    }
  }

  private handleDragStart(e: DragEvent, noteId: string) {
    this.draggedNote = noteId;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  }

  private handleDragEnd() {
    this.draggedNote = null;
    this.dragOverFolder = null;
  }

  private handleDragOver(e: DragEvent, folderId: string | null) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    this.dragOverFolder = folderId;
  }

  private handleDrop(e: DragEvent, folderId: string | null) {
    e.preventDefault();
    if (this.draggedNote) {
      moveNoteToFolder(this.draggedNote, folderId);
      this.draggedNote = null;
      this.dragOverFolder = null;
    }
  }

  private renderFolder(folder: Folder, level: number = 0) {
    const allFolders = folders.value;
    const allNotes = notes.value;
    const subfolders = allFolders.filter(f => f.parentId === folder.id);
    const folderNotes = allNotes.filter(n => n.folderId === folder.id);
    const isExpanded = this.expandedFolders[folder.id] ?? true;
    const isDragOver = this.dragOverFolder === folder.id;

    return html`
      <div>
        <div 
          class="folder-item ${isDragOver ? 'drag-over' : ''}"
          @click=${() => this.toggleFolder(folder.id)}
          @dragover=${(e: DragEvent) => this.handleDragOver(e, folder.id)}
          @drop=${(e: DragEvent) => this.handleDrop(e, folder.id)}
        >
          <span class="folder-toggle">${isExpanded ? '▼' : '▶'}</span>
          <span class="folder-icon">📁</span>
          <div class="folder-content">
            <div class="folder-name">${folder.name}</div>
          </div>
          <div class="folder-actions">
            <button 
              class="action-btn"
              @click=${(e: Event) => { e.stopPropagation(); this.openCreateFolderDialog(folder.id); }}
              title="Create subfolder"
            >
              ➕
            </button>
            <button 
              class="action-btn"
              @click=${(e: Event) => this.handleDeleteFolder(e, folder.id)}
              title="Delete folder"
            >
              🗑️
            </button>
          </div>
        </div>
        ${isExpanded ? html`
          <div class="folder-children">
            ${subfolders.map(subfolder => this.renderFolder(subfolder, level + 1))}
            ${folderNotes.map(note => this.renderNote(note))}
          </div>
        ` : ''}
      </div>
    `;
  }

  private renderNote(note: any) {
    const isActive = note.id === activeNoteId.value;
    const isDragging = this.draggedNote === note.id;

    return html`
      <div 
        class="note-item ${isActive ? 'active' : ''} ${isDragging ? 'dragging' : ''}"
        @click=${() => { activeNoteId.value = note.id; }}
        draggable="true"
        @dragstart=${(e: DragEvent) => this.handleDragStart(e, note.id)}
        @dragend=${this.handleDragEnd}
      >
        <span class="note-icon">📄</span>
        <div class="note-content">
          <div class="note-title">${note.title || 'Untitled'}</div>
          <div class="note-date">${new Date(note.updatedAt).toLocaleDateString()}</div>
        </div>
        <div class="note-actions">
          <button 
            class="action-btn"
            @click=${(e: Event) => this.handleDeleteNote(e, note.id)}
            title="Delete note"
          >
            🗑️
          </button>
        </div>
      </div>
    `;
  }

  render() {
    const allFolders = folders.value;
    const allNotes = notes.value;
    const rootFolders = allFolders.filter(f => f.parentId === null);
    const rootNotes = allNotes.filter(n => n.folderId === null);
    const isOpen = isSidebarOpen.value;

    return html`
      <div class=${isOpen ? '' : 'closed'}>
        <div class="sidebar-header">
          <h2>Notes</h2>
          <div class="sidebar-actions">
            <button 
              @click=${() => this.openCreateFolderDialog(null)}
              title="Create new folder"
            >
              📁+
            </button>
            <button 
              @click=${() => createNote(null)}
              title="Create new note"
            >
              ➕
            </button>
          </div>
        </div>
        
        <div class="notes-list">
          ${rootFolders.map(folder => this.renderFolder(folder, 0))}
          ${rootNotes.map(note => this.renderNote(note))}
        </div>
      </div>
      
      ${this.dialogOpen ? html`
        <div class="dialog-overlay" @click=${() => { this.dialogOpen = false; }}>
          <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
            <h3>Create New Folder</h3>
            <input 
              class="dialog-input"
              type="text"
              placeholder="Folder Name"
              .value=${this.folderName}
              @input=${(e: Event) => { this.folderName = (e.target as HTMLInputElement).value; }}
              @keypress=${(e: KeyboardEvent) => { if (e.key === 'Enter') this.handleCreateFolder(); }}
            />
            <div class="dialog-actions">
              <button @click=${() => { this.dialogOpen = false; }}>Cancel</button>
              <button 
                class="btn-primary"
                @click=${this.handleCreateFolder}
                ?disabled=${!this.folderName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}
