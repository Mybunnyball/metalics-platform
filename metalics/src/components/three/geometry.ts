import * as THREE from 'three'
import type { PartKind } from '@/components/ui/PartDrawing'

/** هندسه‌های رویه‌ای قطعات فلزی (بدون نیاز به فایل خارجی) */
function holePath(x: number, y: number, r: number) {
  const p = new THREE.Path()
  p.absarc(x, y, r, 0, Math.PI * 2, true)
  return p
}

export function makeGeometry(kind: PartKind): THREE.BufferGeometry {
  const bevel = { bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 64 }
  if (kind === 'flange') {
    const s = new THREE.Shape(); s.absarc(0, 0, 1.6, 0, Math.PI * 2, false)
    s.holes.push(holePath(0, 0, 0.55))
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; s.holes.push(holePath(Math.cos(a) * 1.15, Math.sin(a) * 1.15, 0.14)) }
    const plate = new THREE.ExtrudeGeometry(s, { depth: 0.32, ...bevel })
    const hubShape = new THREE.Shape(); hubShape.absarc(0, 0, 0.85, 0, Math.PI * 2, false); hubShape.holes.push(holePath(0, 0, 0.55))
    const hub = new THREE.ExtrudeGeometry(hubShape, { depth: 0.9, ...bevel })
    hub.translate(0, 0, 0.32)
    const g = mergeGeoms([plate, hub]); g.center(); return g
  }
  if (kind === 'plate') {
    const s = new THREE.Shape(); s.moveTo(-1.8, -1.2); s.lineTo(1.8, -1.2); s.lineTo(1.8, 1.2); s.lineTo(-1.8, 1.2); s.closePath()
    ;[[-1.4, -0.8], [1.4, -0.8], [-1.4, 0.8], [1.4, 0.8]].forEach(([x, y]) => s.holes.push(holePath(x, y, 0.18)))
    const slot = new THREE.Path(); slot.moveTo(-0.5, -0.35); slot.lineTo(-0.5, 0.35); slot.lineTo(0.5, 0.35); slot.lineTo(0.5, -0.35); slot.closePath(); s.holes.push(slot)
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.22, ...bevel }); g.center(); return g
  }
  if (kind === 'bracket' || kind === 'frame') {
    const s = new THREE.Shape(); const t = 0.2
    s.moveTo(0, 0); s.lineTo(2.4, 0); s.lineTo(2.4, t); s.lineTo(t + 0.25, t); s.quadraticCurveTo(t, t, t, t + 0.25); s.lineTo(t, 1.7); s.lineTo(0, 1.7); s.closePath()
    const g = new THREE.ExtrudeGeometry(s, { depth: 1.4, ...bevel }); g.center()
    return g
  }
  // shaft: لِیث با پله‌ها
  const pts = [[0, -2], [0.38, -2], [0.38, -1.2], [0.5, -1.2], [0.5, 0.6], [0.62, 0.6], [0.62, 1.2], [0.44, 1.2], [0.44, 2], [0, 2]].map(([x, y]) => new THREE.Vector2(x, y))
  const g = new THREE.LatheGeometry(pts, 96); g.rotateZ(Math.PI / 2); g.center(); return g
}

function mergeGeoms(list: THREE.BufferGeometry[]) {
  // ادغام ساده geometryهای non-indexed
  const geoms = list.map((g) => (g.index ? g.toNonIndexed() : g))
  let count = 0; geoms.forEach((g) => (count += g.attributes.position.count))
  const pos = new Float32Array(count * 3), nor = new Float32Array(count * 3)
  let o = 0
  geoms.forEach((g) => { pos.set(g.attributes.position.array as Float32Array, o * 3); nor.set(g.attributes.normal.array as Float32Array, o * 3); o += g.attributes.position.count })
  const out = new THREE.BufferGeometry()
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
  return out
}

/** حجم مش بسته (برای فایل STL واقعی) به واحد مکعب همان مدل */
export function meshVolume(g: THREE.BufferGeometry) {
  const geo = g.index ? g.toNonIndexed() : g
  const p = geo.attributes.position
  let v = 0
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  for (let i = 0; i < p.count; i += 3) {
    a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2)
    v += a.dot(b.clone().cross(c)) / 6
  }
  return Math.abs(v)
}
