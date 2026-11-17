import { useEffect, useRef, useState } from 'react';
import { RotateCcw, MoveUpRight } from 'lucide-react';

export default function Structure() {
  const mount = useRef(null);
  const resetRef = useRef(() => {});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let disposed = false, cleanup = () => {};
    import('./three-runtime.js').then((THREE) => {
      if (disposed || !mount.current) return;
      const host = mount.current;
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
      catch { return; }
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(8.5, 6.2, 10.5); camera.lookAt(0, 0.2, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75)); renderer.setClearColor(0x000000, 0); host.appendChild(renderer.domElement);
      const group = new THREE.Group(); group.rotation.y = -0.3; scene.add(group);
      const pale = new THREE.LineBasicMaterial({ color: 0xb4b7a3, transparent: true, opacity: 0.62 });
      const dim = new THREE.LineBasicMaterial({ color: 0x727764, transparent: true, opacity: 0.3 });
      const orange = new THREE.LineBasicMaterial({ color: 0xee8b53, transparent: true, opacity: 0.95 });
      const resources = [];
      function line(points, material = pale) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
        resources.push(geometry); const obj = new THREE.Line(geometry, material); group.add(obj); return obj;
      }
      const floors = 18, sides = 8, height = 5.2, rings = [];
      for (let level = 0; level <= floors; level++) {
        const y = level / floors * height - 2.5, twist = level * 0.048, radius = 1.68 + Math.sin(level / floors * Math.PI) * 0.42;
        const ring = Array.from({ length: sides }, (_, j) => { const a = j / sides * Math.PI * 2 + twist; return [Math.cos(a) * radius, y, Math.sin(a) * radius]; });
        rings.push(ring); line([...ring, ring[0]], level % 3 === 0 ? pale : dim);
      }
      for (let level = 0; level < floors; level++) for (let j = 0; j < sides; j++) {
        line([rings[level][j], rings[level + 1][j]], pale); line([rings[level][j], rings[level + 1][(j + 1) % sides]], level % 3 === 0 ? orange : dim);
      }
      for (let i = -5; i <= 5; i++) { line([[-5, -2.55, i], [5, -2.55, i]], dim); line([[i, -2.55, -5], [i, -2.55, 5]], dim); }
      const orbGeometry = new THREE.IcosahedronGeometry(0.64, 2);
      const orbMaterial = new THREE.MeshStandardMaterial({ color: 0xee8b53, roughness: 0.32, metalness: 0.28 });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial); orb.position.set(2.9, 1.4, 0.6); group.add(orb);
      const edgesGeometry = new THREE.EdgesGeometry(orbGeometry);
      const edges = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({ color: 0xffd3a5, transparent: true, opacity: 0.16 })); orb.add(edges);
      scene.add(new THREE.AmbientLight(0xffffff, 2.2)); const light = new THREE.DirectionalLight(0xffe5c9, 4); light.position.set(4, 7, 5); scene.add(light);
      let dragging = false, previousX = 0, target = -0.3, frame, visible = true, touching = false;
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      function down(e) { dragging = true; touching = true; previousX = e.clientX; host.setPointerCapture?.(e.pointerId); }
      function move(e) { if (dragging) { target += (e.clientX - previousX) * 0.008; previousX = e.clientX; } }
      function up() { dragging = false; }
      const resize = new ResizeObserver(() => { const { width, height } = host.getBoundingClientRect(); renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); }); resize.observe(host);
      host.addEventListener('pointerdown', down); host.addEventListener('pointermove', move); host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up);
      const observe = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); observe.observe(host);
      let last = 0;
      function animate(time) {
        frame = requestAnimationFrame(animate); if (!visible || document.hidden || time - last < 32) return; last = time;
        if (!motion.matches && !touching) target += 0.002;
        group.rotation.y += (target - group.rotation.y) * (motion.matches ? 1 : 0.065);
        if (!motion.matches) { orb.position.y = 1.4 + Math.sin(time * 0.0008) * 0.18; orb.rotation.y = time * 0.0002; }
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(animate); resetRef.current = () => { target = -0.3; touching = false; }; setReady(true);
      cleanup = () => {
        cancelAnimationFrame(frame); resize.disconnect(); observe.disconnect(); host.removeEventListener('pointerdown', down); host.removeEventListener('pointermove', move); host.removeEventListener('pointerup', up); host.removeEventListener('pointercancel', up);
        resources.forEach(r => r.dispose()); [orbGeometry, orbMaterial, edgesGeometry, edges.material, pale, dim, orange].forEach(r => r.dispose()); renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => {});
    return () => { disposed = true; cleanup(); };
  }, []);
  return <div className="structure-panel"><div className="scene-top"><span><i /> LIVE STRUCTURE / 001</span><MoveUpRight size={17} /></div><div className="scene-mount" ref={mount} aria-label="Interactive 3D twisting pavilion. Drag horizontally to rotate. The structure is decorative.">{!ready && <div className="scene-fallback" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} style={{ '--level': i }} />)}</div>}</div><span className="scene-coordinate coord-one">Y<br />↑</span><span className="scene-coordinate coord-two">X →</span><div className="scene-bottom"><span>{ready ? 'DRAG TO EXPLORE' : 'PARAMETRIC PAVILION'}<small>CODE × STRUCTURE</small></span><button className="scene-reset" aria-label="Reset 3D structure rotation" onClick={() => resetRef.current()}><RotateCcw size={16} /></button></div></div>;
}
