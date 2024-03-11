import reactLogo from './assets/react.svg'
import groovyWalkAnimation from './assets/lottie/groovyWalk.json'
import viteLogo from '/vite.svg'
import testImg from '/test.png'
import styles from './App.module.less'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useLottie } from 'lottie-react'
import Home from './pages/home'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
]);

function App() {

  const { View } = useLottie({
    animationData: groovyWalkAnimation,
    loop: true
  })

  return (
    <div id="app" >
      <RouterProvider router={router} />
    </div>
  )
}

export default App
