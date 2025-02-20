// import React, { Suspense } from "react";
// import { Canvas } from "@react-three/fiber";
// import { useGLTF, OrbitControls, Environment } from "@react-three/drei";

// function Model({ modelPath }) {
//   const { scene } = useGLTF("/public/model/sample (36).glb");
//   return <primitive object={scene} scale={1} />;
// }

// export default function Scene() {
//   return (
//     <div style={{ width: "100%", height: "800px" }}>
//       <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
//         <Suspense fallback={null}>
//           <Model modelPath="/public/model/sample (36).glb" />
//           <Environment preset="sunset" />
//           <OrbitControls />
//         </Suspense>
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[10, 10, 5]} intensity={1} />
//       </Canvas>
//     </div>
//   );
// }

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function Model({ modelPath }) {
  const modelRef = useRef();

  useFrame((state) => {
    if (!modelRef.current) return;

    // Get mouse position in normalized device coordinates (-1 to +1)
    const mouseX = (state.mouse.x * Math.PI) / 8;
    const mouseY = (state.mouse.y * Math.PI) / 8;

    // Smooth rotation
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      mouseX,
      0.1
    );
    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      -mouseY,
      0.1
    );
  });

  const { scene } = useGLTF("/public/model/sample (36).glb");
  return <primitive ref={modelRef} object={scene} scale={1} />;
}

export default function Scene() {
  return (
    <section className="w-full h-[80vh] relative">
      {" "}
      {/* Adjust height and margins as needed */}
      <div className="w-full h-full">
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 45,
            near: 0.5,
            far: 5000,
          }}
          style={{ touchAction: "none" }}
          preserveDrawingBuffer={true}
        >
          <Suspense fallback={null}>
            <Model modelPath="/public/model/sample (36).glb" />
            <Environment preset="sunset" />
          </Suspense>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
        </Canvas>
      </div>
    </section>
  );
}
