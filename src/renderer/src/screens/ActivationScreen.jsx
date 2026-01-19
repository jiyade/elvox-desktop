import Logo from '../components/Logo'
import FullScreenLoader from '../components/FullScreenLoader'
import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button'
import toast from 'react-hot-toast'
import api from '../api/api'

const ActivationScreen = ({ onActivated, electionId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [secretKey, setSecretKey] = useState('')
  const [error, setError] = useState('')

  const inpRef = useRef(null)

  const activateSystem = async () => {
    if (!secretKey) {
      setError('Secret key is required')
      return
    }
    setError('')

    try {
      setIsLoading(true)

      const deviceId = await window.electron.getDeviceId()

      const res = await api.post(`/elections/${electionId}/secret-key/verify`, {
        secretKey,
        deviceId
      })

      await window.electron.saveDeviceToken(res?.data?.deviceToken)
      toast.success(res?.data?.message)

      onActivated()
    } catch (err) {
      toast.error(err.response?.data?.error, {
        id: 'system-activate-error'
      })
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!inpRef.current) return

    inpRef.current.focus()
  }, [])

  return (
    <div className="flex flex-1">
      <div className="flex flex-col justify-center gap-10 items-center w-full relative">
        <title>System Activation</title>
        <div className="">
          <Logo width={150} height={150} />
        </div>
        <div className="w-11/12 md:w-9/12 lg:w-7/12 xl:w-5/12 2xl:w-4/12 bg-card-light dark:bg-card-dark rounded-sm shadow-lg flex flex-col items-center gap-6 px-10 py-11">
          <h2 className={`text-primary-light dark:text-primary-dark text-center font-bold text-xl`}>
            System Activation
          </h2>
          <div className="flex flex-col flex-1 gap-4 w-full">
            <div className="flex flex-col gap-1 space-y-1">
              <label htmlFor="secret-key" className="text-sm">
                Enter the secret key
              </label>
              <input
                type="text"
                id="secret-key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className={`outline-none border-none rounded-sm text-sm w-full h-10 px-3 placeholder:text-secondary-light dark:placeholder:text-secondary-dark ${
                  isLoading
                    ? 'cursor-not-allowed bg-[#c0c0c2] dark:bg-[#2a2e34] text-[#454649] dark:text-[#c7cad2]'
                    : 'bg-field-light dark:bg-field-dark text-primary-light dark:text-primary-dark'
                }`}
                placeholder="Enter the secret key"
                disabled={isLoading}
                ref={inpRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') activateSystem()
                }}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
            <Button
              text="Activate"
              className="p-2 text-sm bg-accent hover:bg-button-hover"
              type="button"
              onClick={activateSystem}
            />
          </div>
        </div>
      </div>
      {isLoading && <FullScreenLoader />}
    </div>
  )
}

export default ActivationScreen
