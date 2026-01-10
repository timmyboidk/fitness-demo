import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';

// Placeholder for SharedValue type
interface SharedValue<T> {
    value: T;
}

interface Props {
    poseSharedValue: SharedValue<any>;
}

export function HumanAvatar({ poseSharedValue }: Props) {
    // Ensure the asset is bundled or handled correctly in real implementation
    // For now using a require that might throw if file missing, wrapping in try/catch or assume assets exist
    // Using a dummy path for compilation safety in this skeletal file
    // const { nodes, materials } = useGLTF(require('../../assets/models/smpl_basic.glb'));

    // Mock nodes/materials for skeletal compliance
    const nodes: any = { root: {}, Mesh: { geometry: {}, skeleton: {} } };
    const materials: any = { Skin: {} };

    const group = useRef<any>();

    useFrame(() => {
        // 从 SharedValue 读取旋转矩阵并应用给骨骼
        if (!poseSharedValue || !poseSharedValue.value) return;
        const rotations = poseSharedValue.value;
        // Example: nodes.Spine.quaternion.set(...)
        // 注意: 这里必须直接操作 threejs 对象，不仅 state update 以保证 30fps
    });

    return (
        <group ref={group} dispose={null}>
            <primitive object={nodes.root} />
            {/* 
      <skinnedMesh
        geometry={nodes.Mesh.geometry}
        material={materials.Skin}
        skeleton={nodes.Mesh.skeleton}
      /> 
      */}
        </group>
    );
}
