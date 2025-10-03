// app/components/ImageUploader.js
'use client';
import { UploadCloud, X } from 'lucide-react';

export default function ImageUploader({ selectedFiles, setSelectedFiles }) {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    // Lọc ra các file không phải ảnh
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Kết hợp file mới và file cũ, sau đó giới hạn số lượng
    const combinedFiles = [...selectedFiles, ...imageFiles];
    const newFiles = combinedFiles.slice(0, 3);
    setSelectedFiles(newFiles);
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(currentFiles => currentFiles.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <label className="block text-sm font-medium mb-3 text-gray-300">
        Ảnh đầu vào (Tối đa 3 ảnh)
      </label>
      <div className="flex items-center space-x-4">
        {selectedFiles.map((file, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(file)}
              alt={`preview ${index}`}
              className="w-28 h-28 object-cover rounded-lg"
              onLoad={e => URL.revokeObjectURL(e.target.src)} // Dọn dẹp bộ nhớ
            />
            <button
              onClick={() => removeFile(index)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Xóa ảnh"
            >
              <X size={16} />
            </button>
          </div>
        ))}

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