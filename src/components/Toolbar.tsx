// components/Toolbar.tsx
import { useWhiteboardStore } from '../stores/whiteboardStore';

const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];
const sizes = [2, 4, 8, 12, 16, 24];

export const Toolbar = () => {
  const selectedColor = useWhiteboardStore((state) => state.selectedColor);
  const selectedWidth = useWhiteboardStore((state) => state.selectedWidth);
  const setTool = useWhiteboardStore((state) => state.setTool);
  const undo = useWhiteboardStore((state) => state.undo);
  const redo = useWhiteboardStore((state) => state.redo);
  const clear = useWhiteboardStore((state) => state.clear);

  return (
    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col gap-4 max-w-xs">
      {/* Colors */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-10 h-10 rounded-full border-4 transition-all ${
                selectedColor === color
                  ? 'border-black shadow-lg scale-110'
                  : 'border-gray-300 hover:border-gray-500 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setTool(color, selectedWidth)}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Size</label>
        <div className="flex gap-2 flex-wrap">
          {sizes.map((size) => (
            <button
              key={size}
              className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all font-mono text-sm ${
                selectedWidth === size
                  ? 'border-black bg-black text-white shadow-lg scale-110'
                  : 'border-gray-300 hover:border-gray-500 hover:scale-105'
              }`}
              onClick={() => setTool(selectedColor, size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <button
          onClick={undo}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-medium text-sm shadow-md hover:shadow-lg"
          disabled={false} // Add logic from store
        >
          Undo
        </button>
        <button
          onClick={redo}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-medium text-sm shadow-md hover:shadow-lg"
        >
          Redo
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-medium text-sm shadow-md hover:shadow-lg w-20"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
