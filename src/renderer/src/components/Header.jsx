import Logo from './Logo'

const Header = ({ currentScreen, electionName, systemActivated, deviceInfo }) => {
  if (['splash', 'loading', 'noElection', ''].includes(currentScreen)) return null

  return (
    <div className="flex items-center justify-between w-full py-2">
      <div className="flex items-center gap-3">
        <Logo textless className="w-12" />
        <h1 className="text-lg font-bold">{electionName}</h1>
      </div>

      {!systemActivated && (
        <div className="flex items-center">
          <span className="bg-red-400/40 dark:bg-red-400/20 text-red-600 dark:text-red-400 ring-1 ring-red-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium">
            Not activated
          </span>
        </div>
      )}
      {systemActivated && (
        <div className="flex items-center gap-4">
          <p>{deviceInfo?.deviceName}</p>
          <p className="bg-green-400/30 dark:bg-green-400/20 text-green-500 dark:text-green-400 ring-1 ring-green-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium">
            <span>Activated</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default Header
