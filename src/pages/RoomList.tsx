// src/pages/RoomList.tsx - FULL VERSION WITH IMPORTS
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const RoomList = () => {
  const [newRoomName, setNewRoomName] = useState('');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const navigate = useNavigate();
  
  // Generate short room ID
  const generateRoomId = () => Math.random().toString(36).substring(2, 8);

  const createRoom = () => {
    const roomId = generateRoomId();
    localStorage.setItem('userName', userName);
    navigate(`/room?roomId=${roomId}&userName=${encodeURIComponent(userName)}`);
  };

  const joinRoom = (roomId: string) => {
    localStorage.setItem('userName', userName);
    navigate(`/room?roomId=${roomId}&userName=${encodeURIComponent(userName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 max-w-2xl w-full p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Collaborative Whiteboard
          </h1>
          <p className="text-gray-600 text-lg">Draw together in real-time</p>
        </div>

        {/* User name input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg"
            maxLength={20}
          />
        </div>

        {/* Create new room */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room name (optional)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={createRoom}
              disabled={!userName.trim()}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </div>

        {/* Quick join rooms */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Quick join
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: 'design', name: 'Design Brainstorm', users: 3 },
              { id: 'math', name: 'Math Class', users: 8 },
              { id: 'code', name: 'Code Review', users: 5 },
              { id: 'fun', name: 'Just Draw', users: 2 }
            ].map((room) => (
              <button
                key={room.id}
                onClick={() => joinRoom(room.id)}
                disabled={!userName.trim()}
                className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-2xl transition-all hover:shadow-lg flex items-center justify-between disabled:opacity-50"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">{room.name}</h4>
                  <p className="text-sm text-gray-600">{room.users} users</p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  {room.users}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
