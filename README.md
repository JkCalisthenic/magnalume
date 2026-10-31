# Magnalume

Landing page for Magnalume, sports chalk that glows under UV light. Plain static site in `docs/`, served by GitHub Pages.

- `docs/`: the site. No build step.
- `docs/js/specimen.js`: WebGL rock and bar, relit by the lamp each frame.
- `docs/js/marks.js`: the chalk marks, drawn in code.
- `tools/make_assets.py`: derives the UV product image, social image and fingerprint from `tools/source/`.

Run it locally with `python3 -m http.server -d docs`.
