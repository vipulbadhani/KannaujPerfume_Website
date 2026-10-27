# Kannauj Perfume — Website Concepts

Three complete, clickable design directions for the Kannauj Perfume website. Open `index.html` to choose a design.

| Design | Folder | Look |
|---|---|---|
| 01 Noir Royal | `noir/` | Black & gold, cinematic, intro loader, custom cursor |
| 02 Ivory Atelier | `ivory/` | Light editorial, Bodoni type, horizontal product rail |
| 03 Mughal Velvet | `velvet/` | Jewel tones, jaali & mihrab, page recolours per fragrance, Scent Finder quiz |

Each design has: Home, Shop (filters + sort), Product (`product.html?id=…`), Heritage and Contact. All pages share a mega menu, a mobile menu, search, and a working shopping bag (demo — no payments).

## Structure

```
index.html            design chooser (start here)
assets/
  bottle.js           SVG bottle illustrations (placeholders for product photos)
  catalog.js          products, prices, notes — edit here
  site.js             header, menus, search, cart, footer, shop & product pages
  components.css      shared layout, styled per design via CSS tokens
<design>/index.html   hand-built home page
<design>/theme.css    design tokens and overrides
_templates/           source for shop / product / heritage / contact pages
tools/build.py        regenerates the inner pages for every design
```

After editing anything in `_templates/`, run `python tools/build.py`.

Phone numbers, boutique details and prices are sample content.
