// app/components/ResultDisplay.js
import Spinner from './Spinner';

export default function ResultDisplay({ result, isLoading }) {
  const BACKEND_URL = 'http://localhost:8000';

  return (
    <div className="mt-6 bg-gray-800 rounded-lg p-4 min-h-[300px] flex justify-center items-center">
      {isLoading ? (
        <div className="flex flex-col items-center text-gray-400">
          <Spinner />
          <p className="mt-2">AI đang sáng tạo, vui lòng chờ...</p>
        </div>
      ) : result?.imageUrl ? (
        <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Kết quả của bạn</h3>
            <img
                src={`${BACKEND_URL}${result.imageUrl}`}
                alt="Generated result"
                className="max-w-full max-h-[400px] rounded-lg shadow-lg"
            />
            <p className="mt-4 text-sm text-gray-400 p-3 bg-gray-900 rounded-md">{result.result}</p>
        </div>
      ) : (
        <p className="text-gray-500">Kết quả của bạn sẽ xuất hiện ở đây.</p>
      )}
    </div>
  );
}