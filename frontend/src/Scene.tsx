// Game.tsx
import { Environment, OrbitControls, Sky} from '@react-three/drei'
import WorldMap from './WorldMap'
import WorldTile from './tiles/WorldTile'
import VoidTile from './tiles/VoidTile'
import { useGameContext } from './context/useGame'
import { Player } from './Player'
import { useInputControl } from './useInputControl'
import PlayerTile from './tiles/PlayerTile'
import GameTile from './GameTile'


export default function Scene() {
  const { world, player, rentTile} = useGameContext()
    const { setSelectedTile, setIsCraftModalOpen } = useGameContext()

  const getInput = useInputControl();
  return (
    <>
      {/* <OrbitControls makeDefault/> */}
      {/* <MapControls/> */}
      {/* <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial/>
      </mesh> */}
      <OrbitControls makeDefault />
    <Player  input={getInput}/>
    
{/* <Environment
  preset="sunset" // or "sunrise", "night", "dawn", "warehouse", "forest", "apartment", etc.
  // background // sets scene.background = env map
/> */}
      {/* <Sky /> */}
      {/* <Environment /> */}
      {/* <FlyControls /> */}
      {/* <ambientLight intensity={5.0} /> */}
      {/* <directionalLight color="red" position={[0, 0, 5]} /> */}
      <color attach="background" args={['#202030']} />
      <fog attach="fog" args={['#202030', 5, 20]} />
{/* <ambientLight intensity={0.05} /> */}
<directionalLight position={[10, 100, 5]} intensity={1.5} castShadow /> 
      {/* <Sky
  sunPosition={[10, 20, 10]}
  turbidity={6}
  rayleigh={1}
  mieCoefficient={0.005}
  mieDirectionalG={0.8}
/> */}
      <WorldMap>
      {world.tiles.map(tile => (<GameTile tile={tile}  key={tile.id}/>))}
      </WorldMap>
    </>
  )
}