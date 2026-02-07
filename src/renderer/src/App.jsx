import { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import api, { setDeviceToken } from './api/api'
import ThemeProvider from './components/ThemeProvider'
import FullScreenLoader from './components/FullScreenLoader'
import ActivationScreen from './screens/ActivationScreen'
import SplashScreen from './screens/SpalshScreen'
import LockedScreen from './screens/LockedScreen'
import NoActiveElectionScreen from './screens/NoActiveElectionScreen'
import CountdownScreen from './screens/CountdownScreen'
import VoterLoginScreen from './screens/VoterLoginScreen'
import Header from './components/Header'
import BallotScreen from './screens/BallotScreen'
import OfflineScreen from './screens/OfflineScreen'
import axios from 'axios'

const App = () => {
  const [election, setElection] = useState(null)
  const [voterData, setVoterData] = useState(null)
  const [electionLoaded, setElectionLoaded] = useState(false)
  const [hasVerified, setHasVerified] = useState(false)
  const [splashFinished, setSplashFinished] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [backendAlive, setBackendAlive] = useState(false)
  const [systemActivated, setSystemActivated] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState(null)

  const revokeSSERef = useRef(null)

  const currentScreen = (() => {
    if (!splashFinished) return 'splash'
    if (!isOnline || !backendAlive) return 'offline'
    if (!electionLoaded || !hasVerified) return 'loading'
    if (!election) return 'noElection'
    if (!['pre-voting', 'voting'].includes(election.status)) return 'locked'
    if (!systemActivated) return 'activation'
    if (election.status === 'pre-voting') return 'countdown'
    if (!voterData) return 'voterLogin'
    return 'ballot'
  })()

  const fetchElection = async () => {
    try {
      // GET ELECTION DATA
      const res = await api.get('/elections')
      setElection(res.data)
      setElectionLoaded(true)
    } catch (err) {
      toast.error(err.response?.data?.error, {
        id: 'data-fetch-error'
      })
    }
  }

  const screens = {
    splash: (
      <SplashScreen
        onComplete={() => {
          setSplashFinished(true)
        }}
      />
    ),
    offline: (
      <OfflineScreen
        reason={isOnline ? 'backend_unreachable' : 'offline'}
        setBackendAlive={setBackendAlive}
      />
    ),
    loading: <FullScreenLoader />,
    noElection: <NoActiveElectionScreen />,
    locked: <LockedScreen status={election?.status} systemActivated={systemActivated} />,
    activation: (
      <ActivationScreen
        electionId={election?.id}
        onActivated={(info) => {
          setSystemActivated(true)
          setDeviceInfo(info)
        }}
      />
    ),
    countdown: (
      <CountdownScreen
        onCountdownFinish={fetchElection}
        votingStartsAt={election?.voting_start}
        status={election?.status}
      />
    ),
    voterLogin: (
      <VoterLoginScreen
        electionId={election?.id}
        onLoginSuccess={(data) => {
          setVoterData(data)
        }}
      />
    ),
    ballot: (
      <BallotScreen
        voterData={voterData}
        electionId={election?.id}
        onFinish={() => setVoterData(null)}
      />
    )
  }

  useEffect(() => {
    if (!isOnline || !backendAlive) return

    if (!electionLoaded) fetchElection()
  }, [electionLoaded, isOnline, backendAlive])

  useEffect(() => {
    if (!isOnline || !backendAlive) return
    if (hasVerified) return

    const connectRevokeSSE = async () => {
      if (!election?.id) return
      if (revokeSSERef.current) return

      const token = await window.electron.getDeviceToken()
      if (!token) return

      const url = `${import.meta.env.VITE_API_URL}/desktop/elections/${election?.id}/sse/revoke?token=${encodeURIComponent(token)}`

      const es = new EventSource(url)

      revokeSSERef.current = es

      es.onmessage = async (event) => {
        const data = JSON.parse(event.data)

        if (data.action === 'revoke') {
          es.close()
          revokeSSERef.current = null

          await window.electron.removeDeviceToken()

          toast.error('This voting system has been revoked by the admin', {
            id: 'revoke-system'
          })

          setDeviceToken(null)
          setSystemActivated(false)
          delete api.defaults.headers.common['Authorization']
        }
      }

      es.onerror = () => {
        es.close()
        revokeSSERef.current = null
      }
    }

    const verifyToken = async () => {
      try {
        const token = await window.electron.getDeviceToken()

        if (!token) {
          setSystemActivated(false)
          return
        }

        setDeviceToken(token)

        const res = await api.get('/verify')

        setSystemActivated(true)
        setDeviceInfo({ deviceId: res?.data?.deviceId, deviceName: res?.data?.deviceName })

        await connectRevokeSSE()
      } catch (err) {
        const code = err.response?.data?.code

        if (code === 'DEVICE_REVOKED') {
          await window.electron.removeDeviceToken()
        }

        toast.error(err.response?.data?.error || 'Something went wrong', {
          id: 'system-verify-error'
        })

        setDeviceToken(null)
        setSystemActivated(false)
        delete api.defaults.headers.common['Authorization']
      } finally {
        setHasVerified(true)
      }
    }

    verifyToken()

    return () => {
      revokeSSERef.current?.close()
      revokeSSERef.current = null
    }
  }, [isOnline, backendAlive, hasVerified, election?.id])

  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => {
      setIsOnline(false)
      setBackendAlive(false)
    }

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)

    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  useEffect(() => {
    if (!isOnline) return

    const ping = async () => {
      if (!backendAlive) {
        try {
          await axios.get(`${import.meta.env.VITE_API_URL}/healthz`)

          setBackendAlive(true)
        } catch {
          setBackendAlive(false)
        }

        return
      }

      if (election) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/desktop/elections`)

          if (
            new Date(res?.data?.updated_at).getTime() !== new Date(election?.updated_at).getTime()
          ) {
            setElection(res.data)
          } else if (!res.data) {
            setElection(null)
          }

          setBackendAlive(true)
        } catch {
          setBackendAlive(false)
        }
      }
    }

    ping()
    const id = setInterval(ping, 5000)

    return () => clearInterval(id)
  }, [isOnline, election, backendAlive])

  return (
    <ThemeProvider>
      <div className="min-h-dvh w-full bg-bg-light dark:bg-bg-dark text-primary-light dark:text-primary-dark py-3 transition-all duration-100 flex flex-col">
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              'text-center !bg-card-light dark:!bg-card-dark !text-primary-light dark:!text-primary-dark !shadow-xl !border !border-black/10 dark:!border-white/10',
            duration: 3000,
            removeDelay: 1000,
            success: {
              duration: 2500
            }
          }}
        />
        <div className="flex flex-col py-3 px-4 flex-1 min-h-0">
          <div className="max-w-400 mx-auto w-full flex flex-col flex-1 min-h-0">
            {isOnline && backendAlive && (
              <Header
                currentScreen={currentScreen}
                electionName={election?.name}
                systemActivated={systemActivated}
                deviceInfo={deviceInfo}
              />
            )}
            {screens[currentScreen] || <FullScreenLoader />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
export default App
