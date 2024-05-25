import '@renderer/assets/main.css'

import Versions from '@renderer/components/Versions'
import electronLogo from '@renderer/assets/electron.svg'
import { Link } from 'react-router-dom'

function HomePage(): JSX.Element {
  return (
    <>
      <Link to="/about">About</Link>

      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={window.electron.ping}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions />
    </>
  )
}

export default HomePage
