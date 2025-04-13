import { useState } from "react"
import { useGameContext } from "./context/useGame"

type CraftModalProps = {
  open: boolean
  onClose: () => void
  // onCraft: (description: string) => void
}

export default function CraftModal({ open, onClose}: CraftModalProps) {
  const [input, setInput] = useState('')
   const {craftTile, selectedTile, setIsCraftModalOpen, setSelectedTile} = useGameContext()

  const handleSubmit = () => {
    console.log("Crafting tile 0");
    if (input.trim()) {
      setInput('')
      if (selectedTile){
        craftTile(selectedTile, input.trim());
        console.log("Crafting tile");
        setSelectedTile(null)
        
      }
      setIsCraftModalOpen(false)

    }
  }

  if (!open) return null

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.close}>✖</button>

        <h2 style={styles.title}>✨ What would you like to craft?</h2>
        <p style={styles.description}>Describe the tile you want to create. Be creative! This affects how it looks and behaves.</p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. A glowing forest with hidden secrets..."
          style={styles.textarea}
          rows={6}
        />

        <button onClick={handleSubmit} style={styles.button}>
          Craft Tile
        </button>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    position: 'relative' as const,
    width: '60vw',
    height: '50vh',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
  },
  close: {
    position: 'absolute' as const,
    top: 10,
    right: 10,
    fontSize: '18px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    marginBottom: '8px',
  },
  description: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '12px',
  },
  textarea: {
    flex: 1,
    padding: '12px',
    fontSize: '14px',
    resize: 'none' as const,
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '16px',
    outline: 'none',
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: 'bold' as const,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
}