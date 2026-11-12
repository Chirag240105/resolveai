'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  CheckCircle2,
  CreditCard,
  Truck,
  MessageSquare,
  Scale,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';

interface EvidenceNodeConfig {
  id: string;
  label: string;
  detail: string;
  tag: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  glowColor: string;
  coords3D: [number, number, number]; // 3D world space
  screenPos: React.CSSProperties; // 2D layout anchor
}

const EVIDENCE_NODES: EvidenceNodeConfig[] = [
  {
    id: 'order',
    label: 'Order Verification',
    detail: 'ORD-9901-INR · $189.99',
    tag: 'Bose QuietComfort 45',
    status: 'Verified Match',
    icon: CheckCircle2,
    color: '#35D39A',
    glowColor: 'rgba(53, 211, 154, 0.45)',
    coords3D: [-2.5, 1.35, 0.2],
    screenPos: { left: '1%', top: '16%' },
  },
  {
    id: 'payment',
    label: 'Payment Confirmation',
    detail: 'CAP-9901-INR · Settled',
    tag: '3DS Authenticated',
    status: 'Seller Protected',
    icon: CreditCard,
    color: '#536CFF',
    glowColor: 'rgba(83, 108, 255, 0.45)',
    coords3D: [2.5, 1.45, -0.2],
    screenPos: { right: '1%', top: '18%' },
  },
  {
    id: 'delivery',
    label: 'Delivery Evidence',
    detail: 'USPS 9400111899562537',
    tag: 'Delivered · Seattle 98101',
    status: 'GPS Confirmed',
    icon: Truck,
    color: '#963FFF',
    glowColor: 'rgba(150, 63, 255, 0.45)',
    coords3D: [-2.6, -0.95, 0.3],
    screenPos: { left: '1%', top: '78%' },
  },
  {
    id: 'chat',
    label: 'Customer Communication',
    detail: 'Zendesk Ticket #8912',
    tag: 'Factual Retention Record',
    status: 'Admissible Evidence',
    icon: MessageSquare,
    color: '#F5B942',
    glowColor: 'rgba(245, 185, 66, 0.45)',
    coords3D: [2.6, -0.85, 0.1],
    screenPos: { right: '1%', top: '76%' },
  },
  {
    id: 'completeness',
    label: 'Evidence Completeness',
    detail: 'Deterministic Score: 92/100',
    tag: 'Zero-Hallucination Grounding',
    status: 'Ready for Review',
    icon: Scale,
    color: '#713BFF',
    glowColor: 'rgba(113, 59, 255, 0.55)',
    coords3D: [0, 2.5, 0.4],
    screenPos: { left: '50%', top: '3%', transform: 'translateX(-50%)' },
  },
];

export const HeroScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // References to communicate React state directly to the Three.js render loop without re-instantiation
  const activeNodeRef = useRef<string | null>(null);
  useEffect(() => {
    activeNodeRef.current = activeNodeId;
  }, [activeNodeId]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. WebGL Verification
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 640;

    // 2. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // =========================================================================
    // 3. CRYSTALLINE HOLOGRAPHIC EVIDENCE SHIELD CORE
    // =========================================================================
    // Create an authentic 3D faceted shield geometry using custom curved extrusions
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 1.45);
    shieldShape.bezierCurveTo(1.15, 1.4, 1.35, 0.75, 1.25, 0.05);
    shieldShape.bezierCurveTo(1.15, -0.75, 0.45, -1.45, 0, -1.8);
    shieldShape.bezierCurveTo(-0.45, -1.45, -1.15, -0.75, -1.25, 0.05);
    shieldShape.bezierCurveTo(-1.35, 0.75, -1.15, 1.4, 0, 1.45);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.12,
      bevelThickness: 0.14,
    };

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeo.center();

    // High-refraction Physical Glass Material for Outer Crystalline Armor
    const shieldMat = new THREE.MeshPhysicalMaterial({
      color: 0x824eff,
      emissive: 0x3d1796,
      emissiveIntensity: 0.45,
      roughness: 0.12,
      metalness: 0.15,
      transmission: 0.88,
      thickness: 1.35,
      ior: 1.52,
      specularIntensity: 1.0,
      specularColor: 0xd6c7ff,
      transparent: true,
      opacity: 0.82,
    });

    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    mainGroup.add(shieldMesh);

    // Fine Crystalline Edge Highlights
    const edgesGeo = new THREE.EdgesGeometry(shieldGeo, 18);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xc4a3ff,
      transparent: true,
      opacity: 0.45,
      linewidth: 1,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    shieldMesh.add(edgesMesh);

    // =========================================================================
    // 4. LUMINOUS INTERNAL INTELLIGENCE CORE
    // =========================================================================
    // Internal floating multi-faceted energy crystal
    const innerCoreGeo = new THREE.OctahedronGeometry(0.55, 1);
    const innerCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0x536cff,
      emissive: 0x713bff,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.8,
      wireframe: false,
      transparent: true,
      opacity: 0.95,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    shieldMesh.add(innerCore);

    // Inner wireframe coordinate cage
    const innerWireGeo = new THREE.IcosahedronGeometry(0.72, 1);
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const innerWire = new THREE.Mesh(innerWireGeo, innerWireMat);
    shieldMesh.add(innerWire);

    // Pulsing Core Point Light
    const coreLight = new THREE.PointLight(0x963fff, 3.5, 9);
    shieldMesh.add(coreLight);

    // =========================================================================
    // 5. CONTROLLED HOLOGRAPHIC ORBITAL RINGS & RADAR TICK DISKS
    // =========================================================================
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.016, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x713bff,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 8;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.65, 0.012, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x536cff,
      transparent: true,
      opacity: 0.32,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = -Math.PI / 6;
    mainGroup.add(ring2);

    // =========================================================================
    // 6. INTERCONNECTED DATA PATHS FROM NODES TO CORE
    // =========================================================================
    interface DataPathLine {
      id: string;
      curve: THREE.QuadraticBezierCurve3;
      lineMesh: THREE.Line;
      pulseMesh: THREE.Mesh;
      baseColor: number;
    }

    const dataPaths: DataPathLine[] = [];
    const pulseGeometry = new THREE.SphereGeometry(0.045, 12, 12);

    EVIDENCE_NODES.forEach((node) => {
      const start = new THREE.Vector3(...node.coords3D);
      const end = new THREE.Vector3(0, 0, 0);
      // Midpoint pulled outward slightly to create elegant curves
      const mid = new THREE.Vector3(
        node.coords3D[0] * 0.5,
        node.coords3D[1] * 0.5 + (node.coords3D[1] > 0 ? -0.2 : 0.2),
        node.coords3D[2] * 0.5 + 0.3
      );

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(36);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(node.color),
        transparent: true,
        opacity: 0.28,
      });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      mainGroup.add(lineMesh);

      // Moving photon pulse traversing along this curve
      const pulseMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
        transparent: true,
        opacity: 0.9,
      });
      const pulseMesh = new THREE.Mesh(pulseGeometry, pulseMat);
      mainGroup.add(pulseMesh);

      dataPaths.push({
        id: node.id,
        curve,
        lineMesh,
        pulseMesh,
        baseColor: new THREE.Color(node.color).getHex(),
      });
    });

    // =========================================================================
    // 7. AMBIENT DATA PARTICLES DUST
    // =========================================================================
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 7.5;
      particlePositions[i + 1] = (Math.random() - 0.5) * 7.0;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4.5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc4b5fd,
      size: 0.04,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // =========================================================================
    // 8. SCENE LIGHTING
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xd8b4fe, 2.8);
    dirLight1.position.set(3, 4, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x536cff, 2.2);
    dirLight2.position.set(-4, -3, 3);
    scene.add(dirLight2);

    // =========================================================================
    // 9. POINTER PARALLAX & EVENT LISTENERS
    // =========================================================================
    let targetRotX = 0;
    let targetRotY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.35;
      targetRotX = -y * 0.35;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // 10. ANIMATION TICK LOOP
    // =========================================================================
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle Crystalline Shield breathing and rotation
      shieldMesh.rotation.y = Math.sin(elapsed * 0.45) * 0.22;
      shieldMesh.rotation.x = Math.cos(elapsed * 0.35) * 0.12;

      // Inner Core multi-axial rotation
      innerCore.rotation.x = elapsed * 0.8;
      innerCore.rotation.y = elapsed * 0.6;
      innerWire.rotation.y = -elapsed * 0.5;

      // Orbital rings counter-rotation
      ring1.rotation.z = elapsed * 0.22;
      ring2.rotation.z = -elapsed * 0.18;

      // Particle system drift
      particles.rotation.y = elapsed * 0.03;

      // Dampened mouse parallax
      mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.06;
      mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.06;

      // Animate data path pulses traveling along curves
      const activeId = activeNodeRef.current;
      dataPaths.forEach((dp, idx) => {
        // Individual speed offset for each line
        const speed = 0.45 + (idx % 3) * 0.12;
        const t = (elapsed * speed) % 1;
        const pos = dp.curve.getPoint(t);
        dp.pulseMesh.position.copy(pos);

        // Highlight activated connection line and pulse core
        const isSelected = activeId === dp.id;
        const mat = dp.lineMesh.material as THREE.LineBasicMaterial;
        const targetOpacity = isSelected ? 0.95 : 0.22;
        mat.opacity += (targetOpacity - mat.opacity) * 0.15;
      });

      // Illuminate internal core if a node is hovered
      const targetIntensity = activeId ? 6.5 : 3.2;
      coreLight.intensity += (targetIntensity - coreLight.intensity) * 0.12;

      renderer.render(scene, camera);
    };
    animate();

    // =========================================================================
    // 11. CLEANUP ON UNMOUNT
    // =========================================================================
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      shieldGeo.dispose();
      shieldMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      innerWireGeo.dispose();
      innerWireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      pulseGeometry.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      dataPaths.forEach((dp) => {
        dp.lineMesh.geometry.dispose();
        (dp.lineMesh.material as THREE.Material).dispose();
        (dp.pulseMesh.material as THREE.Material).dispose();
      });

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[620px] mx-auto flex items-center justify-center select-none">
      {/* Dynamic Radial Aura Glow */}
      <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-[#713BFF]/30 via-[#963FFF]/20 to-[#536CFF]/25 blur-[90px] pointer-events-none -z-10 animate-pulse-slow" />

      {/* WebGL Canvas or Fallback */}
      {hasWebGL ? (
        <div ref={mountRef} className="w-full h-full relative" />
      ) : (
        /* Accessible High-Fidelity Static Fallback */
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="w-64 h-80 rounded-3xl border border-violet-primary/50 bg-gradient-to-b from-[#1c1642]/80 to-[#0d0d24]/90 backdrop-blur-2xl flex flex-col items-center justify-center shadow-[0_0_60px_rgba(113,59,255,0.4)]">
            <div className="p-4 rounded-2xl bg-violet-primary/20 border border-violet-primary/40 text-violet-light mb-4 shadow-[0_0_30px_rgba(113,59,255,0.6)]">
              <Shield className="w-12 h-12" />
            </div>
            <span className="font-heading text-lg font-bold text-text-primary">
              Holographic Core
            </span>
            <span className="font-mono text-xs text-violet-light mt-1">
              Active Defense Engine
            </span>
          </div>
        </div>
      )}

      {/* 5 HOLOGRAPHIC FLOATING EVIDENCE NODES */}
      <div className="absolute inset-0 pointer-events-none">
        {EVIDENCE_NODES.map((node) => {
          const Icon = node.icon;
          const isActive = activeNodeId === node.id;

          return (
            <div
              key={node.id}
              className="absolute pointer-events-auto transition-all duration-300"
              style={node.screenPos}
              onMouseEnter={() => setActiveNodeId(node.id)}
              onMouseLeave={() => setActiveNodeId(null)}
            >
              <div
                className={`holo-node flex items-center gap-3 px-3.5 py-2.5 rounded-xl border backdrop-blur-2xl transition-all duration-300 ${
                  isActive
                    ? 'holo-node-active border-[rgba(164,125,255,0.7)] shadow-[0_0_30px_rgba(113,59,255,0.45)]'
                    : 'border-[rgba(164,125,255,0.22)]'
                }`}
              >
                {/* Glowing Icon Well */}
                <div
                  className="p-2 rounded-lg border flex items-center justify-center shrink-0 transition-transform duration-300"
                  style={{
                    backgroundColor: `${node.color}18`,
                    borderColor: `${node.color}55`,
                    color: node.color,
                    boxShadow: isActive ? `0 0 16px ${node.glowColor}` : 'none',
                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Structured Text Metadata */}
                <div className="text-left whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white tracking-tight font-sans">
                      {node.label}
                    </span>
                    {node.id === 'order' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-[#E8E5F7] mt-0.5 font-semibold">
                    {node.detail}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded border leading-none font-bold shadow-sm"
                      style={{
                        backgroundColor: `${node.color}22`,
                        borderColor: `${node.color}65`,
                        color: node.color,
                      }}
                    >
                      {node.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
