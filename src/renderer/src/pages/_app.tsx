import { Outlet } from 'react-router-dom'

import { ThemeProvider } from '@renderer/components/common/ThemeProvider'
import { Toaster } from '@renderer/components/ui/sonner'

const App = () => {
  return (
    <ThemeProvider>
      <Toaster />
      <Outlet />
    </ThemeProvider>
  )
}

export default App
