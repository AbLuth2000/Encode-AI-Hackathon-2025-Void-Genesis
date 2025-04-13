import { useEffect } from "react";
import { useGameContext } from "./context/useGame";
import CraftModal from "./CraftModal";
import tileIcon from './assets/icons/tile-icon.png'
import quarkIcon from './assets/icons/quark-coin.png'

export default function Hud() {
  const {
    player,
    setSelectedTile,
    setIsCraftModalOpen,
    isCraftModalOpen,
    selectedTile,
    isAudioEnabled,
    setIsAudioEnabled,
  } = useGameContext();

  useEffect(() => {
    if (isCraftModalOpen && selectedTile) {
      console.log("Modal is now open and tile is selected:", selectedTile);
    }
  }, [isCraftModalOpen, selectedTile]);



  const handleEnableAudio = () => {
    const AudioContext = window.AudioContext;
    const context = new AudioContext();

    if (context.state === "suspended") {
      context.resume().then(() => {
        setIsAudioEnabled(true);
        console.log("🎧 Audio enabled");
      });
    } else {
      setIsAudioEnabled(!isAudioEnabled);
      console.log("🎧 Audio toggled");
    }
  };

  return (
    <>
      {/* Top-right Audio Toggle */}
      <div style={styles.audioToggle}>
        <button onClick={handleEnableAudio} style={styles.button}>
          {isAudioEnabled ? "🔊" : "🔇"}
        </button>
      </div>

      {/* Bottom-right Tile + Bank Info */}
      <div style={styles.bottomRight}>
      <button onClick={() => {}} style={styles.button}>
    <img src={tileIcon} alt="tiles" style={styles.icon} />
    {player.tilesOwned.length}
  </button>
  <button onClick={() => {}} style={styles.button}>
    <img src={quarkIcon} alt="quarks" style={styles.icon} />
    {player.balance}
  </button>
      </div>

      {/* Craft Modal */}
      <CraftModal
        open={isCraftModalOpen}
        onClose={() => {
          setIsCraftModalOpen(false);
          setSelectedTile(null);
        }}
        // onCraft={handleCraft}
      />
    </>
  );
}

const styles = {
  audioToggle: {
    position: "absolute" as const,
    top: 20,
    right: 20,
    zIndex: 1000,
  },
  bottomRight: {
    position: "absolute" as const,
    bottom: 20,
    right: 20,
    display: "flex",
    gap: "20px", // slightly bigger gap for bigger buttons
    zIndex: 1000,
  },
  button: {
    padding: "32px 48px", // 4x the original size
    fontSize: "24px",      // larger text
    fontWeight: 900 as const, // extra bold
    color: "white",
    cursor: "pointer",
    borderRadius: "16px",
    background: "transparent",
    border: "0px solid white",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  icon: {
    width: '48px',
    height: '48px',
  },
};