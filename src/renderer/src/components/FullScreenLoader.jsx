import { useEffect } from 'react'
import Loader from './Loader'

const FullScreenLoader = () => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden')

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  return (
    <div
      className={`flex justify-center items-center z-50 inset-0 h-screen bg-bg-light/70 dark:bg-bg-dark/70 fixed`}
    >
      <Loader />
    </div>
  )
}

export default FullScreenLoader
