import { useWhiteboardStore } from '../stores/whiteboardStore';

interface UserCursorProps {
  id: string;
  x: number;
  y: number;
  color: string;
  name?: string;
}

const UserCursor = ({ id, x, y, color, name }: UserCursorProps) => {
  return (
    <div
      className="absolute pointer-events-none z-40 transition-all duration-50"
      style={{ left: x - 20, top: y - 20 }}
      key={id}
    >
      {/* Cursor ring */}
      <div
        className="w-4 h-4 rounded-full border-4 border-opacity-75 shadow-lg"
        style={{ backgroundColor: color, borderColor: color }}
      />
      {/* Tail */}
      <div className="absolute -right-2 top-1 w-8 h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full" />
      {/* Name tag */}
      {name && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/95 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shadow-2xl border border-white/20 font-medium">
          {name}
        </div>
      )}
    </div>
  );
};

export const Cursors = () => {
  const cursors = useWhiteboardStore((state) => state.cursors);

  return (
    <>
      {Object.entries(cursors).map(([userId, cursor]) => (
        <UserCursor
          key={userId}
          id={userId}
          x={cursor.x}
          y={cursor.y}
          color={cursor.color}
          name={cursor.name}
        />
      ))}
    </>
  );
};
