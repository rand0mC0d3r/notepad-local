import './App.css';
import Editor from './components/Editor';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { NotesProvider } from './context/NotesContext';
import { ThemeProvider } from './context/ThemeContext';
import { useNotes } from './hooks/useNotes';

function AppContent() {
  const { isSidebarOpen } = useNotes();

  return (
    <div className="app">
      <Header />
      <div className={`app-body ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar />
        <Editor />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;
