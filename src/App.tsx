import { useState } from 'react'
import reactLogo from './assets/react.svg'
import groovyWalkAnimation from './assets/groovyWalk.json'
import viteLogo from '/vite.svg'
import testImg from '/test.png'
import styles from './App.module.less'
import { useLottie } from 'lottie-react'

function App() {

  const { View } = useLottie({
    animationData: groovyWalkAnimation,
    loop: true
  })

  return (
    <div id="app" >
      {View}
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className={styles.logo} alt="Vite logo" />
        <img src={testImg} className={styles.logo} alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
    </div>
  )
}

export default App
