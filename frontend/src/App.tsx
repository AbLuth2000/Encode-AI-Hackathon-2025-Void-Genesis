import './App.css'
// import {MapControls} from '@react-three/drei'
import Game from './Game'
import { useRef } from 'react'
import { GameProvider } from './providers/GameProvider'

function App() {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef(null)

  return (

    <GameProvider>
      
          <Game/>
       
       </GameProvider>

  )
}

export default App
