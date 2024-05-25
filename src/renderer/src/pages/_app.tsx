import { Link, Outlet } from 'react-router-dom'

const App = () => {
  return (
    <>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Outlet />
    </>
  )
}

export default App
