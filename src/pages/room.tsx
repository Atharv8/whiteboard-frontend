import { useSearchParams } from 'react-router-dom';
import { Canvas } from '../components/Canvas';
import { Toolbar } from '../components/Toolbar';
import { Cursors } from '../components/Cursors';
import { useSocket } from '../hooks/useSocket';

const Room = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId') || 'default';
  const userName = searchParams.get('userName') || '';
  const { socket } = useSocket(roomId, userName);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative" >
      <Canvas roomId={roomId} socket={socket} />
      <Toolbar />
      <Cursors />
    </div>
  );
};

export { Room };