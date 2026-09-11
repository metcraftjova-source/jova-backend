import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Grid, OrbitControls, MeshReflectorMaterial, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import sprayGunUrl from '../../assets/3D/SprayGun.glb';

const sprayVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sprayFragmentShader = `
  uniform vec3 color;
  uniform float opacity;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  
  float hash(vec2 p) {
    return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
  }
  
  float noise(vec2 x) {
      vec2 i = floor(x);
      vec2 f = fract(x);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    // Flowing UVs from tip to base (vUv.y=1 is tip, 0 is base)
    vec2 flowUv = vUv;
    flowUv.y += uTime * 3.0;
    
    // Stretch noise to look like paint streaks
    float n1 = noise(vec2(flowUv.x * 25.0, flowUv.y * 4.0));
    float n2 = noise(vec2(flowUv.x * 12.0, flowUv.y * 2.0 - uTime * 1.5));
    float density = n1 * 0.6 + n2 * 0.4;
    
    // Fresnel-like edge fade for volumetric look
    float edgeFade = smoothstep(0.0, 0.5, abs(vNormal.z));
    
    // Fade out towards the base of the cone (where it hits the object)
    float lengthFade = pow(abs(vUv.y), 1.5);
    
    float finalAlpha = density * edgeFade * lengthFade * opacity;
    vec3 finalColor = mix(color, vec3(1.0), density * 0.5);
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

// ─── Error Boundary ───
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    console.error("Canvas Error:", error);
    return { hasError: true, errorInfo: error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexCol: 'column', alignItems: 'center', justifyContent: 'center', background: '#990000', color: 'white', padding: '20px', textAlign: 'center' }}>
          <h2>React Error Boundary Tripped</h2>
          <p>{this.state.errorInfo ? this.state.errorInfo.toString() : "Unknown Error"}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Machined Part Geometries ───
const PartGeometries = ({ materialProps }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Main Cylindrical Body */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 1.8, 5.5, 64]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      {/* Left End Cap (Domed) */}
      <mesh position={[-2.75, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0.45, 1]} castShadow receiveShadow>
        <sphereGeometry args={[1.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>
      
      {/* Right End Cap (Domed) */}
      <mesh position={[2.75, 0, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1, 0.45, 1]} castShadow receiveShadow>
        <sphereGeometry args={[1.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      {/* Flange on the left end cap */}
      <mesh position={[-2.75, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[1.9, 1.9, 0.1, 64]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>
      
      {/* Flange on the right end cap (small weld line or flange) */}
      <mesh position={[2.75, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[1.82, 1.82, 0.05, 64]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      {/* Right End Cap Nozzle 1 (Center) */}
      <group position={[3.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 32]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Right End Cap Nozzle 2 (Upper Front) */}
      <group position={[3.3, 0.6, 0.9]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.8, 32]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Right End Cap Nozzle 3 (Lower Front) */}
      <group position={[3.3, -0.6, 0.9]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.8, 32]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Left End Cap Nozzle 1 (Upper Front) */}
      <group position={[-3.3, 0.5, 0.9]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 32]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Left End Cap Nozzle 2 (Lower Front) */}
      <group position={[-3.3, -0.5, 0.9]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 32]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Top Mounting Plate for Instruments */}
      <mesh position={[-0.5, 1.82, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.05, 0.4]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      {/* Instrument 1: Pressure Gauge */}
      <group position={[-1.2, 1.85, 0]}>
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 16]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        {/* Gauge Dial Face (White) */}
        <mesh position={[0, 0.5, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.01, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Instrument 2: Safety Valve */}
      <group position={[-0.6, 1.85, 0]}>
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Instrument 3: Additional Pipe/Fitting */}
      <group position={[0.1, 1.85, 0]}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Instrument 4: Valve handle */}
      <group position={[0.5, 1.85, 0]}>
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 16]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Supporting Saddles (Stands) - Realistic profile */}
      <group position={[-1.8, -1.6, 0]}>
        <mesh position={[-0.1, -0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.6, 1.8]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0.1, -0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.6, 1.8]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, -0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.1, 2.2]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      </group>
      
      <group position={[1.8, -1.6, 0]}>
        <mesh position={[-0.1, -0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.6, 1.8]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0.1, -0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.6, 1.8]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, -0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.1, 2.2]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      </group>
    </group>
  );
};

// ─── Combined Part (Base + Red Painted Overlay) ───
const MachinedPart = ({ clipPlane }) => {
  return (
    <group>
      {/* Base metal pass (Silvery, high-specular brushed steel matching reference) */}
      <PartGeometries materialProps={{
        color: "#94a3b8", // Lighter silvery grey
        metalness: 1.0,
        roughness: 0.35,
        envMapIntensity: 2.0,
      }} />

      {/* Cyan-Blue Metallic paint pass (clipped) to match reference image */}
      <PartGeometries materialProps={{
        color: "#38bdf8", // Icy metallic blue
        metalness: 0.7,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.5,
        clippingPlanes: clipPlane ? [clipPlane] : [],
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      }} />
    </group>
  );
};

// ─── Robotic Spray Gun Assembly ───
function SprayGunModel(props) {
  const { scene } = useGLTF(sprayGunUrl);
  
  // Ensure the model casts/receives shadows and apply premium materials
  useMemo(() => {
    // Create highly realistic custom materials to override any GLTF defaults
    const customMaterials = {
      Brushed_Aluminum: new THREE.MeshStandardMaterial({
        color: "#94a3b8", // Gunmetal / lighter brushed aluminum
        metalness: 0.85,
        roughness: 0.3,
        envMapIntensity: 1.5,
        side: THREE.DoubleSide,
      }),
      Stainless_Steel: new THREE.MeshStandardMaterial({
        color: "#e2e8f0", 
        metalness: 1.0,
        roughness: 0.15,
        envMapIntensity: 2.5,
        side: THREE.DoubleSide,
      }),
      Black_Anodized: new THREE.MeshStandardMaterial({
        color: "#1e293b", 
        metalness: 0.7,
        roughness: 0.4,
        envMapIntensity: 1.0,
        side: THREE.DoubleSide,
      }),
      Rubber_Black: new THREE.MeshStandardMaterial({
        color: "#0f172a", 
        metalness: 0.1,
        roughness: 0.8,
        side: THREE.DoubleSide,
      }),
      Silicone_Blue: new THREE.MeshStandardMaterial({
        color: "#0284c7", 
        metalness: 0.1,
        roughness: 0.4,
        side: THREE.DoubleSide,
      })
    };

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true; // Re-enabled for realistic depth!
        
        if (child.material) {
          const name = child.material.name;
          if (customMaterials[name]) {
             child.material = customMaterials[name];
          }
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} {...props} />;
}
useGLTF.preload(sprayGunUrl);

const SprayGun = ({ gunRef, sprayRef }) => {
  const outerMatRef = useRef();
  const innerMatRef = useRef();

  useFrame((state) => {
    if (outerMatRef.current) outerMatRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    if (innerMatRef.current) innerMatRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <group ref={gunRef} scale={[2.5, 2.5, 2.5]}>
      {/* 
        The gun's original nozzle points to its local -Y axis, and handle to -X.
        Rotating -90 around X aligns nozzle to +Z (DOWN in world space).
        Rotating -90 around Z spins the handle to point horizontally (RIGHT).
      */}
      
      <group rotation={[0, 0, 0]}>
        <SprayGunModel rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={0.004} />

        {/* --- SPRAY CONE (Pointing to +Z) --- */}
        <group ref={sprayRef} position={[0, 0, 0.65]}>
          <group position={[0, 0, 0.45]} rotation={[-Math.PI/2, 0, 0]}>
            <mesh>
              <coneGeometry args={[0.25, 0.9, 32, 1, true]} />
              <shaderMaterial
                ref={outerMatRef}
                uniforms={{
                  color: { value: new THREE.Color("#0284c7") },
                  opacity: { value: 0.8 },
                  uTime: { value: 0 }
                }}
                vertexShader={sprayVertexShader}
                fragmentShader={sprayFragmentShader}
                transparent={true}
                depthWrite={false}
                side={THREE.DoubleSide}
                blending={THREE.NormalBlending}
              />
            </mesh>
            <mesh>
              <coneGeometry args={[0.1, 0.9, 32, 1, true]} />
              <shaderMaterial
                ref={innerMatRef}
                uniforms={{
                  color: { value: new THREE.Color("#38bdf8") },
                  opacity: { value: 1.0 },
                  uTime: { value: 0 }
                }}
                vertexShader={sprayVertexShader}
                fragmentShader={sprayFragmentShader}
                transparent={true}
                depthWrite={false}
                side={THREE.DoubleSide}
                blending={THREE.NormalBlending}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

// ─── 3D Scene ───
export function PremiumCoatingScene({ disableAnimations = false, hideEnvironment = false }) {
  const gunRef = useRef();
  const sprayRef = useRef();

  // Plane to clip (hide) the unpainted portion
  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), -10), []);

  // Pre-allocate vector to avoid GC spikes every frame
  const targetLocalRef = useRef(new THREE.Vector3());
  const currentGunPosRef = useRef(new THREE.Vector3());
  const lastGunPosRef = useRef(new THREE.Vector3());
  const hasInitGunPosRef = useRef(false);
  const targetPointRef = useRef(new THREE.Vector3());
  const directionRef = useRef(new THREE.Vector3());
  const targetQuatRef = useRef(new THREE.Quaternion());
  const wobbleQuatRef = useRef(new THREE.Quaternion());
  const wobbleEulerRef = useRef(new THREE.Euler());
  const localForwardRef = useRef(new THREE.Vector3(0, 0, 1));

  useFrame((state, delta) => {
    try {
      if (disableAnimations) return;
      const t = state.clock.getElapsedTime();

      const duration = 7;
      const cycle = (t % duration) / duration;

      let sweep = -5.25;
      let isSpraying = false;

      if (cycle < 0.20) {
        sweep = -5.25;
        isSpraying = false;
      } else if (cycle < 0.85) {
        const progress = (cycle - 0.20) / 0.65;
        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(Math.abs(-2 * progress + 2), 2) / 2;
        sweep = -5.25 + ease * 10.5;
        isSpraying = sweep > -3.8 && sweep < 3.8;
      } else if (cycle < 0.92) {
        sweep = 5.25;
        isSpraying = false;
      } else {
        const progress = (cycle - 0.92) / 0.08;
        sweep = 5.25 - Math.pow(Math.abs(progress), 3) * 10.5;
        isSpraying = false;
      }

      // Palette UI selection animation
      const cursor = document.getElementById('palette-cursor');
      const wheelContainer = document.getElementById('palette-wheel-container');
      const wheelRing = document.getElementById('palette-wheel-ring');
      const innerBall = document.getElementById('palette-inner-ball');
      const sliderContainer = document.getElementById('palette-slider-container');
      const sliderThumb = document.getElementById('palette-slider-thumb');
      const blueSwatch = document.getElementById('palette-blue-swatch');

      if (cursor && wheelContainer && wheelRing && innerBall) {
        const parent = cursor.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          
          const wheelRect = wheelContainer.getBoundingClientRect();
          const wheelCenterX = (wheelRect.left - parentRect.left) + wheelRect.width / 2;
          const wheelCenterY = (wheelRect.top - parentRect.top) + wheelRect.height / 2;
          
          const sliderRect = sliderContainer ? sliderContainer.getBoundingClientRect() : null;
          const sliderX = sliderRect ? (sliderRect.left - parentRect.left) : 0;
          const sliderY = sliderRect ? (sliderRect.top - parentRect.top) + sliderRect.height / 2 : 0;
          const sliderWidth = sliderRect ? sliderRect.width : 176;

          if (cycle < 0.20) {
            cursor.style.opacity = '1';
            
            if (cycle < 0.04) {
              const progress = cycle / 0.04;
              const ease = 1 - Math.pow(Math.abs(1 - progress), 3);
              const startX = wheelCenterX + 120;
              const startY = wheelCenterY + 120;
              const targetX = wheelCenterX + 80;
              const targetY = wheelCenterY;
              cursor.style.transform = `translate(${startX + (targetX - startX) * ease}px, ${startY + (targetY - startY) * ease}px) scale(1)`;
              wheelRing.style.transform = `translate(80px, 0px)`;
              innerBall.style.boxShadow = 'none';
              innerBall.style.filter = 'grayscale(100%) brightness(50%)';
              if(blueSwatch) blueSwatch.style.filter = 'grayscale(100%) brightness(50%)';
              if(sliderContainer) sliderContainer.style.filter = 'grayscale(100%) brightness(50%)';
              if(sliderThumb) sliderThumb.style.left = `33%`;
            } else if (cycle < 0.08) {
              const progress = (cycle - 0.04) / 0.04;
              const angle = 0 + progress * 3.14159;
              const ringX = 80 * Math.cos(angle);
              const ringY = 80 * Math.sin(angle);
              cursor.style.transform = `translate(${wheelCenterX + ringX}px, ${wheelCenterY + ringY}px) scale(0.9)`;
              wheelRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
              innerBall.style.boxShadow = 'none';
              innerBall.style.filter = `grayscale(${100 - progress * 100}%) brightness(${50 + progress * 50}%)`;
              if(blueSwatch) blueSwatch.style.filter = `grayscale(${100 - progress * 100}%) brightness(${50 + progress * 50}%)`;
              if(sliderContainer) sliderContainer.style.filter = 'grayscale(100%) brightness(50%)';
              if(sliderThumb) sliderThumb.style.left = `33%`;
            } else if (cycle < 0.12) {
              const progress = (cycle - 0.08) / 0.04;
              const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(Math.abs(-2 * progress + 2), 2) / 2;
              const startX = wheelCenterX - 80;
              const startY = wheelCenterY;
              const targetX = sliderX + (sliderWidth * 0.33);
              const targetY = sliderY;
              cursor.style.transform = `translate(${startX + (targetX - startX) * ease}px, ${startY + (targetY - startY) * ease}px) scale(1)`;
              wheelRing.style.transform = `translate(-80px, 0px)`;
              innerBall.style.boxShadow = '0 0 25px 8px #38bdf8';
              innerBall.style.filter = 'grayscale(0%) brightness(100%)';
              if(blueSwatch) blueSwatch.style.filter = 'grayscale(0%) brightness(100%)';
              if(sliderContainer) sliderContainer.style.filter = 'grayscale(100%) brightness(50%)';
              if(sliderThumb) sliderThumb.style.left = `33%`;
            } else if (cycle < 0.16) {
              const progress = (cycle - 0.12) / 0.04;
              const currentPercent = 33 + progress * 37;
              const thumbX = sliderWidth * (currentPercent / 100);
              cursor.style.transform = `translate(${sliderX + thumbX}px, ${sliderY}px) scale(0.9)`;
              wheelRing.style.transform = `translate(-80px, 0px)`;
              innerBall.style.boxShadow = '0 0 25px 8px #38bdf8';
              innerBall.style.filter = 'grayscale(0%) brightness(100%)';
              if(blueSwatch) blueSwatch.style.filter = 'grayscale(0%) brightness(100%)';
              if(sliderContainer) sliderContainer.style.filter = `grayscale(${100 - progress * 100}%) brightness(${50 + progress * 50}%)`;
              if(sliderThumb) sliderThumb.style.left = `${currentPercent}%`;
            } else {
              const progress = (cycle - 0.16) / 0.04;
              cursor.style.opacity = 1 - progress;
              const targetX = sliderX + (sliderWidth * 0.70);
              cursor.style.transform = `translate(${targetX + 20 * progress}px, ${sliderY + 20 * progress}px) scale(1)`;
              wheelRing.style.transform = `translate(-80px, 0px)`;
              innerBall.style.boxShadow = '0 0 25px 8px #38bdf8';
              innerBall.style.filter = 'grayscale(0%) brightness(100%)';
              if(blueSwatch) blueSwatch.style.filter = 'grayscale(0%) brightness(100%)';
              if(sliderContainer) sliderContainer.style.filter = 'grayscale(0%) brightness(100%)';
              if(sliderThumb) sliderThumb.style.left = `70%`;
            }
          } else {
            cursor.style.opacity = '0';
            const isSweeping = cycle >= 0.20 && cycle < 0.85;
            const isResetting = cycle >= 0.92;
            
            if (isResetting) {
              const progress = (cycle - 0.92) / 0.08;
              innerBall.style.boxShadow = 'none';
              innerBall.style.filter = `grayscale(${progress * 100}%) brightness(${100 - progress * 50}%)`;
              if(blueSwatch) blueSwatch.style.filter = `grayscale(${progress * 100}%) brightness(${100 - progress * 50}%)`;
              if(sliderContainer) sliderContainer.style.filter = `grayscale(${progress * 100}%) brightness(${100 - progress * 50}%)`;
              wheelRing.style.transform = `translate(${ -80 + 160 * progress }px, 0px)`;
              if(sliderThumb) sliderThumb.style.left = `${70 - 37 * progress}%`;
            } else {
              innerBall.style.boxShadow = isSweeping ? '0 0 25px 8px #38bdf8' : 'none';
              innerBall.style.filter = 'grayscale(0%) brightness(100%)';
              if(blueSwatch) blueSwatch.style.filter = 'grayscale(0%) brightness(100%)';
              if(sliderContainer) sliderContainer.style.filter = 'grayscale(0%) brightness(100%)';
              wheelRing.style.transform = `translate(-80px, 0px)`;
              if(sliderThumb) sliderThumb.style.left = `70%`;
            }
          }
        }
      }

      if (gunRef.current) {
        // The target point on the object where the paint hits (top surface)
        // Tank is in a group at Y = -0.5, and cylinder radius is 1.8. 
        // So the actual world top surface is -0.5 + 1.8 = 1.3.
        const targetX = sweep || 0;
        const targetY = 1.3; // True world top of the tank
        const targetZ = 0.0; // Center depth
        
        // Normalized sweep distance from center (approx -1 to 1)
        const dist = targetX / 5.25;
        const distSq = dist * dist;
        
        // Position directly overhead, moving exactly with sweep X
        const idealGunX = targetX; 
        // Arc Y: dips at extremes, rises at center. 
        // Base gap is 2.7 units above the tank (1.3 + 2.7 = 4.0) to clear the 1.625 length of the gun. 
        // Arc pushes it up to 4.3 at the center.
        const idealGunY = 4.0 + (1.0 - distSq) * 0.3 + Math.sin(t * 10) * 0.02;
        // Arc Z: pushed back at center (0.0), pulled closer at extremes
        const idealGunZ = distSq * 0.4;

        if (!hasInitGunPosRef.current) {
          currentGunPosRef.current.set(idealGunX, idealGunY, idealGunZ);
          hasInitGunPosRef.current = true;
        }

        lastGunPosRef.current.copy(currentGunPosRef.current);

        // Frame-rate independent lerp with damping factor 8.0
        const safeDelta = Math.max(delta, 0.001);
        const lerpFactor = 1.0 - Math.exp(-8.0 * safeDelta);
        
        currentGunPosRef.current.x += (idealGunX - currentGunPosRef.current.x) * lerpFactor;
        currentGunPosRef.current.y += (idealGunY - currentGunPosRef.current.y) * lerpFactor;
        currentGunPosRef.current.z += (idealGunZ - currentGunPosRef.current.z) * lerpFactor;

        // Calculate velocity (units per second)
        const velX = (currentGunPosRef.current.x - lastGunPosRef.current.x) / safeDelta;

        gunRef.current.position.copy(currentGunPosRef.current);
        
        // Compute the target point from the current sweep position and aim the gun at it
        targetPointRef.current.set(targetX, targetY, targetZ);
        directionRef.current.copy(targetPointRef.current).sub(currentGunPosRef.current).normalize();
        
        // Use a quaternion to calculate the shortest robotic arc rotation instead of abrupt lookAt()
        // The local forward axis (nozzle direction) is +Z based on our inner SprayGunModel rotations
        targetQuatRef.current.setFromUnitVectors(localForwardRef.current, directionRef.current);

        // Apply physical wobble and tilt from velocity to the target quaternion
        wobbleEulerRef.current.set(Math.sin(t * 5) * 0.03, 0, -velX * 0.035, 'XYZ');
        wobbleQuatRef.current.setFromEuler(wobbleEulerRef.current);
        targetQuatRef.current.multiply(wobbleQuatRef.current);
        
        // Smoothly slerp the gun's current rotation toward the target to avoid sudden flips and jitter
        gunRef.current.quaternion.slerp(targetQuatRef.current, 10.0 * safeDelta);

        // Scale spray cone precisely to the gap distance
        if (sprayRef.current) {
          sprayRef.current.visible = isSpraying;
          if (isSpraying) {
            const flicker = 0.8 + Math.random() * 0.2;
            // Dynamically calculate the actual 3D distance between the gun and the exact paint target
            const gap = currentGunPosRef.current.distanceTo(targetPointRef.current);
            // gunRef is scaled by 2.5, so sprayRef at 0.65 is 1.625 units away from the gun center.
            // Scale the cone length so its tip perfectly reaches the target point without overshooting
            const coneNeededLength = Math.max(0.1, gap - 1.625);
            // Since cone aligns with Z axis, scale Z. Base length is 0.9 * 2.5 (parent scale) = 2.25.
            sprayRef.current.scale.set(flicker, flicker, coneNeededLength / 2.25);
          }
        }
      }

      // Update clipping plane constant using WORLD SPACE coordinates!
      if (gunRef.current && gunRef.current.parent) {
        targetLocalRef.current.set(sweep || 0, 0, 0);
        const targetWorld = gunRef.current.parent.localToWorld(targetLocalRef.current);
        if (!isNaN(targetWorld.x)) {
          clipPlane.constant = targetWorld.x;
        }
      }
    } catch (e) {
      console.error("useFrame Error:", e);
    }
  });

  return (
    <>
      {/* Moody Cinematic Lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Main overhead highlight creating the strong horizontal specular streak */}
      <spotLight
        position={[0, 15, 5]}
        angle={0.8}
        penumbra={0.2}
        intensity={6}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.05}
      />
      
      {/* Neutral fill light to replicate the studio setup in the image */}
      <directionalLight position={[-10, 2, 8]} intensity={1.5} color="#e2e8f0" />
      
      {/* Subtle rim light from behind to pop the cylinder edges */}
      <directionalLight position={[5, 2, -10]} intensity={1.0} color="#cbd5e1" />

      {!hideEnvironment && <Environment preset="city" environmentIntensity={0.2} />}

      {/* The component being painted */}
      <group position={[0, -0.5, 0]}>
        <MachinedPart clipPlane={clipPlane} />
      </group>

      {/* Robotic spray gun */}
      <SprayGun gunRef={gunRef} sprayRef={sprayRef} />

      {/* ── High-Tech Cinematic Background Floor ── */}
      <group position={[0, -2.31, 0]}>
        {/* Mirror Glossy Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[500, 500]} />
          <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={15} // Strong reflection
            roughness={0.6} // Slightly frosted
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#080c14" // Very dark slate
            metalness={0.8}
          />
        </mesh>

        {/* Glowing Technical Grid */}
        <Grid
          args={[500, 500]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#1e293b"
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor="#38bdf8" // Cyan glow
          fadeDistance={30}
          fadeStrength={1.5}
          position={[0, 0.01, 0]} // Slightly above floor
        />

      </group>
    </>
  );
};

// ─── Main Component ───
export default function PremiumCoating() {
  return (
    <div className="relative w-full h-[800px] bg-[#030712] overflow-hidden font-sans border-t border-white/10">

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 6, 16], fov: 38 }}
            shadows
            gl={{ localClippingEnabled: true, antialias: true }}
          >
            <React.Suspense fallback={null}>
              <PremiumCoatingScene />
            </React.Suspense>
            <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={0} />
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* HUD Overlay - matching the reference image style */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-12">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="w-16 h-[2px] bg-cyan-400 mb-4 flex items-center">
              <div className="w-2 h-2 bg-cyan-400 -ml-1"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wider uppercase leading-tight drop-shadow-lg">
              Premium Coating<br />& Finishing
            </h2>
          </div>

          {/* Tech details right */}
          <div className="text-right flex flex-col items-end gap-3 text-white/60 text-sm font-mono mt-4">
            <div className="flex items-center gap-4">
              <span className="w-8 h-[1px] bg-cyan-500/50"></span>
              <span>TOL: 0.001MM</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-12 h-[1px] bg-cyan-500/50"></span>
              <span>VOC: COMPLIANT</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-16 h-[1px] bg-cyan-500/50"></span>
              <span>THICKNESS: 50μm</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/50 text-xs font-bold">
                ACTIVE
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4 text-white/50 font-mono tracking-widest text-sm">
            <div className="w-6 h-6 border border-white/40 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            </div>
            <span>5X1CM</span>
          </div>

          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
          </div>
        </div>

        {/* Reticle / Crosshair elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full pointer-events-none"></div>

        {/* Corner brackets */}
        <div className="absolute top-1/3 left-1/4 w-8 h-8 border-t-2 border-l-2 border-white/20 pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 border-t-2 border-r-2 border-white/20 pointer-events-none"></div>
        <div className="absolute bottom-1/3 left-1/4 w-8 h-8 border-b-2 border-l-2 border-white/20 pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-8 h-8 border-b-2 border-r-2 border-white/20 pointer-events-none"></div>
      </div>

      {/* Background ambient gradients */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030712] via-transparent to-[#030712] z-0"></div>
    </div>
  );
}