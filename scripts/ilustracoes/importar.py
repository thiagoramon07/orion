#!/usr/bin/env python3
"""
Importa ilustrações premium (geradas fora do app, ex.: ChatGPT) para um livro.

    python3 scripts/ilustracoes/importar.py <livro> <imagem-p1> <imagem-p2> ...
    python3 scripts/ilustracoes/importar.py <livro> --pagina 3 <imagem>

- Recorta para 3:2 (centro), reduz para 1536×1024 e salva em WebP (qualidade 82):
  public/ilustracoes/<livro>/<página>.webp  (≈150–250 KB cada, em vez de ~2,5 MB em PNG)
- Atualiza src/data/illustrations.json com ?v=<hash> (o aparelho baixa a versão nova).
- Páginas sem imagem premium continuam com a ilustração anterior (SVG), se existir.
"""
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public' / 'ilustracoes'
MANIFEST = ROOT / 'src' / 'data' / 'illustrations.json'
W, H = 1536, 1024


def convert(src: Path, dest: Path) -> str:
    im = Image.open(src).convert('RGB')
    # recorte central para 3:2
    w, h = im.size
    target = W / H
    if w / h > target:
        nw = int(h * target)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    elif w / h < target:
        nh = int(w / target)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize((W, H), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, 'WEBP', quality=82, method=6)
    return hashlib.sha1(dest.read_bytes()).hexdigest()[:8]


def main() -> None:
    args = sys.argv[1:]
    if len(args) < 2:
        sys.exit(__doc__)
    book = args.pop(0)
    start = 1
    if args[0] == '--pagina':
        start = int(args[1])
        args = args[2:]
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    pages = manifest.get(book, [])
    for i, src in enumerate(args):
        n = start + i
        dest = OUT / book / f'{n}.webp'
        v = convert(Path(src), dest)
        while len(pages) < n:
            pages.append(None)
        pages[n - 1] = f'{book}/{n}.webp?v={v}'
        print(f'{book} p.{n}: {dest.relative_to(ROOT)} ({dest.stat().st_size // 1024} KB)')
    manifest[book] = pages
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
