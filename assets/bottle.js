/* Reusable SVG perfume bottle — placeholder until real product photography arrives.
   Usage: <div data-bottle='{"liquid":"#7a4a1f","name":"OUD ROYAL"}'></div> */
(function () {
  let n = 0;
  const caps = {
    gold:   ['#f7e7b4', '#d4b061', '#8c6a22', '#efd893'],
    silver: ['#ffffff', '#c9c9c9', '#7d7d7d', '#e6e6e6'],
    black:  ['#5a5a5a', '#1c1c1c', '#000000', '#333333'],
    rose:   ['#f8dccf', '#d39b86', '#8a5546', '#ecc1af']
  };

  window.bottleSVG = function (opts) {
    const id = 'bt' + (n++);
    const c = Object.assign({
      liquid: '#8a5a24', liquid2: '#3a2108', cap: 'gold', label: '#0c0b0a',
      ink: '#d9b56c', name: 'KANNAUJ', sub: 'EAU DE PARFUM', shape: 'classic', fill: 0.78
    }, opts);
    const g = caps[c.cap] || caps.gold;
    const facet = c.shape === 'facet';
    const body = facet
      ? 'M48 96 H152 L178 122 V300 L152 326 H48 L22 300 V122 Z'
      : 'M40 96 H160 Q178 96 178 114 V308 Q178 326 160 326 H40 Q22 326 22 308 V114 Q22 96 40 96 Z';
    const top = 326 - 222 * c.fill;
    const liquid = facet
      ? `M30 ${top} H170 V297 L149 318 H51 L30 297 Z`
      : `M30 ${top} H170 V306 Q170 318 158 318 H42 Q30 318 30 306 Z`;
    const ridges = Array.from({ length: 9 }, (_, i) =>
      `<rect x="${75 + i * 6.2}" y="14" width="1.4" height="62" fill="#000" opacity=".14"/>`).join('');

    return `<svg viewBox="0 0 200 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${c.name} bottle">
<defs>
  <linearGradient id="${id}c" x1="0" x2="1"><stop offset="0" stop-color="${g[2]}"/><stop offset=".25" stop-color="${g[0]}"/><stop offset=".55" stop-color="${g[1]}"/><stop offset=".8" stop-color="${g[3]}"/><stop offset="1" stop-color="${g[2]}"/></linearGradient>
  <linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.liquid}" stop-opacity=".95"/><stop offset="1" stop-color="${c.liquid2}"/></linearGradient>
  <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".18" stop-color="#fff" stop-opacity=".05"/><stop offset=".82" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity=".18"/></linearGradient>
  <radialGradient id="${id}s" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <clipPath id="${id}k"><path d="${body}"/></clipPath>
</defs>
<ellipse cx="100" cy="342" rx="92" ry="12" fill="url(#${id}s)"/>
<rect x="70" y="10" width="60" height="70" rx="5" fill="url(#${id}c)"/>${ridges}
<rect x="70" y="10" width="60" height="5" rx="2" fill="#fff" opacity=".35"/>
<rect x="82" y="80" width="36" height="17" fill="url(#${id}c)"/>
<rect x="82" y="80" width="36" height="2" fill="#000" opacity=".25"/>
<path d="${body}" fill="${c.liquid2}" fill-opacity=".18"/>
<g clip-path="url(#${id}k)">
  <path d="${liquid}" fill="url(#${id}l)"/>
  <rect x="30" y="${top}" width="140" height="3" fill="#fff" opacity=".18"/>
  <rect x="34" y="100" width="14" height="222" fill="#fff" opacity=".22"/>
  <rect x="54" y="100" width="4" height="222" fill="#fff" opacity=".1"/>
  <rect x="160" y="100" width="6" height="222" fill="#fff" opacity=".12"/>
</g>
<path d="${body}" fill="url(#${id}g)" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>
<rect x="56" y="186" width="88" height="74" fill="${c.label}" stroke="${c.ink}" stroke-width=".8"/>
<rect x="60" y="190" width="80" height="66" fill="none" stroke="${c.ink}" stroke-width=".4" opacity=".7"/>
<text x="100" y="208" text-anchor="middle" font-family="Georgia,serif" font-size="5.4" letter-spacing="1.3" fill="${c.ink}">KANNAUJ PERFUME</text>
<line x1="84" y1="214" x2="116" y2="214" stroke="${c.ink}" stroke-width=".5"/>
<text x="100" y="232" text-anchor="middle" font-family="Georgia,serif" font-size="${c.name.length > 10 ? 7 : c.name.length > 7 ? 8.4 : 10.5}" letter-spacing="1.6" fill="${c.ink}">${c.name}</text>
<text x="100" y="246" text-anchor="middle" font-family="Georgia,serif" font-size="4.6" letter-spacing="2" fill="${c.ink}" opacity=".8">${c.sub}</text>
</svg>`;
  };

  document.querySelectorAll('[data-bottle]').forEach(el => {
    el.innerHTML = window.bottleSVG(JSON.parse(el.dataset.bottle || '{}'));
  });
})();
