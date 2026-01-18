import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import ActivationScreen from './screens/ActivationScreen'

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
  const [currentScreen, setCurrentScreen] = useState('activation')
  const [electionStatus, setElectionStatus] = useState(null)
  const [voterData, setVoterData] = useState(null)

  const screens = {
    // splash: <SplashScreen onComplete={() => setCurrentScreen('loading')} />,
    // loading: (
    //   <LoadingScreen
    //     onComplete={(status) => {
    //       setElectionStatus(status)
    //       // Navigate based on status
    //     }}
    //   />
    // ),
    activation: (
      <ActivationScreen
        onActivated={() => {
          // Navigate based on election status
        }}
      />
    )
    // locked: <LockedScreen status={electionStatus} />,
    // countdown: <CountdownScreen onVotingStart={() => setCurrentScreen('login')} />,
    // login: (
    //   <VoterLoginScreen
    //     onLoginSuccess={(data) => {
    //       setVoterData(data)
    //       setCurrentScreen('ballot')
    //     }}
    //   />
    // ),
    // ballot: <BallotScreen voterData={voterData} onVoteSuccess={() => setCurrentScreen('login')} />
  }

  // Render the current screen (with fallback)
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
            {/* {screens[currentScreen] || <LoadingScreen />} */}
            {screens[currentScreen]}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
export default App
