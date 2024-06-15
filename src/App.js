import React, { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

import VAT from "./VAT";

export default function App() {
  return (
    <Canvas camera={{ position: [-5, 2, -5], fov: 50, near: 0.01, far: 1000 }}>
      <OrbitControls />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr" />
      <group scale={1} position={[4, 0, 0]}>
        <Suspense
          fallback={
            <mesh>
              <sphereGeometry />
            </mesh>
          }
        >
          <VAT
            mesh="/demo_cloth/cloth_mesh.fbx"
            P_texture="/demo_cloth/cloth_pos.exr"
            R_texture="/demo_cloth/cloth_rot.exr"
            type="soft"
            fps={24.0}
            playbackSpeed={1}
            frameCount={100}
            debug={false}
          />
        </Suspense>
      </group>
      <group position={[1, 0, 0]}>
        <Suspense
          fallback={
            <mesh>
              <boxGeometry />
            </mesh>
          }
        >
          <VAT
            mesh="/demo_rigid_body/rigid_body_mesh.fbx"
            P_texture="/demo_rigid_body/rigid_body_pos.exr"
            R_texture="/demo_rigid_body/rigid_body_rot.exr"
            Cd_texture="/demo_rigid_body/rigid_body_col.exr"
            // baseMaterial={THREE.MeshPhysicalMaterial}
            type="rigid"
            fps={24}
            playbackSpeed={1}
            frameCount={100}
            vCd={false}
          />
        </Suspense>
      </group>
      <group position={[-2, 0, 0]} scale={1.0}>
        <Suspense
          fallback={
            <mesh>
              <boxGeometry />
            </mesh>
          }
        >
          <VAT
            mesh="/demo_fluid/fluid_mesh.fbx"
            P_texture="/demo_fluid/fluid_pos.exr"
            R_texture="/demo_fluid/fluid_rot.exr"
            Lookup_texture="/demo_fluid/fluid_lookup.png"
            type="fluid"
            baseMaterial={THREE.MeshPhysicalMaterial}
            color={"lightblue"}
            roughness={0.2}
            metalness={0.1}
            fps={30}
            playbackSpeed={1}
            frameCount={100}
            // wireframe
          />
        </Suspense>
      </group>
    </Canvas>
  );
}
