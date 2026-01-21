import Logo from '../components/Logo'
import FullScreenLoader from '../components/FullScreenLoader'
import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button'
import toast from 'react-hot-toast'
import api, { setDeviceToken } from '../api/api'

const ActivationScreen = ({ onActivated, electionId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [deviceName, setDeviceName] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [error, setError] = useState(null)

  const deviceNameRef = useRef(null)
  const secretKeyRef = useRef(null)

  const activateSystem = async () => {
    if (!deviceName || !secretKey) {
      setError({
        deviceName: deviceName ? '' : 'Device name is required',
        secretKey: secretKey ? '' : 'Secret key is required'
      })

      if (!deviceName) deviceNameRef?.current?.focus()
      else secretKeyRef?.current?.focus()

      return
    }
    setError(null)

    try {
      setIsLoading(true)

      const deviceId = await window.electron.getDeviceId()

      const res = await api.post(`/elections/${electionId}/secret-key/verify`, {
        deviceName,
        secretKey,
        deviceId
      })

      await window.electron.saveDeviceToken(res?.data?.deviceToken)
      setDeviceToken(res?.data?.deviceToken)
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
    if (!deviceNameRef.current) return

    deviceNameRef.current.focus()
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
              <label htmlFor="device-name" className="text-sm">
                Enter the device name
              </label>
              <input
                type="text"
                id="device-name"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className={`outline-none border-none rounded-sm text-sm w-full h-10 px-3 placeholder:text-secondary-light dark:placeholder:text-secondary-dark ${
                  isLoading
                    ? 'cursor-not-allowed bg-[#c0c0c2] dark:bg-[#2a2e34] text-[#454649] dark:text-[#c7cad2]'
                    : 'bg-field-light dark:bg-field-dark text-primary-light dark:text-primary-dark'
                }`}
                placeholder="Enter the device name"
                disabled={isLoading}
                ref={deviceNameRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (deviceName === '') {
                      setError((errors) => ({
                        ...errors,
                        deviceName: 'Device name is required'
                      }))
                      return
                    } else {
                      setError((errors) => ({
                        ...errors,
                        deviceName: ''
                      }))
                    }
                    if (secretKey === '') {
                      secretKeyRef?.current?.focus()
                      return
                    }

                    activateSystem()
                  }
                }}
              />
              {error?.deviceName && (
                <p className="text-xs text-red-500 mt-1">{error?.deviceName}</p>
              )}
            </div>
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
                ref={secretKeyRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') activateSystem()
                }}
              />
              {error?.secretKey && <p className="text-xs text-red-500 mt-1">{error?.secretKey}</p>}
            </div>
            <Button
              text="Activate"
              className="p-2.5 mt-2 text-sm bg-accent hover:bg-button-hover"
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
