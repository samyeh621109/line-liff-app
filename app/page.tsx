'use client'
import { useEffect, useState } from 'react'
import { Profile as LineProfile } from '@liff/get-profile'
import { Profile } from '@/components/ui/Profile'
import { Button } from '@/components/ui/Button'
import { initializeLiff } from '@/lib/liff'
import { db, setDoc, doc } from '@/lib/firebase'
import type { Liff } from '@line/liff'

export default function Home() {
  const [profile, setProfile] = useState<LineProfile | null>(null)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const liff: Liff = await initializeLiff(process.env.NEXT_PUBLIC_LIFF_ID as string)
        if (liff.isLoggedIn()) {
          setIsLoggedIn(true)
          const userProfile = await liff.getProfile()
          setProfile(userProfile)
          await saveUserToFirestore(userProfile)
        }
      } catch {
        setError('LIFF 初始化失敗')
      }
    }
    init()
  }, [])

  const handleLogin = async () => {
    const liff = (window as unknown as { liff: Liff }).liff
    try {
      if (!liff.isLoggedIn()) {
        liff.login()
      } else {
        const userProfile = await liff.getProfile()
        setProfile(userProfile)
        setIsLoggedIn(true)
        await saveUserToFirestore(userProfile)
      }
    } catch {
      setError('登入失敗')
    }
  }

  const handleLogout = () => {
    const liff = (window as unknown as { liff: Liff }).liff
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
    
  const saveUserToFirestore = async (user: LineProfile) => {
    try {
      await setDoc(doc(db, 'users', user.userId), {
        userId: user.userId,
        displayName: user.displayName,
        pictureUrl: user.pictureUrl || '',
        statusMessage: user.statusMessage || '',
        timestamp: new Date(),
      })
    } catch (err) {
      console.error('Firestore 儲存失敗', err)
      setError('資料儲存失敗')
    }
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">智聯辦公系統</h1>
      
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
