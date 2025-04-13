import { useState } from 'react'
import { useGameContext } from './context/useGame'

type CraftProps = {
  onCraft: (description: string) => void
}

export default function Craft({ onCraft }: CraftProps) {
  const [input, setInput] = useState('')
  const {craftTile, selectedTile, setIsCraftModalOpen, setSelectedTile} = useGameContext()

  const handleCraft = () => {
    console.log("Crafting tile 0");
    if (input.trim()) {
      onCraft(input.trim())
      setInput('')
      if (selectedTile){
        craftTile(selectedTile, input.trim());
        console.log("Crafting tile");
        setSelectedTile(null)
        
      }
      setIsCraftModalOpen(false)

    }
  }

  return (
    <div style={styles.wrapper}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your tile..."
        style={styles.input}
      />
      <button onClick={handleCraft} style={styles.button}>
        Craft
      </button>
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'absolute' as const,
    top: 20,
    left: 20,
    display: 'flex',
    gap: '8px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '8px',
    borderRadius: '8px',
  },
  input: {
    flex: 1,
    padding: '6px 8px',
    fontSize: '14px',
  },
  button: {
    padding: '6px 12px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
  },
}