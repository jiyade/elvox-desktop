import { useEffect, useState } from 'react'
import { formatRemaining } from '../utils/formatRemainingTime'

const CountdownScreen = ({ votingStartsAt, onCountdownFinish, status }) => {
  const targetMs = new Date(votingStartsAt).getTime()

  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, targetMs - Date.now()))

  useEffect(() => {
    const id = setInterval(() => {
      setRemainingMs(Math.max(0, targetMs - Date.now()))
    }, 1000)

    return () => clearInterval(id)
  }, [targetMs])

  useEffect(() => {
    if (remainingMs !== 0) return
    if (status !== 'pre-voting') return

    const id = setInterval(() => {
      onCountdownFinish()
    }, 2000)

    return () => clearInterval(id)
  }, [remainingMs, onCountdownFinish, status])

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        {remainingMs > 0 && (
          <>
            <p className="">Voting starts in</p>
            <p className="text-7xl">{formatRemaining(remainingMs)}</p>
          </>
        )}
        {remainingMs === 0 && (
          <div className="flex flex-col gap-3">
            <p>Waiting for system to open voting…</p>
            <div className="flex items-center justify-center flex-1">
              <div className="w-4.5 h-4.5 border border-b-transparent dark:border-b-transparent border-accent dark:border-[#ab8cff] rounded-full inline-block loader" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CountdownScreen
