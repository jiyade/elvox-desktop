import FullScreenLoader from '../components/FullScreenLoader'
import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button'
import toast from 'react-hot-toast'
import api from '../api/api'

const VoterLoginScreen = ({ onLoginSuccess, electionId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [admno, setAdmno] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState(null)

  const admnoRef = useRef(null)
  const otpRef = useRef(null)

  const verifyVoter = async () => {
    if (!admno || !otp) {
      setError({
        admno: admno ? '' : 'Admission number is required',
        otp: otp ? '' : 'OTP is required'
      })

      if (!admno) admnoRef?.current?.focus()
      else otpRef?.current?.focus()

      return
    }
    setError(null)

    try {
      setIsLoading(true)

      const res = await api.patch('/voters/authenticate', {
        admno,
        otp,
        electionId
      })

      const { votingToken, classId } = res.data

      if (!votingToken) throw new Error('Voting token missing')

      toast.success('Verification successful. You can now cast your vote')

      onLoginSuccess({ admno, classId, votingToken })
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Something went wrong'

      toast.error(message, {
        id: 'voter-login-error'
      })
    } finally {
      setIsLoading(false)
      setAdmno('')
      setOtp('')
    }
  }

  useEffect(() => {
    if (!admnoRef.current) return

    admnoRef.current.focus()
  }, [])

  return (
    <div className="flex flex-1">
      <div className="flex flex-col justify-center gap-10 items-center w-full relative">
        <div className="w-11/12 md:w-9/12 lg:w-7/12 xl:w-5/12 2xl:w-4/12 bg-card-light dark:bg-card-dark rounded-sm shadow-lg flex flex-col items-center gap-6 px-10 py-11">
          <h2 className={`text-primary-light dark:text-primary-dark text-center font-bold text-xl`}>
            Voter Login
          </h2>
          <div className="flex flex-col flex-1 gap-4 w-full">
            <div className="flex flex-col gap-1 space-y-1">
              <label htmlFor="admno" className="text-sm">
                Enter your admission number
              </label>
              <input
                type="text"
                id="admno"
                value={admno}
                onChange={(e) => setAdmno(e.target.value)}
                className={`outline-none border-none rounded-sm text-sm w-full h-10 px-3 placeholder:text-secondary-light dark:placeholder:text-secondary-dark ${
                  isLoading
                    ? 'cursor-not-allowed bg-[#c0c0c2] dark:bg-[#2a2e34] text-[#454649] dark:text-[#c7cad2]'
                    : 'bg-field-light dark:bg-field-dark text-primary-light dark:text-primary-dark'
                }`}
                placeholder="Enter your admission number"
                disabled={isLoading}
                ref={admnoRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (admno === '') {
                      setError((errors) => ({
                        ...errors,
                        admno: 'Admission number is required'
                      }))
                      return
                    } else {
                      setError((errors) => ({
                        ...errors,
                        admno: ''
                      }))
                    }
                    if (otp === '') {
                      otpRef?.current?.focus()
                      return
                    }

                    verifyVoter()
                  }
                }}
              />
              {error?.admno && <p className="text-xs text-red-500 mt-1">{error?.admno}</p>}
            </div>
            <div className="flex flex-col gap-1 space-y-1">
              <label htmlFor="otp" className="text-sm">
                Enter the OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`outline-none border-none rounded-sm text-sm w-full h-10 px-3 placeholder:text-secondary-light dark:placeholder:text-secondary-dark ${
                  isLoading
                    ? 'cursor-not-allowed bg-[#c0c0c2] dark:bg-[#2a2e34] text-[#454649] dark:text-[#c7cad2]'
                    : 'bg-field-light dark:bg-field-dark text-primary-light dark:text-primary-dark'
                }`}
                placeholder="Enter the OTP"
                disabled={isLoading}
                ref={otpRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') verifyVoter()
                }}
              />
              {error?.otp && <p className="text-xs text-red-500 mt-1">{error?.otp}</p>}
            </div>
            <Button
              text="Verify"
              className="p-2.5 mt-2 text-sm bg-accent hover:bg-button-hover"
              type="button"
              onClick={verifyVoter}
            />
          </div>
        </div>
      </div>
      {isLoading && <FullScreenLoader />}
    </div>
  )
}

export default VoterLoginScreen
