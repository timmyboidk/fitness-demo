import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';

// SharedValue 类型占位符
interface SharedValue<T> {
    value: T;
}

interface Props {
    poseSharedValue: SharedValue<any>;
}

export function HumanAvatar({ poseSharedValue }: Props) {
    // 确保资源已被捆绑或正确处理
    // 目前使用 require，如果文件缺失可能会抛出错误，建议在实际实现中包裹 try/catch 或确保资源存在
    // 这里使用虚拟路径以保证骨架文件编译安全
    // const { nodes, materials } = useGLTF(require('../../assets/models/smpl_basic.glb'));

    // Mock 节点和材质以符合骨架要求
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
