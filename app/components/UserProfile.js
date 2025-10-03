// app/components/UserProfile.js
export default function UserProfile({ user }) {
  const BACKEND_URL = 'http://localhost:8000';

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-gray-300">Chào, {user.displayName}</span>
        <a
          href={`${BACKEND_URL}/auth/logout`}
          className="bg-gray-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Đăng xuất
        </a>
      </div>
    );
  }

  return (
    <a
      href={`${BACKEND_URL}/auth/google`}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
    >
      Đăng nhập với Google
    </a>
  );
}