import Logo from '../components/Logo'
import FullScreenLoader from '../components/FullScreenLoader'
import { useState } from 'react'

const ActivationScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <>
      <div className="flex flex-col justify-center gap-10 items-center w-full relative bg-bg-light dark:bg-bg-dark py-3">
        <title>System Activation</title>
        <div className="">
          <Logo width={150} height={150} />
        </div>
        <div className="w-11/12 md:w-9/12 lg:w-7/12 xl:w-5/12 2xl:w-4/12 bg-card-light dark:bg-card-dark rounded-sm shadow-lg flex flex-col items-center gap-10 px-10 py-11">
          <h2 className={`text-primary-light dark:text-primary-dark text-center font-bold text-xl`}>
            System Activation
          </h2>
          <div>
            <div className="space-y-1">
              <input
                type="text"
                id="secret-key"
                className={`outline-none border-none rounded-md w-full h-10 px-3 placeholder:text-secondary-light dark:placeholder:text-secondary-dark ${
                  isLoading
                    ? 'cursor-not-allowed bg-[#c0c0c2] dark:bg-[#2a2e34] text-[#454649] dark:text-[#c7cad2]'
                    : 'bg-field-light dark:bg-field-dark text-primary-light dark:text-primary-dark'
                }`}
                placeholder="Enter the secret key"
                disabled={isLoading}
              />
              {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
            </div>
          </div>
        </div>
      </div>
      {isLoading && <FullScreenLoader />}
    </>
  )
}

export default ActivationScreen
