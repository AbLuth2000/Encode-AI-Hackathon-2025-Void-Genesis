import { TileFlavor, TileOwnership, TilePlayerAction,  TileTransactionState } from "./tileFlavors"

// types.ts or inside GameProvider.tsx
export type TileData = {
    id: string // unique identifier for the tile
    ownerId?: string // optional player or wallet ID
    rent?: number // rent per use
    position: WorldLocationData
    modelUrl: string // 3D model .glb
    ownership: TileOwnership // ownership type (void, world - meaning someone else, player)
    flavor: TileFlavor // additional data for tile flavor
    state: TileTransactionState // current state of the tile
  }

// tile material
// potentially a sound effect
// potentially a bob on top (which could be animated) saying something
// potentially a modifier showing selection, foreign ownership, etc.
// the state might be reset after animation ends for example, or after a few seconds

export type PlayerData = {
    id: string // unique identifier for the player address
    balance: number // in-game currency
    rentEarned: number
    tilesOwned: TileData[] // list of owned tiles
    currentTilePosition: TileData
}

export type WorldData = {
    tiles: TileData[] // list of tiles in the world
}

export type WorldLocationData = {
    x: number // x coordinate
    y: number // y coordinate
}