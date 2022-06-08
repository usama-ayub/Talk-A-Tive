import { Route, Routes } from 'react-router-dom';
import './App.css';
import ChatPage from './pages/Chat';
import HomePage from './pages/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
