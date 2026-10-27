/* Real-time 3D perfume bottle (Three.js r128, global THREE).
   Bottle3D.create(canvas, opts) → controller with .setProduct(p), .pose (target), .drag.
   Built procedurally — swap in a .glb of the real bottle later without touching the pages. */
(function () {
  if (!window.THREE) return;
  const T = THREE;
  const CAPS = { gold: 0xd4b061, silver: 0xd9d9d9, black: 0x1b1b1b, rose: 0xd8a08b };

  function labelTexture(p) {
    const c = document.createElement('canvas'); c.width = 600; c.height = 500;
    const g = c.getContext('2d'), gold = '#d9b56c';
    g.fillStyle = '#0b0a09'; g.fillRect(0, 0, 600, 500);
    g.strokeStyle = gold; g.lineWidth = 4; g.strokeRect(14, 14, 572, 472);
    g.lineWidth = 1.5; g.strokeRect(30, 30, 540, 440);
    g.fillStyle = gold; g.textAlign = 'center';
    g.font = '500 30px Georgia, serif'; g.fillText('K A N N A U J   P E R F U M E', 300, 120);
    g.fillRect(240, 150, 120, 2);
    const name = p.bottle.name;
    g.font = `400 ${name.length > 10 ? 58 : 76}px Georgia, serif`; g.fillText(name, 300, 275);
    g.font = '400 26px Georgia, serif'; g.globalAlpha = .8;
    g.fillText((p.bottle.sub || 'EAU DE PARFUM').split('').join(' '), 300, 345);
    g.globalAlpha = .55; g.font = 'italic 24px Georgia, serif'; g.fillText('Distilled in Kannauj', 300, 415);
    const t = new T.CanvasTexture(c); t.anisotropy = 8; return t;
  }

  function shadowTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d'), r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    r.addColorStop(0, 'rgba(0,0,0,.6)'); r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.fillRect(0, 0, 256, 256);
    return new T.CanvasTexture(c);
  }

  // Studio lighting baked into an environment map — gives the glass and gold real reflections.
  function studioEnv(renderer, light) {
    const s = new T.Scene();
    s.add(new T.Mesh(new T.SphereGeometry(20, 32, 16), new T.MeshBasicMaterial({ color: light ? 0x1c1916 : 0x0a0a0f, side: T.BackSide })));
    const box = (w, h, x, y, z, color, ry) => {
      const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color, side: T.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); if (ry) m.rotation.z = ry; s.add(m);
    };
    box(14, 3, 0, 12, 0, 0xffffff);          // top softbox
    box(2, 14, -10, 2, 4, 0xfff3dc);         // warm left strip
    box(2, 14, 10, 2, 4, 0xdfe8ff);          // cool right strip
    box(8, 6, 0, 3, 12, 0x777777);           // soft front fill
    box(6, 6, -4, -2, -12, 0xc9953f);        // golden kicker from behind
    box(3, 14, -6, 0, 9, 0xffffff);          // tall front-left strip → crisp highlight on the facets
    if (light) box(3, 14, 6, 0, 9, 0x000000); // black flag → dark edge on the right of the glass
    const pm = new T.PMREMGenerator(renderer);
    const tex = pm.fromScene(s, 0.04).texture; pm.dispose(); return tex;
  }

  function create(canvas, opts = {}) {
    let renderer;
    try { renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return null; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;

    const scene = new T.Scene();
    scene.environment = studioEnv(renderer, opts.light);
    const cam = new T.PerspectiveCamera(30, 1, .1, 100); cam.position.set(0, .2, 9);

    const root = new T.Group(); scene.add(root);
    const bottle = new T.Group(); root.add(bottle);
    const oct = (r, h) => { const g = new T.CylinderGeometry(r, r, h, 8, 1); g.rotateY(Math.PI / 8); g.scale(1, 1, .6); return g; };

    const glass = new T.MeshPhysicalMaterial({ color: 0xf3f7f9, metalness: 0, roughness: .02, transmission: .92, transparent: true, clearcoat: 1, clearcoatRoughness: .02, reflectivity: .9, envMapIntensity: 2.4 });
    const bodyGeo = oct(1, 2.1);
    bottle.add(new T.Mesh(bodyGeo, glass));
    // crisp facet edges so the glass reads on any background
    bottle.add(new T.LineSegments(new T.EdgesGeometry(bodyGeo), new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: opts.light ? .9 : .45 })));
    const thick = new T.MeshPhysicalMaterial({ color: 0xcfdadf, roughness: .05, transmission: .55, transparent: true, clearcoat: 1, envMapIntensity: 2.2 });
    const base = new T.Mesh(oct(.98, .22), thick); base.position.y = -.93; bottle.add(base);

    // liquid shades from light at the top to deep at the bottom (vertex colours)
    const liquidMat = new T.MeshPhysicalMaterial({ vertexColors: true, roughness: .08, metalness: 0, clearcoat: .6, envMapIntensity: 1.5 });
    const liqGeo = oct(.9, 1.55);
    liqGeo.setAttribute('color', new T.BufferAttribute(new Float32Array(liqGeo.attributes.position.count * 3), 3));
    const liquid = new T.Mesh(liqGeo, liquidMat); liquid.position.y = -.16; bottle.add(liquid);
    const surf = new T.Mesh(new T.PlaneGeometry(1.6, .9), new T.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .12, roughness: .05 }));
    surf.rotation.x = -Math.PI / 2; surf.position.y = .62; bottle.add(surf);

    const metal = new T.MeshStandardMaterial({ color: CAPS.gold, metalness: 1, roughness: .22, envMapIntensity: 1.4 });
    const ridged = metal.clone();
    const neck = new T.Mesh(new T.CylinderGeometry(.28, .3, .26, 32), metal); neck.position.y = 1.18; bottle.add(neck);
    const collar = new T.Mesh(new T.CylinderGeometry(.4, .4, .06, 48), metal); collar.position.y = 1.08; bottle.add(collar);
    const cap = new T.Mesh(new T.CylinderGeometry(.5, .5, .92, 64), ridged); cap.position.y = 1.77; bottle.add(cap);
    const capTop = new T.Mesh(new T.CylinderGeometry(.47, .5, .04, 64), metal); capTop.position.y = 2.25; bottle.add(capTop);
    // two engraved bands on the cap
    const band = new T.MeshStandardMaterial({ color: 0x2a2116, metalness: .6, roughness: .5 });
    [1.45, 2.1].forEach(y => { const r = new T.Mesh(new T.CylinderGeometry(.505, .505, .025, 64), band); r.position.y = y; bottle.add(r); });

    const labelMat = new T.MeshStandardMaterial({ roughness: .5, metalness: .1, transparent: true });
    const label = new T.Mesh(new T.PlaneGeometry(.98, .82), labelMat); label.position.set(0, -.08, .56); bottle.add(label);

    // golden orbit ring around the bottle + soft studio halo behind it
    const orbit = new T.Mesh(new T.TorusGeometry(1.85, .009, 8, 160), new T.MeshStandardMaterial({ color: 0xc9a05a, metalness: 1, roughness: .2, envMapIntensity: 1.5 }));
    orbit.position.y = .55; orbit.rotation.x = 1.38; root.add(orbit);
    if (opts.light) {
      const hc = document.createElement('canvas'); hc.width = hc.height = 512;
      const hg = hc.getContext('2d'), rg = hg.createRadialGradient(256, 256, 0, 256, 256, 256);
      rg.addColorStop(0, 'rgba(120,92,70,.42)'); rg.addColorStop(.55, 'rgba(150,120,95,.18)'); rg.addColorStop(1, 'rgba(150,120,95,0)');
      hg.fillStyle = rg; hg.fillRect(0, 0, 512, 512);
      const halo = new T.Mesh(new T.PlaneGeometry(7, 7), new T.MeshBasicMaterial({ map: new T.CanvasTexture(hc), transparent: true, depthWrite: false }));
      halo.position.set(0, .6, -2); root.add(halo);
    }

    const shadow = new T.Mesh(new T.PlaneGeometry(4, 2.4), new T.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.08; root.add(shadow);

    // Golden dust
    const N = opts.dust === false ? 0 : 260, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 12; pos[i * 3 + 1] = (Math.random() - .5) * 8; pos[i * 3 + 2] = (Math.random() - .5) * 6 - 1; }
    const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(pos, 3));
    const dust = new T.Points(dg, new T.PointsMaterial({ color: opts.light ? 0xb48a4e : 0xe8cf94, size: .025, transparent: true, opacity: opts.light ? .45 : .7, depthWrite: false }));
    scene.add(dust);

    const ctl = {
      pose: { x: 0, y: 0, scale: 1, rot: 0, tilt: 0 },   // target, set by the page
      cur: { x: 0, y: 0, scale: 1, rot: 0, tilt: 0 },
      mouse: { x: 0, y: 0 }, drag: null, spin: opts.spin || 0,
      setProduct(p) {
        const L = new T.Color(p.bottle.liquid), D = new T.Color(p.bottle.liquid2), pos = liqGeo.attributes.position, col = liqGeo.attributes.color, c = new T.Color();
        for (let i = 0; i < pos.count; i++) { c.copy(D).lerp(L, pos.getY(i) > 0 ? .95 : .05); col.setXYZ(i, c.r, c.g, c.b); }
        col.needsUpdate = true;
        const capC = CAPS[p.bottle.cap || 'gold'];
        metal.color.setHex(capC); ridged.color.setHex(capC);
        metal.roughness = ridged.roughness = p.bottle.cap === 'black' ? .4 : .22;
        if (labelMat.map) labelMat.map.dispose();
        labelMat.map = labelTexture(p); labelMat.needsUpdate = true;
      },
      resize() {
        const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
        renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      }
    };

    if (opts.draggable) {
      canvas.style.touchAction = 'pan-y';
      canvas.addEventListener('pointerdown', e => { ctl.drag = { x: e.clientX, y: e.clientY, rot: ctl.pose.rot, tilt: ctl.pose.tilt }; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
      canvas.addEventListener('pointermove', e => {
        if (!ctl.drag) return;
        ctl.pose.rot = ctl.drag.rot + (e.clientX - ctl.drag.x) * .012;
        ctl.pose.tilt = Math.max(-.5, Math.min(.5, ctl.drag.tilt + (e.clientY - ctl.drag.y) * .004));
      });
      const up = () => { ctl.drag = null; canvas.style.cursor = 'grab'; };
      canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
      canvas.style.cursor = 'grab';
    }
    addEventListener('mousemove', e => { ctl.mouse.x = e.clientX / innerWidth - .5; ctl.mouse.y = e.clientY / innerHeight - .5; });
    addEventListener('resize', () => ctl.resize()); ctl.resize();

    const clock = new T.Clock();
    (function loop() {
      const t = clock.getElapsedTime(), k = .07, c = ctl.cur, p = ctl.pose;
      if (!ctl.drag && ctl.spin) p.rot += ctl.spin;
      for (const key in c) c[key] += (p[key] - c[key]) * k;
      root.position.set(c.x, c.y + Math.sin(t * 1.1) * .06, 0);
      root.scale.setScalar(c.scale);
      bottle.rotation.y = c.rot + ctl.mouse.x * .35;
      bottle.rotation.x = c.tilt + ctl.mouse.y * .12;
      bottle.rotation.z = Math.sin(t * .7) * .02;
      orbit.rotation.z = t * .25; orbit.rotation.x = 1.38 + Math.sin(t * .4) * .06;
      dust.rotation.y = t * .02; dust.position.y = Math.sin(t * .2) * .2;
      renderer.render(scene, cam);
      requestAnimationFrame(loop);
    })();
    return ctl;
  }

  window.Bottle3D = { create };
})();
