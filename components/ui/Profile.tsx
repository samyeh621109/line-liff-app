import Image from 'next/image';
import { Profile as LineProfile } from '@liff/get-profile';

interface ProfileProps {
  profile: LineProfile;
}

export function Profile({ profile }: ProfileProps) {
  // 提供預設圖片 URL
  const pictureUrl = profile.pictureUrl ?? '/default-profile.png';

  return (
    <div className="mb-4">
      <Image
        src={pictureUrl}
        alt="個人頭像"
        width={80}   // 根據需求調整尺寸
        height={80}  // 根據需求調整尺寸
        className="w-20 h-20 rounded-full mb-2"
      />
      <p>名稱: {profile.displayName}</p>
      <p>狀態訊息: {profile.statusMessage}</p>
      <p>使用者ID: {profile.userId}</p>
    </div>
  );
}
