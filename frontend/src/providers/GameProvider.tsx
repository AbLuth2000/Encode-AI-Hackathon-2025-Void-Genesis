import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo,
    useCallback,
    useRef,
  } from 'react'
  import type { PlayerData, TileData, WorldData, WorldLocationData } from '../models/gameSchema'
import { TileTransactionState, TilePlayerAction, TileOwnership, TileFlavor, TileUpdateSource, PlayerPosition } from '../models/tileFlavors'
import { demoWorldData } from './demoWorldData'
  
  type GameContextType = {
    player: PlayerData
    world: WorldData
    movePlayer: (tile: PlayerPosition) => void
    craftTile: (tile: TileData, prompt: string) => void
    rentTile: (tile: TileData) => void
    conquerTile: (tile: TileData) => void
    refreshPlayerFromBackend: () => void
    refreshWorldFromBackend: () => void
    selectedTile: TileData | null
    setSelectedTile: (tile: TileData | null) => void
    isCraftModalOpen: boolean
    setIsCraftModalOpen: (v: boolean) => void,
    isAudioEnabled: boolean
    setIsAudioEnabled: (enabled: boolean) => void,
    playerPositionTile: PlayerPosition | null
    setPlayerPositionTile: (tile: TileData | null) => void
  }
  
  const GameContext = createContext<GameContextType | undefined>(undefined)
  
export function GameProvider({ children }: { children: ReactNode }) {
const [selectedTile, setSelectedTile] = useState<TileData | null>(null)
const [collidedTile, setCollidedTile] = useState<TileData | null>(null)
const [playerPositionTile, setPlayerPositionTile] = useState<PlayerPosition | null>(null)


const [isCraftModalOpen, setIsCraftModalOpen] = useState(false)
const [isAudioEnabled, setIsAudioEnabled] = useState(false)



    const [player, setPlayer] = useState<PlayerData>({
      id: 'player-1',
      balance: 100,
      rentEarned: 0,
      tilesOwned: [{
        rent: 20,
        id: "zz3hihf",
        position: {x: 0, y: 0},
        modelUrl: "",
       ownership: TileOwnership.PLAYER,
       flavor: TileFlavor.SAND,
       state: TileTransactionState.IDLE,
      },
      {
        rent: 20,
        id: "ba55c45e005c",
        position: { x: 2, y: 4 },
        modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
        ownership: TileOwnership.PLAYER,
        flavor: TileFlavor.GRASS,
        state: TileTransactionState.IDLE
      },
      {
        rent: 20,
        id: "12se00vihf",
        position: { x: 2, y: 2 },
        modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//log-house.glb",
        ownership: TileOwnership.PLAYER,
        flavor: TileFlavor.GRASS,
        state: TileTransactionState.IDLE
      },
      {
        rent: 20,
        id: "12se1197hf",
        position: { x: 1, y: 2 },
        modelUrl: "",
        ownership: TileOwnership.PLAYER,
        flavor: TileFlavor.GRASS,
        state: TileTransactionState.IDLE
      },
    ],
      currentTilePosition:      {
        rent: 20,
        id: "ba55c45e005c",
        position: { x: 2, y: 4 },
        modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
        ownership: TileOwnership.PLAYER,
        flavor: TileFlavor.GRASS,
        state: TileTransactionState.IDLE
      },
      
    },
)
  
    const [world, setWorld] = useState<WorldData>({
      tiles: tiles,
    //   tiles: [{
    //     rent: 20,
    //     id: "zz3hihf",
    //     position: {x: 0, y: 0},
    //     modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
    //     ownership: TileOwnership.PLAYER,
    //     flavor: TileFlavor.SAND,
    //     state: TileTransactionState.IDLE
    //    },
    //    {

    //     ownerId: "92u39jfo",
    //     rent: 20,
    //     id: "123h6kkf",
    //     position: {x: 0, y: 1},
    //     modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
    //     ownership: TileOwnership.WORLD,
    //     flavor: TileFlavor.SAND,
    //     state: TileTransactionState.IDLE
    //    },
    //    {
    //     ownerId: "92u39jfo",
    //     rent: 20,
    //     id: "123h644hf",
    //     position: {x: 1, y: 0},
    //     modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
    //     ownership: TileOwnership.WORLD,
    //     flavor: TileFlavor.GRASS,
    //     state: TileTransactionState.IDLE
    //    },
    //    {
    //     rent: 20,
    //     id: "12seslihf",
    //     position: {x: 1, y: 1},
    //     modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
    //     ownership: TileOwnership.WORLD,
    //     flavor: TileFlavor.ROCK,
    //     state: TileTransactionState.IDLE
    //    },
    //    {
    //     rent: 20,
    //     id: "12se2a4ihf",
    //     position: {x: 0, y: 2},
    //     modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
    //     ownership: TileOwnership.WORLD,
    //     flavor: TileFlavor.WATER,
    //     state: TileTransactionState.IDLE
    //    },
    //    {
    //     rent: 20,
    //     id: "12sesvihf",
    //     position: {x: 2, y: 0},
    //     modelUrl: "",
    //     ownership: TileOwnership.VOID,
    //     flavor: TileFlavor.VOID,
    //     state: TileTransactionState.IDLE
    //    },
    //    {
    //     rent: 20,
    //     id: "12se00vihf",
    //     position: {x: 2, y: 2},
    //     modelUrl: "",
    //     ownership: TileOwnership.VOID,
    //     flavor: TileFlavor.VOID,
    //     state: TileTransactionState.IDLE
    //    },
    //    {
    //     rent: 20,
    //     id: "12se0077hf",
    //     position: {x: 2, y: 1},
    //     modelUrl: "",
    //     ownership: TileOwnership.VOID,
    //     flavor: TileFlavor.VOID,
    //     state: TileTransactionState.IDLE
    //    },
    //    {
    //     rent: 20,
    //     id: "12se1197hf",
    //     position: {x: 1, y: 2},
    //     modelUrl: "",
    //     ownership: TileOwnership.VOID,
    //     flavor: TileFlavor.VOID,
    //     state: TileTransactionState.IDLE
    //    }
    // ],
    })
  
    const [previousTile, setPreviousTile] = useState<TileData | null>(null)
    const movePlayer = useCallback((playerPosition : PlayerPosition) => {
      setPreviousTile(player.currentTilePosition)
      setPlayer(prev => ({ ...prev, currentTilePosition: playerPosition.tile }))
      setPlayerPositionTile(playerPosition)
      if (playerPosition.updateSource === TileUpdateSource.CLIENT_MOVEMENT){
      //! ONLY IF CLIENT UPDATED THEN CALL THE SERVER TO UPDATE TILE
      }
    }, [])
  

    const rentTile = useCallback(async (tile: TileData) => {
      try {
        console.log("renting tile");
        const notEnoughBalance = player.balance < (tile.rent ?? 0)
        if (tile.ownership == TileOwnership.WORLD && tile.rent){
          setWorld(prev => ({
            ...prev,
            tiles: prev.tiles.map(t => t.id === tile.id ? { ...t, state: TileTransactionState.RENTING } : t),
          }))
          setPlayer(prev => ({
            ...prev,
            balance: prev.balance - tile.rent!,
          }));
          // add a timeout after which the tile either rents successfully or fails
          setTimeout(() => {
            if (notEnoughBalance) {
            setWorld(prev => ({
              ...prev,
              tiles: prev.tiles.map(t => t.id === tile.id ? { ...t, state: TileTransactionState.RENTING_REJECTED } : t),
            }))
            if (previousTile) {
              movePlayer({tile: previousTile!, updateSource: TileUpdateSource.SERVER_REJECTED})
            }
            console.log("Renting failed");
            } 
        }, 3000)
        }

      } catch (err) {
        console.error('Failed to claim tile:', err)
      }
    }, [player.id])
  
    const conquerTile = useCallback(async (tile: TileData) => {
      try {
        console.log("conquering tile");
        if (tile.ownership == TileOwnership.WORLD){
          setWorld(prev => ({
            ...prev,
            tiles: prev.tiles.map(t => t.id === tile.id ? { ...t, state: TileTransactionState.CONQUERING } : t),
          }))
          // add a timeout after which the tile either rents successfully or fails
          setTimeout(() => {
            // randomly set true or false by flipping a coin
            const random = Math.random() < 0.5
            if (random) {
            setWorld(prev => ({
              ...prev,
              tiles: prev.tiles.map(t => t.id === tile.id ? { ...t, state: TileTransactionState.CONQUERING_REJECTED } : t),
            }))
            console.log("Conquering failed");
            } else {
              setWorld(prev => ({
                ...prev,
                tiles: prev.tiles.map(t => t.id === tile.id ? { ...t, state: TileTransactionState.CONQUERING_COMPLETE } : t),
              }))
              setPlayer(prev => ({
                ...prev,
                tilesOwned: [...prev.tilesOwned, tile],
              }))
              console.log("Conquering successful");
            }
        }, 3000)
        }

      } catch (err) {
        console.error('Failed to claim tile:', err)
      }
    }, [player.id])

    const craftTile = useCallback(async (tile: TileData, prompt: string) => {
      try {
        console.log("crafting tile");
        if (tile.ownership == TileOwnership.VOID){
          setWorld(prev => ({
            ...prev,
            tiles: prev.tiles.map(t => t.id === tile.id ? { ...t, state: TileTransactionState.CRAFTING } : t),
          }))
          setPlayer(prev => ({
            ...prev,
            balance: prev.balance - 100,
          }));
          // add a timeout after which the tile either rents successfully or fails
          setTimeout(() => {
            if (player.balance < 0) {
            setWorld(prev => ({
              ...prev,
              tiles: prev.tiles.map(t => t.id === tile.id ? { ...t, state: TileTransactionState.CRAFTING_REJECTED } : t),
            }))
            console.log("Crafting failed");
            } else {
              setWorld(prev => ({
                ...prev,
                tiles: prev.tiles.map(t => t.id === tile.id ? { ...t, state: TileTransactionState.CRAFTING_COMPLETE } : t),
              }))
              // spoofing crafted tile
              tile.ownership = TileOwnership.PLAYER
              tile.flavor = TileFlavor.GRASS
              tile.modelUrl = "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb"
              setPlayer(prev => ({
                ...prev,
                tilesOwned: [...prev.tilesOwned, tile],
              }))
              console.log("Crafting successful");
            }
        }, 3000)
        }

      } catch (err) {
        console.error('Failed to claim tile:', err)
      }
    }, [player.id])

    const refreshPlayerFromBackend = useCallback(async () => {
      const res = await fetch(`/api/player/${player.id}`)
      const data: PlayerData = await res.json()
      setPlayer(data)
    }, [player.id])
  
    const refreshWorldFromBackend = useCallback(async () => {
      const res = await fetch(`/api/world`)
      const data: WorldData = await res.json()
      setWorld(data)
    }, [])
  
    const value: GameContextType = useMemo(
      () => ({
        player,
        world,
        movePlayer,
        rentTile,
        refreshPlayerFromBackend,
        refreshWorldFromBackend,
        craftTile,
        conquerTile,
        selectedTile,
        setSelectedTile,
        isCraftModalOpen,
        setIsCraftModalOpen,
        isAudioEnabled,
        setIsAudioEnabled,
        playerPositionTile,
        setPlayerPositionTile,

      
      }),
      [player, world, movePlayer, rentTile, craftTile,conquerTile,  refreshPlayerFromBackend, refreshWorldFromBackend, selectedTile, setSelectedTile, isCraftModalOpen, setIsCraftModalOpen,   isAudioEnabled,
        setIsAudioEnabled, playerPositionTile, setPlayerPositionTile]
    )
  
    return <GameContext.Provider value={value}>{children}</GameContext.Provider>
  }
  
  export function useReactGameContext() {
    const context = useContext(GameContext)
    if (!context) throw new Error('useGameContext must be used inside GameProvider')
    return context
  }

  export const tiles = [
    {
      rent: 20,
      id: "zz3hihf",
      position: { x: 0, y: 0 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.PLAYER,
      flavor: TileFlavor.SAND,
      state: TileTransactionState.IDLE
    },
    {
      ownerId: "92u39jfo",
      rent: 20,
      id: "123h6kkf",
      position: { x: 0, y: 1 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.SAND,
      state: TileTransactionState.IDLE
    },
    {
      ownerId: "92u39jfo",
      rent: 20,
      id: "123h644hf",
      position: { x: 1, y: 0 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "12seslihf",
      position: { x: 1, y: 1 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.ROCK,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "12se2a4ihf",
      position: { x: 0, y: 2 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.WATER,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "12sesvihf",
      position: { x: 2, y: 0 },
      modelUrl: "",
      ownership: TileOwnership.VOID,
      flavor: TileFlavor.VOID,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "12se00vihf",
      position: { x: 2, y: 2 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//log-house.glb",
      ownership: TileOwnership.PLAYER,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "12se0077hf",
      position: { x: 2, y: 1 },
      modelUrl: "",
      ownership: TileOwnership.VOID,
      flavor: TileFlavor.VOID,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "12se1197hf",
      position: { x: 1, y: 2 },
      modelUrl: "",
      ownership: TileOwnership.PLAYER,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "970b9ehud0e7e5f",
      position: { x: 0, y: 3 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "bbfb44949144",
      position: { x: 0, y: 4 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "186f913fee19",
      position: { x: 1, y: 3 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "d5dcca76fb33",
      position: { x: 1, y: 4 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "0df7f702958e",
      position: { x: 2, y: 3 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "ba55c45e005c",
      position: { x: 2, y: 4 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.PLAYER,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "c52f424d2fd9",
      position: { x: 3, y: 0 },
      modelUrl: "",
      ownership: TileOwnership.VOID,
      flavor: TileFlavor.VOID,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "7bd156fbab21",
      position: { x: 3, y: 1 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "ff53bfec5b75",
      position: { x: 3, y: 2 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "537a2f0beda4",
      position: { x: 3, y: 3 },
      modelUrl: "",
      ownership: TileOwnership.VOID,
      flavor: TileFlavor.VOID,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "86b37b47acb0",
      position: { x: 3, y: 4 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "a96dfd41b9d6",
      position: { x: 4, y: 0 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "4198abd6d27a",
      position: { x: 4, y: 1 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "26b6e06c41de",
      position: { x: 4, y: 2 },
      modelUrl: "",
      ownership: TileOwnership.VOID,
      flavor: TileFlavor.VOID,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "b55904bacf9b",
      position: { x: 4, y: 3 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    },
    {
      rent: 20,
      id: "761ba0c1f83a",
      position: { x: 4, y: 4 },
      modelUrl: "https://plvhqthnttjouhndvgyu.supabase.co/storage/v1/object/public/encode-assets//SM_CommonHazel_Seedling_03_PP.glb",
      ownership: TileOwnership.WORLD,
      flavor: TileFlavor.GRASS,
      state: TileTransactionState.IDLE
    }
  ];