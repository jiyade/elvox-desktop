import { useEffect } from 'react'
import Logo from '../components/Logo'

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="bg-bg-light dark:bg-bg-dark flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-6 animate-pulse-in">
        <div className="flex flex-col items-center gap-2">
          <Logo width={150} height={150} textless />
          <h1 className="text-4xl font-bold text-primary-light dark:text-primary-dark">Elvox</h1>
        </div>
        <p className="text-secondary-light dark:text-secondary-dark text-sm">
          Digital Election Management System
        </p>
      </div>
    </div>
  )
}

export default SplashScreen
