// app/components/ImageUploader.js
'use client';
import { UploadCloud, X } from 'lucide-react';

// Component này chỉ nhận props và không có logic xử lý state riêng
export default function ImageUploader({ selectedFiles, onAddFiles, onRemoveFile }) {
  
  // Hàm này chỉ đọc file từ input và gọi hàm onAddFiles của component cha
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    // Lọc ra các file ảnh để đảm bảo an toàn
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    // Gọi hàm của component cha để xử lý việc thêm file
    onAddFiles(imageFiles); 
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <label className="block text-sm font-medium mb-3 text-gray-300">
        Ảnh đầu vào (Tối đa 3 ảnh)
      </label>
      <div className="flex items-center space-x-4">
        {/* Render danh sách ảnh dựa trên prop `selectedFiles` */}
        {selectedFiles.map((file) => (
          // Sử dụng `file.name` làm key ổn định
          <div key={file.name} className="relative group">
            <img
              src={file.previewUrl}
              alt={file.name}
              className="w-28 h-28 object-cover rounded-lg"
            />
            {/* Khi click nút X, gọi hàm onRemoveFile của component cha */}
            <button
              onClick={() => onRemoveFile(file.name)} 
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Xóa ảnh"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {/* Nút để thêm ảnh mới */}
        {selectedFiles.length < 3 && (
          <label className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-700 transition-colors">
            <UploadCloud size={32} className="text-gray-400" />
            <span className="text-xs mt-2 text-gray-400">Thêm ảnh</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
}