// app/components/HistoryPanel.js
import { ImagePlus } from 'lucide-react';

export default function HistoryPanel({ history, onSelect }) {
  const BACKEND_URL = 'http://localhost:8000';

  return (
    <aside className="w-80 bg-gray-950 p-4 border-r border-gray-800 flex-shrink-0 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Lịch sử</h2>
      {history.length === 0 ? (
        <p className="text-gray-500 text-sm">Chưa có ảnh nào được tạo.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item._id} className="bg-gray-800 rounded-lg p-3 group relative">
              <img
                src={`${BACKEND_URL}${item.resultImageUrl}`}
                alt="History result"
                className="w-full h-auto rounded-md mb-2"
              />
              <p className="text-xs text-gray-400 truncate mb-2">
                <strong>Mô tả:</strong> {item.prompt}
              </p>
              <button
                onClick={() => onSelect(item.resultImageUrl)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ImagePlus size={16} className="mr-2" />
                Dùng làm đầu vào
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}