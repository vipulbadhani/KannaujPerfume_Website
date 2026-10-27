/* Prism product page: replace the static bottle with a draggable 360° WebGL bottle. */
(function () {
  const stage = document.querySelector('.pd-stage');
  if (!stage || !window.Bottle3D) return;
  const id = new URLSearchParams(location.search).get('id');
  const p = CATALOG.find(x => x.id === id) || CATALOG[0];
  const canvas = document.createElement('canvas');
  stage.appendChild(canvas);
  const b3 = Bottle3D.create(canvas, { draggable: true, spin: .004, light: true });
  if (!b3) { canvas.remove(); return; }
  stage.querySelector('.pd-b').style.display = 'none';
  stage.insertAdjacentHTML('beforeend', '<div class="drag-hint">Drag to rotate 360°</div>');
  b3.setProduct(p);
  Object.assign(b3.pose, { x: 0, y: -.42, scale: innerWidth <= 980 ? .55 : .7, rot: -.4, tilt: .05 });
  Object.assign(b3.cur, b3.pose, { scale: .5 });
  new ResizeObserver(() => b3.resize()).observe(stage);
})();
