import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, ContactShadows, OrbitControls, Edges } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { makeGeometry } from './geometry'
import type { PartKind } from '@/components/ui/PartDrawing'

function Sparks({ count = 70 }) {
  const ref = useRef<THREE.Points>(null)
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3), speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) { positions.set([(Math.random() - 0.5) * 5, Math.random() * 4 - 2, (Math.random() - 0.5) * 3], i * 3); speeds[i] = 0.3 + Math.random() * 0.9 }
    return { positions, speeds }
  }, [count])
  useFrame((_, dt) => {
    const p = ref.current?.geometry.attributes.position as THREE.BufferAttribute | undefined
    if (!p) return
    for (let i = 0; i < count; i++) {
      let y = p.getY(i) + speeds[i] * dt; let x = p.getX(i) + Math.sin(y * 3 + i) * dt * 0.15
      if (y > 2.4) { y = -2; x = (Math.random() - 0.5) * 5 }
      p.setXY(i, x, y)
    }
    p.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.035} color="#F7B65A" transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function Part({ kind, geometry, autoRotate = true, pointer }: { kind: PartKind; geometry?: THREE.BufferGeometry; autoRotate?: boolean; pointer?: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const geo = useMemo(() => geometry ?? makeGeometry(kind), [kind, geometry])
  const scale = useMemo(() => {
    geo.computeBoundingBox(); const s = new THREE.Vector3(); geo.boundingBox!.getSize(s)
    return 3 / Math.max(s.x, s.y, s.z)
  }, [geo])
  useFrame((state, dt) => {
    if (!ref.current) return
    if (autoRotate) ref.current.rotation.y += dt * 0.35
    if (pointer) {
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -0.5 + state.pointer.y * 0.25, 0.05)
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, state.pointer.x * 0.15, 0.05)
    }
  })
  return (
    <group ref={ref} rotation={[-0.5, 0.4, 0]}>
      <mesh geometry={geo} scale={scale} castShadow>
        <meshStandardMaterial color="#c3ccd5" metalness={0.88} roughness={0.3} envMapIntensity={1.6} />
        {!geometry && <Edges threshold={25} color="#5BB8EA" scale={1.0005} />}
      </mesh>
    </group>
  )
}

export default function MetalScene({ kind = 'flange', geometry, sparks = false, controls = false, pointer = false, className }: { kind?: PartKind; geometry?: THREE.BufferGeometry; sparks?: boolean; controls?: boolean; pointer?: boolean; className?: string }) {
  return (
    <div className={className}>
      <Canvas dpr={[1, 1.8]} camera={{ position: [0, 0.6, 6], fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[0, 1, 6]} intensity={0.9} color="#dfe8f0" />
          <directionalLight position={[4, 6, 3]} intensity={1.4} color="#ffffff" />
          <pointLight position={[-3, -1, 2]} intensity={14} color="#F0A23B" distance={9} />
          <Part kind={kind} geometry={geometry} autoRotate={!controls} pointer={pointer} />
          {sparks && <Sparks />}
          <ContactShadows position={[0, -1.9, 0]} opacity={0.45} scale={9} blur={2.6} far={4} color="#000" />
          <Environment resolution={256}>
            <Lightformer form="rect" intensity={2.4} position={[0, 0, 8]} scale={[6, 6, 1]} color="#cfd8e0" />
            <Lightformer form="rect" intensity={3} position={[0, 5, -6]} scale={[10, 2, 1]} color="#ffffff" />
            <Lightformer form="rect" intensity={2.2} position={[-6, 1, 0]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color="#8ACDF1" />
            <Lightformer form="rect" intensity={2.6} position={[6, 0, 1]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#F7B65A" />
            <Lightformer form="ring" intensity={1.5} position={[0, -4, 3]} scale={3} color="#7A5AA6" />
          </Environment>
          {controls && <OrbitControls enablePan={false} minDistance={3.5} maxDistance={10} autoRotate autoRotateSpeed={0.8} />}
        </Suspense>
      </Canvas>
    </div>
  )
}
