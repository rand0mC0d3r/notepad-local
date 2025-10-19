import { NotesProvider } from './context/NotesContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import './App.css';

function App() {
  return (
    <NotesProvider>
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar />
          <Editor />
        </div>
      </div>
    </NotesProvider>
  );
}

export default App;
