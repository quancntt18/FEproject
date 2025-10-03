// app/page.js
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import ImageUploader from './components/ImageUploader';
import HistoryPanel from './components/HistoryPanel';
import ResultDisplay from './components/ResultDisplay';
import UserProfile from './components/UserProfile';
import toast, { Toaster } from 'react-hot-toast';
import Spinner from './components/Spinner';

export default function Home() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // Trạng thái kiểm tra đăng nhập
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Hàm lấy lịch sử, chỉ gọi khi đã đăng nhập
  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/image/history');
      setHistory(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử:", error);
    }
  };

  // Kiểm tra thông tin đăng nhập khi tải trang
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/current_user');
        if (res.data) {
          setUser(res.data);
          fetchHistory();
        }
      } catch (error) {
        console.log("Người dùng chưa đăng nhập");
      } finally {
        setAuthChecked(true); // Đánh dấu đã kiểm tra xong
      }
    };
    fetchUser();
  }, []);

  // Xử lý sự kiện tạo ảnh
  const handleGenerate = async () => {
    if (selectedFiles.length === 0) {
      return toast.error('Vui lòng chọn ít nhất 1 ảnh.');
    }
    if (!prompt.trim()) {
      return toast.error('Vui lòng nhập mô tả ý tưởng.');
    }

    setIsLoading(true);
    setResult(null);
    const loadingToast = toast.loading('Đang gửi yêu cầu...');

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('images', file.fileObject); // Gửi File object thật
    });
    formData.append('prompt', prompt);

    try {
      const res = await api.post('/api/image/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
      toast.success('Tạo ảnh thành công!', { id: loadingToast });
      fetchHistory(); // Cập nhật lại lịch sử
    } catch (error) {
      const errorMessage = error.response?.data || "Đã có lỗi xảy ra.";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sử dụng ảnh kết quả làm ảnh đầu vào mới
  const useResultAsInput = async (imageUrl) => {
    const toastId = toast.loading('Đang tải ảnh kết quả...');
    try {
      const response = await fetch(`http://localhost:8000${imageUrl}`);
      const blob = await response.blob();
      const fileName = imageUrl.split('/').pop() || 'result.png';
      const file = new File([blob], fileName, { type: blob.type });

      // Cập nhật state với object chứa URL và File object
      setSelectedFiles([{
        previewUrl: URL.createObjectURL(file),
        fileObject: file
      }]);
      setResult(null);
      window.scrollTo(0, 0); // Cuộn lên đầu trang
      toast.success('Đã dùng ảnh kết quả làm đầu vào mới.', { id: toastId });
    } catch (error) {
      toast.error('Không thể tải ảnh kết quả.', { id: toastId });
    }
  };

  // Cập nhật ImageUploader để quản lý cả URL xem trước và File object
  const handleSetSelectedFiles = (newFiles) => {
    const fileObjects = newFiles.map(file => ({
        previewUrl: URL.createObjectURL(file),
        fileObject: file
    }));
    setSelectedFiles(fileObjects);
  }

  // Giao diện chờ trong khi kiểm tra đăng nhập
  if (!authChecked) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex min-h-screen">
        {user && <HistoryPanel history={history} onSelect={useResultAsInput} />}

        <main className="flex-1 p-6 md:p-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">Gemini Image Studio</h1>
            <UserProfile user={user} />
          </header>

          {!user ? (
            <div className="text-center p-10 md:p-16 bg-gray-800 rounded-lg max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Chào mừng bạn!</h2>
              <p className="mb-6 text-gray-300">
                Hãy đăng nhập bằng tài khoản Google để bắt đầu hành trình sáng tạo hình ảnh không giới hạn với Gemini.
              </p>
              <UserProfile user={user} />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                <ImageUploader selectedFiles={selectedFiles.map(f => f.fileObject)} setSelectedFiles={handleSetSelectedFiles} />
                
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium mb-2 text-gray-300">
                    Mô tả ý tưởng của bạn (prompt)
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows="3"
                    placeholder="Ví dụ: Một chú mèo phi hành gia đang cưỡi tên lửa trên dải ngân hà, phong cách tranh sơn dầu..."
                  ></textarea>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-lg"
                >
                  {isLoading && <Spinner />}
                  {isLoading ? 'Đang xử lý...' : 'Tạo ảnh'}
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