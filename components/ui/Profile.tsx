// components/ui/Profile.tsx
import Image from 'next/image';
import { Profile as LineProfile } from '@liff/get-profile';

interface ProfileProps {
  profile: LineProfile;
}

export function Profile({ profile }: ProfileProps) {
  return (
    <div className="mb-4">
      <div className="relative w-20 h-20 mb-2">
        {profile.pictureUrl ? (
          <Image
            src={profile.pictureUrl}
            alt="個人頭像"
            fill
            sizes="80px"
            className="rounded-full object-cover"
            priority
          />
        ) : (
          // 如果沒有圖片，顯示預設的個人圖示
          <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-gray-800">名稱: {profile.displayName}</p>
      {profile.statusMessage && (
        <p className="text-gray-600">狀態訊息: {profile.statusMessage}</p>
      )}
      <p className="text-gray-600 text-sm">使用者ID: {profile.userId}</p>
    </div>
  );
}