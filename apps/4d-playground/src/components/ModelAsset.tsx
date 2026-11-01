import { Clone, useGLTF } from '@react-three/drei';

interface ModelAssetProps {
  url: string;
}

export function ModelAsset({ url }: ModelAssetProps) {
  const gltf = useGLTF(url);
  return <Clone object={gltf.scene} castShadow receiveShadow />;
}
