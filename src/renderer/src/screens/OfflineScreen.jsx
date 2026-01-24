import Button from '../components/Button'
import Logo from '../components/Logo'

const OfflineScreen = ({ reason, ping }) => {
  if (reason === 'offline')
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="flex flex-col items-center gap-2">
          <Logo className="w-20 h-20" textless />

          <div className="text-center flex items-center flex-col gap-1">
            <p className="text-base">No Internet Connection</p>
            <p className="text-secondary-light dark:text-secondary-dark text-sm">
              Elvox requires an active internet connection
            </p>
          </div>
        </div>
      </div>
    )

  if (reason === 'backend_unreachable')
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="flex flex-col items-center gap-2">
          <Logo className="w-20 h-20" textless />

          <div className="text-center flex items-center flex-col gap-1">
            <p className="text-base">Reconnecting to Election Server</p>
            <p className="text-secondary-light dark:text-secondary-dark text-sm">
              This usually resolves in a moment. Please stay on this screen
            </p>
          </div>

          <Button
            text="Retry"
            className="p-1.5 px-3.5 text-sm mt-2 bg-accent hover:bg-button-hover rounded-sm"
            onClick={ping}
          />
        </div>
      </div>
    )
}

export default OfflineScreen
