import { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import api, { setDeviceToken } from './api/api'
import FullScreenLoader from './components/FullScreenLoader'
import ActivationScreen from './screens/ActivationScreen'
import SplashScreen from './screens/SpalshScreen'
import LockedScreen from './screens/LockedScreen'
import NoActiveElectionScreen from './screens/NoActiveElectionScreen'
import CountdownScreen from './screens/CountdownScreen'
import VoterLoginScreen from './screens/VoterLoginScreen'

const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const root = window.document.documentElement

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    if (darkModeQuery.matches) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    const handleThemeChange = (e) => {
      if (e.matches) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    darkModeQuery.addEventListener('change', handleThemeChange)

    return () => {
      darkModeQuery.removeEventListener('change', handleThemeChange)
    }
  }, [])

  return children
}

const App = () => {
  //const [currentScreen, setCurrentScreen] = useState('splash')
  const [election, setElection] = useState(null)
  const [voterData, setVoterData] = useState(null)
  const [electionLoaded, setElectionLoaded] = useState(false)
  const [splashFinished, setSplashFinished] = useState(false)
  const [systemActivated, setSystemActivated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const hasVerifiedRef = useRef(false)

  const currentScreen = (() => {
    if (!splashFinished) return 'splash'
    if (!electionLoaded) return 'loading'
    if (!election) return 'noElection'
    if (!['pre-voting', 'voting'].includes(election.status)) return 'locked'
    if (!systemActivated) return 'activation'
    if (election.status === 'pre-voting') return 'countdown'
    if (!voterData) return 'login'
    return 'voting'
  })()

  const effectiveCurrentScreen = isLoading ? 'loading' : currentScreen

  const screens = {
    splash: (
      <SplashScreen
        onComplete={() => {
          setSplashFinished(true)
        }}
      />
    ),
    loading: <FullScreenLoader />,
    noElection: <NoActiveElectionScreen />,
    locked: <LockedScreen status={election?.status} />,
    activation: (
      <ActivationScreen
        electionId={election?.id}
        onActivated={() => {
          setSystemActivated(true)
        }}
      />
    ),
    countdown: <CountdownScreen onVotingStart={() => {}} />,
    login: (
      <VoterLoginScreen
        onLoginSuccess={(data) => {
          setVoterData(data)
        }}
      />
    )
    // ballot: <BallotScreen voterData={voterData} onVoteSuccess={() => setCurrentScreen('login')} />
  }

  useEffect(() => {
    const fetchData = async () => {
      if (electionLoaded) return

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

    fetchData()
  }, [splashFinished, electionLoaded])

  useEffect(() => {
    if (currentScreen === 'splash') return
    if (hasVerifiedRef.current) return

    hasVerifiedRef.current = true

    const verifyToken = async () => {
      try {
        setIsLoading(true)
        const token = await window.electron.getDeviceToken()

        if (!token) {
          setSystemActivated(false)
          return
        }

        setDeviceToken(token)

        await api.get('/verify')

        setSystemActivated(true)
      } catch (err) {
        toast.error(err.response?.data?.error, {
          id: 'system-verify-error'
        })

        await window.electron.removeDeviceToken()

        setDeviceToken(null)
        setSystemActivated(false)
        delete api.defaults.headers.common['Authorization']
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [currentScreen])

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
          {/* <Header /> */}
          <div className="max-w-400 mx-auto w-full flex flex-col flex-1 min-h-0">
            {screens[effectiveCurrentScreen] || <FullScreenLoader />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
export default App
