// InputControl.tsx
import { useMouseCapture } from "./useMouseCapture";
import { useKeyboard } from "./useKeyboard";

export function useInputControl() {
  const keyboard = useKeyboard();
  const mouse = useMouseCapture();

  const getInput = () => {
    let [x, y, z] = [0, 0, 0];

    if (keyboard["s"]) z += 1.0;
    if (keyboard["w"]) z -= 1.0;
    if (keyboard["d"]) x += 1.0;
    if (keyboard["a"]) x -= 1.0;
    if (keyboard[" "]) y += 1.0;

    return {
      move: [x, y, z],
      look: [mouse.x / window.innerWidth, mouse.y / window.innerHeight],
      running: keyboard["Shift"],
    };
  };

  return getInput;
}