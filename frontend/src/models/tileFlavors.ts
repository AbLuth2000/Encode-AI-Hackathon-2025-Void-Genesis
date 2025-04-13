
// tileFlavors.ts

import { TileData } from '../models/gameSchema'
///! AVOID INFINITE LOOP BY FLAGGING THE TILE UPDATE REASON, whether it was server or client side
export type PlayerPosition = {
  tile: TileData
  updateSource: TileUpdateSource
}
export enum TileUpdateSource{
  CLIENT_MOVEMENT = 'client_movement',
  SERVER_REJECTED = 'server_rejected',
}
export enum TileType {
  VOID = 'void',
  WORLD = 'world',
  PLAYER = 'player',
}

export type TileVisualState = {
  isCurrentTile: boolean
  isSelected: boolean
  isColliding: boolean
}


export type TileFlavorData = {
  textureUrl?: string | null
  modelUrl?: string
  positionalSoundUrl?: string
  soundDistance?: number
  soundRolloffFactor?: number
  soundMaxDistance?: number
  soundRefDistance?: number
  tags?: string[]
}

export enum TileOwnership {
  VOID = 'void',
  WORLD = 'world',
  PLAYER = 'player',
}

export enum TileFlavor {
    GRASS = 'grass',
    ROCK = 'rock',
    SAND = 'sand',
    WATER = 'water',
    VOID = 'void',
}

export enum TileTransactionState {
    IDLE = 'idle',
    /// if any tile is crafting, that's added to the hud with a counter of how many tiles are crafting
    CRAFTING = 'crafting',
    /// ephemeral state, resets after animation completes
    CRAFTING_REJECTED = 'crafting_rejected',
    /// ephemeral state, resets after animation completes
    CRAFTING_COMPLETE = 'crafting_complete',
    /// renting a tile
    RENTING = 'renting',
    /// ephemeral state, resets after animation completes
    RENTING_REJECTED = 'renting_rejected',
    /// conquering a tile
    CONQUERING = 'conquering',
    /// ephemeral state, resets after animation completes
    CONQUERING_REJECTED = 'conquering_rejected',  
    /// ephemeral state, resets after animation completes
    CONQUERING_COMPLETE = 'conquering_complete',
}

export enum TilePlayerAction {
  NONE = 'none',
  ENTERED = 'entered',
  SELECTED = 'selected',
  COLLIDED = 'collided',
}