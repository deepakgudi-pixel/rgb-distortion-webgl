import React, { useEffect, useRef } from 'react';
import useMouse from './useMouse';
import { animate, progress, useMotionValue, useTransform } from 'framer-motion';
import { useTexture, useAspect } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import useDimension from './useDimension';
import { useFrame, useThree } from '@react-three/fiber';
import { vertex, fragment } from './Shader';
import { projects } from './data';

export default function Model({ activeProject }) {
  const mouse = useMouse();
  const dimension = useDimension();
  const { viewport } = useThree();
  const opacity = useMotionValue(0);

  const smoothMouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const lerp = (x, y, a) => x * (1 - a) + y * a;

  useFrame(() => {
    const { x, y } = mouse;
    const smoothX = smoothMouse.x.get();
    const smoothY = smoothMouse.y.get();
    smoothMouse.x.set(lerp(smoothX, x.get(), 0.1));
    smoothMouse.y.set(lerp(smoothY, y.get(), 0.1));

    mesh.current.material.uniforms.uDelta.value = {
      x: x.get() - smoothX,
      y: -1 * (y.get() - smoothY),
    };
  });

  // Transform the mouse X position to a 3D position in the scene
  const x = useTransform(smoothMouse.x, [0, dimension.width], [-viewport.width / 2, viewport.width / 2]);
  const y = useTransform(smoothMouse.y, [0, dimension.height], [viewport.height / 2, -viewport.height / 2]);

  // Load textures for each project at the top level
  const textures = projects.map(project => useTexture(project.src));

  const uniforms = useRef({
    uTexture: { value: textures[0] },
    uDelta: { value: { x: 0, y: 0 } },
    uOpacity: { value: 1 },
  });

  const mesh = useRef();

  const scale = useAspect(
    textures[0].image.width,
    textures[0].image.height,
    0.175
  );

  // Change the texture images on hover
  useEffect(() => {
    if (activeProject != null) {
      animate(opacity, 1, {
        duration: 0.2,
        onUpdate: progress => (mesh.current.material.uniforms.uOpacity.value = progress),
      });

      mesh.current.material.uniforms.uTexture.value = textures[activeProject];
    } else {
      animate(opacity, 0, {
        duration: 0.2,
        onUpdate: progress => (mesh.current.material.uniforms.uOpacity.value = progress),
      });
    }
  }, [activeProject, textures, opacity]);

  return (
    <motion.mesh scale={scale} ref={mesh} position-x={x} position-y={y}>
      <planeGeometry args={[1, 1, 15, 15]} />
      <shaderMaterial
        wireframe={false}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms.current}
      />
    </motion.mesh>
  );
}