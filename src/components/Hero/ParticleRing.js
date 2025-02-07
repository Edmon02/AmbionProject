import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { pointsInner, pointsOuter } from "./utils";
import Hero from "./Hero";

const ParticleRing = () => {
  const [numPointsToShow, setNumPointsToShow] = useState(300); // Initial number of points to show
  const maxPoints = 2000; // Maximum number of points

  useEffect(() => {
    // Gradually increase the number of points over time
    const interval = setInterval(() => {
      if (numPointsToShow < maxPoints) {
        setNumPointsToShow(numPointsToShow + 20);
      }
    }, 200); // Adjust the interval and increment as needed

    return () => clearInterval(interval);
  }, [numPointsToShow]);

  return (
    <div className="relative">
      <Canvas
        camera={{
          position: [10, -7.5, -5],
        }}
        style={{ height: "100vh" }}
        className="bg-slate-900"
      >
        <OrbitControls maxDistance={20} minDistance={10} />
        <directionalLight />
        <pointLight position={[-30, 0, -30]} power={10.0} />
        <PointCircle numPointsToShow={numPointsToShow} />
      </Canvas>

      <Hero />
    </div>
  );
};

const PointCircle = ({ numPointsToShow }) => {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (ref.current?.rotation) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {pointsInner.slice(0, numPointsToShow).map((point) => (
        <Point key={point.idx} position={point.position} color={point.color} />
      ))}
      {pointsOuter.slice(0, numPointsToShow / 4).map((point) => (
        <Point key={point.idx} position={point.position} color={point.color} />
      ))}
    </group>
  );
};

const Point = ({ position, color }) => {
  return (
    <Sphere position={position} args={[0.1, 10, 10]}>
      <meshStandardMaterial
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.5}
        color={color}
      />
    </Sphere>
  );
};

export default ParticleRing;