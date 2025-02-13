'use client'
import { useEffect, useState } from 'react'
import { Profile as LineProfile } from '@liff/get-profile'
import { Profile } from '@/components/ui/Profile'
import { Button } from '@/components/ui/Button'
import { initializeLiff } from '@/lib/liff'

export default function Home() {
  const [profile, setProfile] = useState<LineProfile | null>(null)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const liff = await initializeLiff(process.env.NEXT_PUBLIC_LIFF_ID as string)
        if (liff.isLoggedIn()) {
          setIsLoggedIn(true)
          const userProfile = await liff.getProfile()
          setProfile(userProfile)
        }
      } catch {
        setError('LIFF 初始化失敗')
      }
    }
    init()
  }, [])

  const handleLogin = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const liff = (window as any).liff
    try {
      if (!liff.isLoggedIn()) {
        liff.login()
      }
    } catch {
      setError('登入失敗')
    }
  }

  const handleLogout = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const liff = (window as any).liff
    try {
      if (liff.isLoggedIn()) {
        liff.logout()
        setIsLoggedIn(false)
        setProfile(null)
      }
    } catch {
      setError('登出失敗')
    }
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">LINE LIFF 應用</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {!isLoggedIn ? (
        <Button onClick={handleLogin}>LINE 登入</Button>
      ) : (
        <div>
          {profile && <Profile profile={profile} />}
          <Button onClick={handleLogout} variant="danger">登出</Button>
        </div>
      )}
    </main>
  )
}
