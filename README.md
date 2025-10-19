# 📝 Notepad Local

A modern, feature-rich markdown notepad application built with Vite, React, and Context API. Write, organize, and manage your notes with full markdown support, all stored locally in your browser.

## ✨ Features

- **🎨 Markdown Support**: Write notes with full markdown syntax support
- **👁️ Live Preview**: Toggle between edit and preview modes
- **🛠️ Markdown Toolbar**: Quick formatting buttons for:
  - Bold, Italic
  - Headings (H1-H6)
  - Links and Images
  - Bullet and Numbered Lists
  - Code Blocks and Inline Code
  - Blockquotes
- **📂 Note Management**: Create, edit, delete, and organize multiple notes
- **💾 Auto-Save**: Notes automatically saved to browser's localStorage
- **📦 Export/Import**:
  - Download all notes as a ZIP file
  - Import notes from a ZIP backup
- **🌙 Dark Theme**: Professional dark theme optimized for comfortable writing
- **⚡ Fast & Responsive**: Built with Vite for lightning-fast performance

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rand0mC0d3r/notepad-local.git
cd notepad-local
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 Usage

### Creating a Note
- Click the `+` button in the sidebar
- A new "Untitled" note will be created

### Editing a Note
- Click on a note in the sidebar to open it
- Use the markdown toolbar for quick formatting
- Changes are saved automatically

### Preview Mode
- Click the "👁️ Preview" button to see your markdown rendered
- Click "✏️ Edit" to return to edit mode

### Exporting Notes
- Click the "⬇️ Export" button in the header
- All notes will be downloaded as a ZIP file containing:
  - `notes.json` - Complete note data
  - Individual `.md` files for each note

### Importing Notes
- Click the "⬆️ Import" button in the header
- Select a previously exported ZIP file
- Confirm to restore your notes (this will replace current notes)

### Deleting a Note
- Click the 🗑️ icon next to a note in the sidebar
- Confirm the deletion

## 🏗️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Markdown**: react-markdown
- **File Handling**: JSZip, file-saver
- **State Management**: React Context API
- **Styling**: CSS (Custom)
- **ID Generation**: UUID

## 📁 Project Structure

```
notepad-local/
├── src/
│   ├── components/
│   │   ├── Editor.jsx          # Main editor component
│   │   ├── Editor.css
│   │   ├── Header.jsx          # Header with export/import
│   │   ├── Header.css
│   │   ├── Sidebar.jsx         # Notes list sidebar
│   │   ├── Sidebar.css
│   │   ├── MarkdownToolbar.jsx # Formatting toolbar
│   │   └── MarkdownToolbar.css
│   ├── context/
│   │   └── NotesContext.jsx    # Global state management
│   ├── hooks/
│   │   └── useNotes.js         # Custom hook for notes
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## 🔒 Privacy

All notes are stored locally in your browser's localStorage. No data is sent to any server. Your notes stay on your device.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Markdown rendering by [react-markdown](https://github.com/remarkjs/react-markdown)
- Icons: Unicode Emoji

test
