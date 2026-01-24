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
        <div className="flex items-center gap-1 text-base">
          <span className="text-red-500">●</span>
          <span>Not activated</span>
        </div>
      )}
      {systemActivated && (
        <div className="flex items-center gap-4">
          <p>{deviceInfo?.deviceName}</p>
          <p className="flex items-center gap-1 text-base">
            <span className="text-green-500">●</span>
            <span>Activated</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default Header
