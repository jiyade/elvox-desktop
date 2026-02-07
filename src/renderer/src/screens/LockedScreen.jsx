import Button from '../components/Button'

const LockedScreen = ({ status, systemActivated }) => {
  return (
    <div className="flex items-center flex-1 md:px-3 lg:px-7 text-sm gap-6 sm:py-3">
      <div className="flex flex-col items-center gap-8 px-3 py-10 w-full">
        <div className="flex flex-col gap-2 justify-center">
          {['draft', 'nominations'].includes(status) && (
            <>
              <h2 className="text-center text-primary-light dark:text-primary-dark text-2xl md:text-3xl lg:text-4xl font-black">
                Activation Unavailable
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark text-base">
                This election has not yet reached the system activation phase
              </p>
            </>
          )}
          {['post-voting', 'closed'].includes(status) &&
            (systemActivated ? (
              <>
                <h2 className="text-center text-primary-light dark:text-primary-dark text-2xl md:text-3xl lg:text-4xl font-black">
                  Voting Concluded
                </h2>
                <p className="text-secondary-light dark:text-secondary-dark text-base">
                  The voting process has ended. No further actions are available at this stage
                </p>
              </>
            ) : (
              <>
                <h2 className="text-center text-primary-light dark:text-primary-dark text-2xl md:text-3xl lg:text-4xl font-black">
                  Activation Unavailable
                </h2>
                <p className="text-secondary-light dark:text-secondary-dark text-base">
                  The voting phase has concluded. System activation is no longer available
                </p>
              </>
            ))}
        </div>
        <Button
          className="flex flex-col justify-center items-center py-3 px-6 gap-1 bg-accent hover:bg-button-hover"
          onClick={() => window.electron.quitApp()}
        >
          Exit the App
        </Button>
      </div>
    </div>
  )
}

export default LockedScreen
