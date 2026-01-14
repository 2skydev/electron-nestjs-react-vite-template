import { useTheme } from '@renderer/components/common/ThemeProvider'
import Versions from '@renderer/components/common/Versions'
import { Button } from '@renderer/components/ui/button'

const HomePage = () => {
  const { calculatedTheme, setTheme } = useTheme()

  return (
    <div>
      <h1 className="text-2xl font-bold">Hello World</h1>

      <Button onClick={() => setTheme(calculatedTheme === 'dark' ? 'light' : 'dark')}>
        Change to {calculatedTheme === 'dark' ? 'Light' : 'Dark'} Theme
      </Button>

      <Versions />
    </div>
  )
}

export default HomePage
