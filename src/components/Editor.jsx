import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNotes } from '../hooks/useNotes';
import MarkdownToolbar from './MarkdownToolbar';
import './Editor.css';

const Editor = () => {
  const { getActiveNote, updateNote } = useNotes();
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
      <div className="editor">
        <div className="no-note-selected">
          <p>Select a note or create a new one to get started</p>
        </div>
      </div>
    );
  }

  const handleTitleChange = (e) => {
    updateNote(activeNote.id, { title: e.target.value });
  };

  const handleContentChange = (e) => {
    updateNote(activeNote.id, { content: e.target.value });
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

  return (
    <div className="editor">
      <div className="editor-header">
        <input
          type="text"
          className="note-title-input"
          value={activeNote.title}
          onChange={handleTitleChange}
          placeholder="Note title"
        />
        <button
          className={`btn-preview ${showPreview ? 'active' : ''}`}
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? '✏️ Edit' : '👁️ Preview'}
        </button>
      </div>
      <MarkdownToolbar onFormat={handleFormat} />
      <div className="editor-content">
        {showPreview ? (
          <div className="markdown-preview">
            <ReactMarkdown>{activeNote.content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            className="note-textarea"
            value={activeNote.content}
            onChange={handleContentChange}
            placeholder="Start writing your note..."
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
