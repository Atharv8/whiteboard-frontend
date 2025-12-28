// src/App.tsx - FIXED
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RoomList } from './pages/RoomList';
import { Room } from './pages/room';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomList/>} />
        <Route path="/room" element={<Room/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
