// app/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import ImageUploader from './components/ImageUploader';
import HistoryPanel from './components/HistoryPanel';
import ResultDisplay from './components/ResultDisplay';
import UserProfile from './components/UserProfile';
import toast, { Toaster } from 'react-hot-toast';
import Spinner from './components/Spinner';

export default function Home() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // State này chứa { name, previewUrl, fileObject }
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // --- DATA FETCHING (Giữ nguyên) ---
  const fetchHistory = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/api/image/history');
      setHistory(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử:", error);
      toast.error('Không thể tải lịch sử tạo ảnh.');
    }
  }, [user]);

  useEffect(() => {
    const fetchUserAndHistory = async () => {
      try {
        const res = await api.get('/auth/current_user');
        if (res.data) {
          setUser(res.data);
        }
      } catch (error) {
        console.log("Người dùng chưa đăng nhập");
      } finally {
        setAuthChecked(true);
      }
    };
    fetchUserAndHistory();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);


  // --- EVENT HANDLERS (SỬA LẠI Ở ĐÂY) ---

  // SỬA LẠI HÀM NÀY
  const handleAddFiles = useCallback((newFiles) => {
    // Lọc ra các file mới chưa có trong danh sách cũ
    const uniqueNewFiles = newFiles.filter(
      (newFile) => !selectedFiles.some(existingFile => existingFile.name === newFile.name)
    );

    // Chuyển các file mới thành object mà chúng ta cần
    const newFileObjects = uniqueNewFiles.map(file => ({
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      fileObject: file
    }));
    
    // Kết hợp danh sách cũ và mới, sau đó giới hạn tổng số file là 3
    setSelectedFiles(prevFiles => [...prevFiles, ...newFileObjects].slice(0, 3));
  }, [selectedFiles]); // Hàm này cần phụ thuộc vào `selectedFiles` hiện tại

  // Hàm này đã đúng, giữ nguyên
  const handleRemoveFile = useCallback((fileNameToRemove) => {
    setSelectedFiles(prevFiles => {
      const fileToRevoke = prevFiles.find(f => f.name === fileNameToRemove);
      if (fileToRevoke) {
        URL.revokeObjectURL(fileToRevoke.previewUrl);
      }
      return prevFiles.filter(file => file.name !== fileNameToRemove);
    });
  }, []);

  // Các hàm handleGenerate và useResultAsInput giữ nguyên
  const handleGenerate = async () => {
    if (selectedFiles.length === 0) return toast.error('Vui lòng chọn ít nhất 1 ảnh.');
    if (!prompt.trim()) return toast.error('Vui lòng nhập mô tả ý tưởng.');

    setIsLoading(true);
    setResult(null);
    const loadingToast = toast.loading('AI đang phân tích và sáng tạo...');

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('images', file.fileObject);
    });
    formData.append('prompt', prompt);

    try {
      const res = await api.post('/api/image/generate', formData);
      setResult(res.data);
      toast.success('Tạo ảnh thành công!', { id: loadingToast });
      await fetchHistory();
    } catch (error) {
      const errorMessage = error.response?.data || "Đã có lỗi xảy ra.";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };
  
  const useResultAsInput = useCallback(async (imageUrl) => {
    // ... code giữ nguyên
    const toastId = toast.loading('Đang tải ảnh kết quả...');
    try {
      const response = await fetch(`http://localhost:8000${imageUrl}`);
      const blob = await response.blob();
      const fileName = imageUrl.split('/').pop() || 'result.png';
      const file = new File([blob], fileName, { type: blob.type });

      setSelectedFiles([{
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        fileObject: file
      }]);
      setResult(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('Đã dùng ảnh kết quả làm đầu vào mới.', { id: toastId });
    } catch (error) {
      toast.error('Không thể tải ảnh kết quả.', { id: toastId });
    }
  }, []);


  // --- RENDER LOGIC (SỬA LẠI Ở ĐÂY) ---

  if (!authChecked) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{ className: 'bg-gray-800 text-white' }}/>
      <div className="flex min-h-screen bg-gray-900 text-white">
        {user && <HistoryPanel history={history} onSelect={useResultAsInput} />}

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600 mb-4 md:models/userModelb-0">
              Gemini Image Studio
            </h1>
            <UserProfile user={user} />
          </header>

          {!user ? (
            <div className="text-center p-10 md:p-16 bg-gray-800 rounded-lg max-w-2xl mx-auto shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Chào mừng bạn!</h2>
              <p className="mb-6 text-gray-300">
                Hãy đăng nhập để bắt đầu hành trình sáng tạo hình ảnh không giới hạn với sức mạnh của Gemini.
              </p>
              <UserProfile user={user} />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {/* SỬA LẠI CÁCH TRUYỀN PROPS Ở ĐÂY */}
                <ImageUploader 
                  selectedFiles={selectedFiles}
                  onAddFiles={handleAddFiles}
                  onRemoveFile={handleRemoveFile} 
                />
                
                {/* Phần còn lại của JSX giữ nguyên */}
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium mb-2 text-gray-300">
                    Mô tả ý tưởng của bạn (prompt)
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    rows="4"
                    placeholder="Ví dụ: Biến chú mèo này thành phi hành gia, đang bay lơ lửng trong vũ trụ với các hành tinh phía sau, phong cách digital art..."
                  ></textarea>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-all text-lg shadow-lg hover:shadow-indigo-500/50 transform hover:-translate-y-1"
                >
                  {isLoading ? <><Spinner /> <span className="ml-2">Đang xử lý...</span></> : 'Tạo ảnh'}
                </button>
                
                <ResultDisplay result={result} isLoading={isLoading} />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}