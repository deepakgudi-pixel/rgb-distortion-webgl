import { Canvas } from "@react-three/fiber";
import Model from "./Model";

export default function Scene({ activeProject }) {
  return (
    <div className="fixed top-0 h-screen w-full">
      <Canvas>
        <Model activeProject={activeProject} />
      </Canvas>
    </div>
  );
}
