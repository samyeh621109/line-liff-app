'use client'
import { useEffect, useState } from 'react'
import { Profile as LineProfile } from '@liff/get-profile'
import { Profile } from '@/components/ui/Profile'
import { Button } from '@/components/ui/Button'
import { initializeLiff } from '@/lib/liff'
import { db, setDoc, doc } from '@/lib/firebase'
import type { Liff } from '@line/liff'

export default function Home() {
  const [liff, setLiff] = useState<Liff | null>(null)
  const [profile, setProfile] = useState<LineProfile | null>(null)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID
  if (!liffId) {
    setError('LIFF ID 未設定')
    setIsLoading(false)
    return
  }

  if (!db) {
    setError('資料庫連線失敗')
    setIsLoading(false)
    return
  }

  const init = async () => {
    try {
      const liffInstance = await initializeLiff(liffId) // ✅ 這裡不會再報錯
      setLiff(liffInstance)

      if (liffInstance.isLoggedIn()) {
        setIsLoggedIn(true)
        const userProfile = await liffInstance.getProfile()
        setProfile(userProfile)
        await saveUserToFirestore(userProfile)
      }
    } catch (err) {
      console.error('初始化錯誤:', err)
      setError('LIFF 初始化失敗')
    } finally {
      setIsLoading(false)
    }
  }

  init()
}, [])


  const handleLogin = async () => {
    if (!liff) {
      setError('LIFF 未初始化')
      return
    }

    try {
      if (!liff.isLoggedIn()) {
        await liff.login()
      }
      const userProfile = await liff.getProfile()
      setProfile(userProfile)
      setIsLoggedIn(true)
      await saveUserToFirestore(userProfile)
    } catch (err) {
      console.error('登入錯誤:', err)
      setError('登入失敗')
    }
  }

  const handleLogout = () => {
    if (!liff) {
      setError('LIFF 未初始化')
      return
    }

    try {
      if (liff.isLoggedIn()) {
        liff.logout()
        setIsLoggedIn(false)
        setProfile(null)
      }
    } catch (err) {
      console.error('登出錯誤:', err)
      setError('登出失敗')
    }
  }

  const saveUserToFirestore = async (user: LineProfile) => {
    if (!db) {
      console.error('Firestore not initialized')
      setError('資料庫連線失敗')
      return
    }

    try {
      const userRef = doc(db, 'users', user.userId)
      await setDoc(userRef, {
        userId: user.userId,
        displayName: user.displayName,
        pictureUrl: user.pictureUrl || '',
        statusMessage: user.statusMessage || '',
        timestamp: new Date(),
        lastLogin: new Date(),
      }, { merge: true })
    } catch (err) {
      console.error('Firestore error:', err)
      setError('資料儲存失敗')
      if (err instanceof Error) {
        console.error('Error details:', err.message)
      }
    }
  }

  if (isLoading) {
    return (
      <main className="p-4">
        <div className="flex items-center justify-center">
          <span className="text-gray-500">載入中...</span>
        </div>
      </main>
    )
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">智聯辦公系統</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!isLoggedIn ? (
        <Button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? '載入中...' : 'LINE 登入'}
        </Button>
      ) : (
        <div className="space-y-4">
          {profile && <Profile profile={profile} />}
          <Button onClick={handleLogout} variant="danger">
            登出
          </Button>
        </div>
      )}
    </main>
  )
}