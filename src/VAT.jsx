import { useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useFBX, useGLTF, useTexture } from "@react-three/drei";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import * as vat_shader from "./VAT_shaders";

import { useControls } from "leva";

function FBX({ url, material }) {
  const fbx = useFBX(url);

  return <mesh {...fbx.children[0]} material={material} />;
}

function GLTF({ url, material, assignTo }) {
  const gltf = useGLTF(url);

  gltf.scene.traverse((obj) => {
    if (assignTo.includes(obj.name)) {
      obj.material = material;
    }
  });

  return <primitive object={gltf.scene} />;
}

function Model({ url, assignTo, material }) {
  if (url.endsWith("fbx")) return <FBX url={url} material={material} />;

  return <GLTF url={url} material={material} assignTo={assignTo} />;
}

const Color = ({ url, setColTexture, Loader }) => {
  const colTexture = useLoader(Loader, url);
  colTexture.magFilter = THREE.NearestFilter;
  colTexture.format = THREE.RGBAFormat;
  useEffect(() => setColTexture(colTexture), []);

  return null;
};

const LookUp = ({ url, setLookupTexture }) => {
  const luTexture = useTexture(url, (texture) => {
    texture.magFilter = THREE.NearestFilter;
    // texture.format = THREE.RGBAFormat;
  });
  useEffect(() => setLookupTexture(luTexture), []);

  return null;
};

export default function VAT({
  mesh,
  assignTo,
  P_texture,
  R_texture,
  Cd_texture,
  Lookup_texture,
  Tangent_texture,
  type = "rigid",
  fps = 30,
  playbackSpeed = 1,
  frameCount = 99,
  vCd = false,
  legacy = false,
  debug = false,
  ...props
}) {
  const Loader = P_texture.endsWith("exr") ? EXRLoader : THREE.TextureLoader;
  const [colTexture, setColTexture] = useState(null);
  const [lookupTexture, setLookupTexture] = useState(null);

  const posTexture = useLoader(Loader, P_texture);
  posTexture.magFilter = THREE.NearestFilter;
  posTexture.format = THREE.RGBAFormat;

  const rotTexture = useLoader(Loader, R_texture);
  rotTexture.magFilter = THREE.NearestFilter;
  rotTexture.format = THREE.RGBAFormat;

  let vtxShader = vat_shader.softVertexShader;

  switch (type) {
    case "rigid":
      vtxShader = vat_shader.rigidVertexShader;
      break;
    case "soft":
      vtxShader = legacy
        ? vat_shader.legacySoftVertexShader
        : vat_shader.softVertexShader;
      break;
    case "fluid":
      vtxShader = vat_shader.fluidVertexShader;
      break;
    default:
      vtxShader = vat_shader.softVertexShader;
  }

  const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshNormalMaterial,
    vertexShader: vtxShader,
    fragmentShader: vCd ? vat_shader.fragmentShader : null,
    uniforms: {
      houdiniFPS: {
        value: fps,
      },
      uTime: {
        value: 0.5,
      },
      uFrame: {
        value: 1,
      },
      playbackSpeed: {
        value: playbackSpeed,
      },
      numOfFrames: {
        value: frameCount,
      },
      posTexture: {
        value: posTexture,
      },
      rotTexture: {
        value: rotTexture,
      },
      colTexture: {
        value: colTexture,
      },
      lookupTexture: {
        value: lookupTexture,
      },
    },
    side: THREE.DoubleSide,
    ...props,
  });

  useFrame(({ clock }) => {
    if (!debug) {
      material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  const DebugControls = ({ material }) => {
    useControls(
      () => ({
        iFrame: {
          value: 1,
          min: 0,
          max: frameCount,
          step: 1,
          onChange: (v) => {
            material.uniforms.uTime.value = v / fps;
          },
        },
      }),
      [material]
    );
  };

  return (
    <>
      <Model url={mesh} assignTo={assignTo} material={material} />
      {Cd_texture && (
        <Color url={Cd_texture} setColTexture={setColTexture} Loader={Loader} />
      )}
      {Lookup_texture && (
        <LookUp url={Lookup_texture} setLookupTexture={setLookupTexture} />
      )}
      {debug && <DebugControls material={material} />}
    </>
  );
}
