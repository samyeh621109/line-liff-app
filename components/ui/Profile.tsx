// components/ui/Profile.tsx
import Image from 'next/image';
import { Profile as LineProfile } from '@liff/get-profile';
import { User } from 'lucide-react'; // 使用 lucide-react 的圖示

interface ProfileProps {
  profile: LineProfile;
}

export function Profile({ profile }: ProfileProps) {
  return (
    <div className="mb-4">
      <div className="relative w-20 h-20 mb-2">
        {profile.pictureUrl ? (
          // 有大頭貼時顯示用戶圖片
          <Image
            src={profile.pictureUrl}
            alt={`${profile.displayName} 的大頭貼`}
            fill
            sizes="80px"
            className="rounded-full object-cover"
            priority
            style={{ maxWidth: '80px', maxHeight: '80px' }}
          />
        ) : (
          // 沒有大頭貼時顯示預設圖示
          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <User 
              size={40} 
              className="text-gray-400"
            />
          </div>
        )}
      </div>
      <p className="text-gray-800 font-medium">{profile.displayName}</p>
      {profile.statusMessage ? (
        <p className="text-gray-600 text-sm">{profile.statusMessage}</p>
      ) : (
        <p className="text-gray-400 text-sm italic">未設定狀態訊息</p>
      )}
      <p className="text-gray-500 text-xs mt-1">ID: {profile.userId}</p>
    </div>
  );
}