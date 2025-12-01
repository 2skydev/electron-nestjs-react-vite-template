import { Outlet } from 'react-router-dom'

import { ThemeProvider } from '@renderer/components/common/ThemeProvider'

const App = () => {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  )
}

export default App
