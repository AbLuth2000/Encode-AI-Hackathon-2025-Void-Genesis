import React, { JSX, useState } from 'react'
import { TileData } from './models/gameSchema'
import VoidTile from './tiles/VoidTile'
import WorldTile  from './tiles/WorldTile'
import  PlayerTile  from './tiles/PlayerTile'
import { PlayerPosition, TileFlavor, TileOwnership, TilePlayerAction, TileTransactionState } from './models/tileFlavors'
import { FloorVoidMaterial } from './materials/FloorVoidMaterial'
import { FloorGrassMaterial } from './materials/FloorGrassMaterial'
import { FloorWaterMaterial } from './materials/FloorWaterMaterial'
import { FloorRockMaterial } from './materials/FloorRockMaterial'
import { FloorSandMaterial } from './materials/FloorSandMaterial'
import { useGameContext } from './context/useGame'
import Tile from './tiles/Tile'
import { NormalizedAsset } from './NormalizedAsset'
import TileBoxShell from './tile_modifiers/TileBoxShell'

type GameTileProps = {
    tile: TileData
}

// Helper to get material by tile flavor
function getMaterialByFlavor(flavor: TileFlavor, isSelected: boolean, isColliding:boolean, isForeign: boolean ): JSX.Element {
    switch (flavor) {
        case TileFlavor.VOID:
        return <FloorVoidMaterial isSelected={isSelected} isColliding={isColliding} />
      case TileFlavor.GRASS:
        return <FloorGrassMaterial isSelected={isSelected} isColliding={isColliding} isForeign={isForeign} />
     case TileFlavor.ROCK:
        return <FloorRockMaterial  isSelected={isSelected} isColliding={isColliding} isForeign={isForeign} />
    case TileFlavor.SAND:
        return <FloorSandMaterial   isSelected={isSelected} isColliding={isColliding} isForeign={isForeign}/>
    case TileFlavor.WATER:
        return <FloorWaterMaterial />
      default:
        return <FloorRockMaterial  isSelected={isSelected} isColliding={isColliding} isForeign={isForeign}/>
    }
  }

  // Helper: Visual FX per combined mechanic+action state
function getEffectsForTile(tileState: TileTransactionState, playerAction: TilePlayerAction, isWorldTile: boolean): JSX.Element[] {
    const effects: JSX.Element[] = []
    if(isWorldTile){
        effects.push(
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color={"red"} transparent opacity={0.2} depthWrite={false} />
          </mesh>
        )
    }
    switch (tileState) {
        case TileTransactionState.CRAFTING:
            effects.push(
                <mesh key="crafting-ring">
                  <TileBoxShell thickness={0.05} size={1.0} height={0.01} color="blue" opacity={0.9} emissive='#4b1a75' />
                  {/* <group position={[0, 1.0, 0]}>
                  <sphereGeometry args={[0.1, 100, 100]} />
                  </group> */}
                   {/* add sphere */}

                </mesh>
            )
            break;
        case TileTransactionState.CRAFTING_COMPLETE:
            // effects.push(
            //     <mesh key="crafting-ring" rotation={[-Math.PI / 2, 0, 0]}>
            //     <ringGeometry args={[0.45, 0.5, 32]} />
            //     <meshBasicMaterial color="green" transparent opacity={0.4} />
            // </mesh>
            // )
            break;
        case TileTransactionState.CRAFTING_REJECTED:
            effects.push(
                <mesh key="crafting-ring" rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.45, 0.5, 32]} />
                    <meshBasicMaterial color="red" transparent opacity={0.4} />
                </mesh>
            )
            break;
        case TileTransactionState.RENTING:
            // effects.push(
            //     <group>
            //     <TileBoxShell thickness={0.05} size={1.0} height={0.01} color="blue" opacity={0.9} />
            //     <mesh key="renting-ring" rotation={[-Math.PI / 2, 0, 0]}>
            //         <ringGeometry args={[0.45, 0.5, 32]} />
            //         <meshBasicMaterial color="blue" transparent opacity={0.4} />
            //     </mesh>
            //     <mesh key="renting-sphere" position={[0, 1.0, 0]}>
            //         {/* <sphereGeometry args={[0.1, 100, 100]} /> */}
            //         <NormalizedAsset url="/assets/glb_models/star.glb" scale={[10.1, 10.1, 10.1]} />
            //         <meshBasicMaterial color="white"/>
            //     </mesh>

            //     </group>
            // )
            break;
        case TileTransactionState.RENTING_REJECTED:
            effects.push(
                <mesh key="renting-ring" rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.45, 0.5, 32]} />
                    <meshBasicMaterial color="cyan" transparent opacity={0.4} />
                </mesh>
            )
            break;
        case TileTransactionState.CONQUERING:
            effects.push(
                <mesh key="conquering-ring" rotation={[-Math.PI / 2, 0, 0]}>
                       <TileBoxShell thickness={0.05} size={1.0} height={0.01} color="blue" opacity={0.9} emissive='#ad0244' />
                </mesh>
            )
            break;
        case TileTransactionState.CONQUERING_REJECTED:
            effects.push(
                <mesh key="conquering-ring" rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.45, 0.5, 32]} />
                    <meshBasicMaterial color="yellow" transparent opacity={0.4} />
                </mesh>
            )
            break;
        case TileTransactionState.CONQUERING_COMPLETE:
            effects.push(
                <mesh key="conquering-ring" rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.45, 0.5, 32]} />
                    <meshBasicMaterial color="hotpink" transparent opacity={0.4} />
                </mesh>
            )
            break;
        case TileTransactionState.IDLE:
            break;
        default:
            break;
    }

    switch (playerAction) {
        case TilePlayerAction.SELECTED:
            // effects.push(
            //     <mesh key="selected-ring">
            //           <TileBoxShell thickness={0.05} size={1.0} height={0.01} color="blue" opacity={0.9} emissive='white' />
            //     </mesh>
            // )
            break;
        case TilePlayerAction.ENTERED:
            effects.push(
                <mesh key="entered-ring" rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.45, 0.5, 32]} />
                    <meshBasicMaterial color="green" transparent opacity={0.4} />
                </mesh>
            )
            break;
        case TilePlayerAction.COLLIDED:
            effects.push(
                <mesh key="collided-ring" rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.45, 0.5, 32]} />
                    <meshBasicMaterial color="red" transparent opacity={0.4} />
                </mesh>
            )
            break;
        case TilePlayerAction.NONE:
            break;
        default:
            break;
        }
  
    // // Example: both charging and collected
    // if (state.mechanic === 'charging' && state.playerAction === 'collected') {
    //   effects.push(
    //     <mesh key="charging-ring" rotation={[-Math.PI / 2, 0, 0]}>
    //       <ringGeometry args={[0.45, 0.5, 32]} />
    //       <meshBasicMaterial color="yellow" transparent opacity={0.4} />
    //     </mesh>,
    //     <mesh key="sparkle" position={[0, 0.1, 0]}>
    //       <sphereGeometry args={[0.05, 12, 12]} />
    //       <meshBasicMaterial color="white" emissive="cyan" />
    //     </mesh>
    //   )
    // }
  
    // // Example: crafting in progress
    // if (state.mechanic === 'crafting' && state.playerAction === 'interacted') {
    //   effects.push(
    //     <mesh key="craft-shimmer" position={[0, 0.15, 0]}>
    //       <icosahedronGeometry args={[0.1, 0]} />
    //       <meshStandardMaterial color="orange" emissive="orange" emissiveIntensity={0.6} />
    //     </mesh>
    //   )
    // }
  
    // Add more combinations here...
    return effects
  }

  function getTilePlayerAction(isSelected: boolean, isColliding: boolean, isCurrent: boolean): TilePlayerAction {
    if (isSelected) {
      return TilePlayerAction.SELECTED
    } else if (isCurrent) {
      return TilePlayerAction.ENTERED
    } else if (isColliding) {
      return TilePlayerAction.COLLIDED
    } else {
      return TilePlayerAction.NONE
    }
  }
const GameTile: React.FC<GameTileProps> = ({ tile }) => {
    const { world, player, rentTile, setSelectedTile, setIsCraftModalOpen, selectedTile, playerPositionTile} = useGameContext()
    const {collidedTile, setCollidedTile} = useState();

    const isSelected = selectedTile?.id === tile.id
    const isColliding = collidedTile?.id === tile.id
    const isCurrent = playerPositionTile?.tile.id === tile.id

    const material = getMaterialByFlavor(tile.flavor, isSelected, isColliding, tile.ownership == TileOwnership.PLAYER)
    const playerAction = getTilePlayerAction(isSelected, isColliding, isCurrent)
    const effects = getEffectsForTile(tile.state, playerAction, tile.ownership == TileOwnership.WORLD)
    // getTilePlayerAction(tile.id),
    
  if (tile.ownership == TileOwnership.VOID) {
    return <VoidTile material={material} effects={effects} tilePosition={[tile.position.x, tile.position.y]}
    onSelect={() => { 
        setSelectedTile(tile)
        setIsCraftModalOpen(true)
    }} 
    onDeselect={() => {
        setSelectedTile(null)
        setIsCraftModalOpen(false)
    }
    }
    onCollide={() => {
        setCollidedTile(tile)
        
    }}
    onUncollide={() => {
        setCollidedTile(null)
    }}
    />
  }

  if (tile.ownership == TileOwnership.WORLD) {
    return <WorldTile assetUrl={tile.modelUrl} material={material} effects={effects} tilePosition={[tile.position.x, tile.position.y]}  
    onPlayerEnter={() => {
        
        rentTile(tile)
    }} onPlayerExit={() => {

    }}
    />
  }

  if (tile.ownership == TileOwnership.PLAYER) {
    return <PlayerTile assetUrl={tile.modelUrl}  material={material} effects={effects} tilePosition={[tile.position.x, tile.position.y]} 

    onPlayerEnter={()=>{}} onPlayerExit={()=>{}} />
  }

  return null
}

export default GameTile