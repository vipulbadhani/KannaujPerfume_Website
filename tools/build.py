"""Generate the inner pages (shop, product, heritage, contact) for every design
from _templates/. Home pages (<theme>/index.html) are hand-written and not touched.

Run from the repo root:  python tools/build.py
"""
import io
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = 'https://fonts.googleapis.com/css2?family='
THEMES = {
    'noir': {
        'fonts': FONT + 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Manrope:wght@300;400;500&display=swap',
        'js': '',
    },
    'ivory': {
        'fonts': FONT + 'Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Jost:wght@300;400;500&display=swap',
        'js': "<script>window.THEME_BOTTLE={label:'#f6eee6',ink:'#5a3a2c'}</script>\n",
    },
    'velvet': {
        'fonts': FONT + 'Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400&display=swap',
        'js': '',
    },
    'prism': {
        'fonts': FONT + 'Italiana&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Manrope:wght@300;400;500&display=swap',
        'js': '',
        # the product page gets the draggable WebGL bottle
        'after': {'product': '''
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="../assets/bottle3d.js"></script>
<script src="viewer.js"></script>'''},
    },
}
PAGES = ['shop', 'product', 'heritage', 'contact']

HEAD = '''<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="{fonts}" rel="stylesheet">
<link rel="stylesheet" href="../assets/components.css">
<link rel="stylesheet" href="theme.css">'''
SCRIPTS = '''{js}<script src="../assets/bottle.js"></script>
<script src="../assets/catalog.js"></script>
<script src="../assets/site.js"></script>'''

for theme, cfg in THEMES.items():
    for page in PAGES:
        with io.open(os.path.join(ROOT, '_templates', page + '.html'), encoding='utf-8') as f:
            html = f.read()
        html = (html.replace('{{HEAD}}', HEAD.format(fonts=cfg['fonts']))
                    .replace('{{SCRIPTS}}', SCRIPTS.format(js=cfg['js']) + cfg.get('after', {}).get(page, ''))
                    .replace('{{THEME}}', theme))
        out = os.path.join(ROOT, theme, page + '.html')
        with io.open(out, 'w', encoding='utf-8', newline='\n') as f:
            f.write(html)
        print('wrote', os.path.relpath(out, ROOT))
