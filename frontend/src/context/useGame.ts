// useGame.ts
import { useReactGameContext} from '../providers/GameProvider'
// OR switch to: import { useDojoGame } from '../providers/DojoGameProvider'

export const useGameContext = useReactGameContext
// export const useGame = useDojoGame  ← Swap this line when using Dojo