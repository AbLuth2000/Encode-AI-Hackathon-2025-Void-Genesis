import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { Raycaster, Quaternion } from "three";
import * as THREE from "three";
import { useGameContext } from "./context/useGame";
import { clamp, lerp } from "three/src/math/MathUtils.js";
import { TileUpdateSource } from "./models/tileFlavors";

export const Player = ({
  walk = 1.0,
  jump = 0,
  input = () => ({ move: [0, 0, 0], look: [0, 0] }),
}) => {
  const api = useRef(null); // Reference to the RigidBody API provided by "@react-three/rapier".
  const mesh = useRef(null); // Reference to the 3D mesh of the player character.
  const { scene, camera } = useThree(); // Get the 3D scene and camera provided by "@react-three/fiber".

  const { playerPositionTile } = useGameContext()// Get the player position tile from the game context.
  useEffect(() => {
    if (!api.current || !playerPositionTile || playerPositionTile.updateSource != TileUpdateSource.SERVER_REJECTED) return
    console.log("Player position tile updated", playerPositionTile.tile.position)
    const pos = api.current.translation()
    const expectedTile = playerPositionTile.tile
  
    const isInsideTile =
      Math.abs(pos.x - expectedTile.position.x) < 0.5 &&
      Math.abs(pos.z - expectedTile.position.y) < 0.5
  
    if (!isInsideTile) {
      // Snap back to last known good tile
      if (playerPositionTile) {
        const { x, y } = playerPositionTile.tile.position
        api.current.setTranslation({ x, y: 0.2, z: y }, true)
      }
    }
  }, [playerPositionTile])

  // if player is not in current tile position update player position to the nearest point in the tile
  // player.currentTilePosition.

  let phi = 0; // Horizontal angle of the camera's orientation.
  let theta = 0; // Vertical angle of the camera's orientation.

  // Declare reusable, non-persistent variables (avoiding recreation every frame).
  const speed = new Vector3(walk / 2, jump, walk); // Vector representing the player's movement speed.
  const offset = new Vector3(0, 0, 0); // Vector used to calculate the player's movement based on user input.
  const gaze = new Quaternion(); // Quaternion representing the direction the player character is looking at.
  const yaw = new Quaternion(); // Quaternion controlling horizontal rotations of the player's camera.
  const pitch = new Quaternion(); // Quaternion controlling vertical rotations of the player's camera.
  const cameraOffset = new Vector3(0, 0.5, 1); // Vector representing the offset of the camera from the player's position.
  const down = new Vector3(0, -1, 0); // Vector pointing downwards, used for raycasting to determine ground collision.
  const yAxis = new Vector3(0, 1, 0); // Vector representing the world's y-axis.
  const xAxis = new Vector3(1, 0, 0); // Vector representing the world's x-axis.
  const raycaster = new Raycaster(new Vector3(0, 0, 0), down, 0, 2); // Raycaster for ground collision detection.
  const slope = new Vector3(0, 1, 0); // Vector representing the slope of the ground surface.

  // Function to update the player's camera orientation based on user input.
  const updateOrientation = ([x, y]) => {
    const cameraSpeed = 3; // Speed factor for camera movement.
    const step = 0.1; // Step for smooth interpolation of camera orientation changes.
    phi = lerp(phi, -x * cameraSpeed, step); // Interpolate horizontal camera rotation.
    theta = lerp(theta, -y * cameraSpeed, step); // Interpolate vertical camera rotation.
    theta = clamp(theta, -Math.PI / 3, Math.PI / 3); // Clamp vertical rotation within limits.

    yaw.setFromAxisAngle(yAxis, phi); // Set the yaw quaternion based on horizontal rotation.
    pitch.setFromAxisAngle(xAxis, theta); // Set the pitch quaternion based on vertical rotation.
    gaze.multiplyQuaternions(yaw, pitch).normalize(); // Combine yaw and pitch to get the gaze direction.
  
  };

  useFrame(() => {
    if (!api.current || !mesh.current) return;
    const position = api.current.translation(); // Get the player's current position from the RigidBody API.
    const { move, look, running } = input(); // Get current player input, including movement and camera look direction.

    // updateOrientation(look); // Update the player's camera orientation based on the camera look direction.

    // Filter the scene's children to get all walkable objects (excluding the player's mesh).
    const walkable = scene.children.filter(
      (o) => o.children[0]?.uuid !== mesh?.current?.uuid
    );

    raycaster.set(position, down);
    // Calculate the offset vector for player movement based on user input, speed, and orientation.
    offset
      .fromArray(move)
      .normalize()
      .multiply(running ? speed.clone().multiplyScalar(2.5) : speed);
      // .applyQuaternion(yaw);



    api.current.setLinvel(offset, true);

    const newPosition = new THREE.Vector3(position.x, position.y, position.z);
    if (offset.z > 0 || offset.x > 0) {
      console.log("player position " + JSON.stringify(newPosition));
    }
    // camera.position.lerp(
    //   newPosition.add(cameraOffset.clone().applyQuaternion(yaw)),
    //   0.25
    // );

    // camera.quaternion.copy(gaze);
    // Bird’s-eye view camera setup
    const birdEyeOffset = new THREE.Vector3(0, 1.0, 0.5); ; // Camera 10 units above player

// Smoothly move the camera above the player
camera.position.lerp(
  newPosition.clone().add(birdEyeOffset),
  0.1
);

// Make camera look directly at the player
camera.lookAt(newPosition);
  });
  return (
    <RigidBody
      ref={api}
      lockRotations
      position={[0, 0.2, 0]}
      friction={5.0}
      restitution={0.5}
      colliders="ball"
    >
      <mesh ref={mesh} userData={{ tag: "player" }} castShadow>
        <meshPhysicalMaterial metalness={0.5} roughness={0} color={"cyan"} />
        <sphereGeometry args={[0.05, 50, 50]} />
          {/* Spotlight that follows the player */}
        <spotLight
          position={[0, 2, 0]} // Relative to the player
          angle={0.3}
          penumbra={0.2}
          decay={3.0} 
          distance={10.0}
          intensity={15}
          castShadow
          target={mesh.current} // Look at the player
        />
      </mesh>
    </RigidBody>
  );
};