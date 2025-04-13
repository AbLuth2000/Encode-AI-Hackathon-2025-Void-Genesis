/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Children,
    ReactElement,
    ReactNode,
    isValidElement,
    useMemo,
    forwardRef,
    useImperativeHandle,
  } from 'react'
import Tile, { TileProps } from './tiles/Tile'
  
  type TilePosition = [number, number]
  
  type WorldMapProps = {
    children: ReactNode
  }
  
  export type WorldMapHandle = {
    getTileAt: (x: number, z: number) => ReactElement | undefined
  }
  
  const WorldMap = forwardRef<WorldMapHandle, WorldMapProps>(({ children }, ref) => {
    const tileMap = useMemo(() => {
      const map = new Map<string, ReactElement>()
  
      Children.forEach(children, child => {
        if (!isValidElement(child) || child.type !== Tile) return
        const childTile = child as ReactElement<TileProps, typeof Tile>
  
        const tileType = childTile.type as any
        if (!tileType?.isTileComponent) return
  
        const pos = childTile.props.position as TilePosition
        if (!pos) return
  
        const key = `${pos[0]}:${pos[1]}`
        map.set(key, child)
      })
  
      return map
    }, [children])
  
    const getTileAt = (x: number, z: number): ReactElement | undefined => {
      return tileMap.get(`${x}:${z}`)
    }
  
    useImperativeHandle(ref, () => ({ getTileAt }))
  
    return <>{children}</>
  })
  
  export default WorldMap