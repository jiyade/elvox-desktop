import { useState } from 'react'
import logo from '../assets/images/logo.png'
import logoNoText from '../assets/images/logo-no-text.png'

const Logo = ({ width, height, className, onClick, textless = false }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src={!textless ? logo : logoNoText}
      alt="logo"
      width={width}
      height={height}
      className={className}
      onLoad={() => setLoaded(true)}
      onClick={onClick}
      style={{ display: loaded ? 'block' : 'none' }}
    />
  )
}

export default Logo
