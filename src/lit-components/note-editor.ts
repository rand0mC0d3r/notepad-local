import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { SignalWatcher } from '@lit-labs/preact-signals';
import { marked } from 'marked';
import { activeNote, updateNote, folders, moveNoteToFolder } from '../store/notes';
import { themeStyles, baseStyles } from '../styles/theme';
import type { FormatFunction } from './markdown-toolbar';
import './markdown-toolbar';

@customElement('note-editor')
export class NoteEditor extends SignalWatcher(LitElement) {
  @state() private showPreview = false;
  @query('textarea') private textarea?: HTMLTextAreaElement;

  static styles = [
    themeStyles,
    baseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--color-background);
      }
      
      .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md);
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-divider);
        min-height: 64px;
        gap: var(--spacing-md);
        flex-wrap: wrap;
      }
      
      .header-inputs {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
        align-items: center;
        flex: 1;
      }
      
      .title-input {
        min-width: 200px;
        flex: 1;
      }
      
      .folder-select {
        min-width: 200px;
      }
      
      .preview-btn {
        padding: var(--spacing-sm) var(--spacing-md);
        white-space: nowrap;
      }
      
      .preview-btn.active {
        background: var(--color-primary);
        color: white;
      }
      
      .editor-content {
        flex: 1;
        overflow: auto;
        padding: var(--spacing-lg);
      }
      
      textarea {
        width: 100%;
        min-height: 100%;
        background: transparent;
        border: none;
        outline: none;
        resize: none;
        font-size: 14px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        line-height: 1.6;
      }
      
      .markdown-preview {
        color: var(--color-text);
        line-height: 1.6;
      }
      
      .markdown-preview h1 {
        font-size: 2em;
        margin-top: 0.67em;
        margin-bottom: 0.67em;
      }
      
      .markdown-preview h2 {
        font-size: 1.5em;
        margin-top: 0.83em;
        margin-bottom: 0.83em;
      }
      
      .markdown-preview h3 {
        font-size: 1.17em;
        margin-top: 1em;
        margin-bottom: 1em;
      }
      
      .markdown-preview code {
        background: var(--color-surface);
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      }
      
      .markdown-preview pre {
        background: var(--color-surface);
        padding: var(--spacing-md);
        border-radius: var(--border-radius);
        overflow-x: auto;
      }
      
      .markdown-preview pre code {
        background: none;
        padding: 0;
      }
      
      .markdown-preview blockquote {
        border-left: 4px solid var(--color-divider);
        padding-left: var(--spacing-md);
        margin-left: 0;
        color: var(--color-text-secondary);
      }
      
      .markdown-preview ul, .markdown-preview ol {
        padding-left: var(--spacing-lg);
      }
      
      .markdown-preview a {
        color: var(--color-primary);
        text-decoration: none;
      }
      
      .markdown-preview a:hover {
        text-decoration: underline;
      }
      
      .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--color-text-secondary);
        font-size: 1.1rem;
      }
    `
  ];

  private handleTitleChange(e: Event) {
    const note = activeNote.value;
    if (!note) return;
    const input = e.target as HTMLInputElement;
    updateNote(note.id, { title: input.value });
  }

  private handleContentChange(e: Event) {
    const note = activeNote.value;
    if (!note) return;
    const textarea = e.target as HTMLTextAreaElement;
    updateNote(note.id, { content: textarea.value });
  }

  private handleFolderChange(e: Event) {
    const note = activeNote.value;
    if (!note) return;
    const select = e.target as HTMLSelectElement;
    const newFolderId = select.value === 'root' ? null : select.value;
    moveNoteToFolder(note.id, newFolderId);
  }

  private handleFormat(formatFn: FormatFunction): void {
    const note = activeNote.value;
    const textarea = this.textarea;
    if (!note || !textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = note.content.substring(start, end);
    const formattedText = formatFn(selectedText || 'text');

    const newContent =
      note.content.substring(0, start) +
      formattedText +
      note.content.substring(end);

    updateNote(note.id, { content: newContent });

    // Restore focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  private buildFolderOptions() {
    const allFolders = folders.value;
    const options: Array<{ id: string; name: string; level: number }> = [
      { id: 'root', name: 'Root', level: 0 }
    ];

    const addFolderWithChildren = (parentId: string | null, level: number) => {
      const children = allFolders
        .filter(f => f.parentId === parentId)
        .sort((a, b) => a.name.localeCompare(b.name));

      children.forEach(folder => {
        options.push({ id: folder.id, name: folder.name, level });
        addFolderWithChildren(folder.id, level + 1);
      });
    };

    addFolderWithChildren(null, 1);
    return options;
  }

  render() {
    const note = activeNote.value;

    if (!note) {
      return html`
        <div class="empty-state">
          Select a note or create a new one to get started
        </div>
      `;
    }

    const folderOptions = this.buildFolderOptions();
    const markdownHtml = this.showPreview ? marked(note.content) : '';

    return html`
      <div class="editor-header">
        <div class="header-inputs">
          <input
            class="title-input"
            type="text"
            .value=${note.title}
            @input=${this.handleTitleChange}
            placeholder="Note title"
          />
          <select
            class="folder-select"
            .value=${note.folderId || 'root'}
            @change=${this.handleFolderChange}
          >
            ${folderOptions.map(option => html`
              <option value=${option.id}>
                ${'\u00A0'.repeat(option.level * 4)}${option.name}
              </option>
            `)}
          </select>
        </div>
        <button
          class="preview-btn ${this.showPreview ? 'active' : ''}"
          @click=${() => { this.showPreview = !this.showPreview; }}
        >
          ${this.showPreview ? '✏️ Edit' : '👁️ Preview'}
        </button>
      </div>
      
      <markdown-toolbar 
        .onFormat=${(formatFn: FormatFunction) => this.handleFormat(formatFn)}
      ></markdown-toolbar>
      
      <div class="editor-content">
        ${this.showPreview ? html`
          <div class="markdown-preview">
            ${unsafeHTML(markdownHtml)}
          </div>
        ` : html`
          <textarea
            .value=${note.content}
            @input=${this.handleContentChange}
            placeholder="Start writing your note..."
          ></textarea>
        `}
      </div>
    `;
  }
}
