# SP Lab — Research Website

Website for the **SP Lab** (Corneal Physiology & Ocular Drug Delivery),
led by **Prof. Sangly P. Srinivas**, Indiana University Bloomington, School of Optometry.

A single-page, dependency-free static site built for **GitHub Pages**.

```
index.html            → the site (all content)
assets/css/style.css  → design system & layout
assets/js/main.js     → nav, scroll reveals, hero endothelial-mosaic visual
.nojekyll             → tells GitHub Pages to serve files as-is
robots.txt            → search-engine directives
```

No build step, no frameworks — just open `index.html`.

---

## Deploy on GitHub Pages (from the `gh-pages` branch)

The site lives on the **`gh-pages`** branch. To publish it:

1. Go to your repository on GitHub: **`sanglylab/sanglylab`**
2. Open **Settings → Pages** (left sidebar).
3. Under **Build and deployment → Source**, choose **“Deploy from a branch.”**
4. Under **Branch**, select **`gh-pages`** and folder **`/ (root)`**, then click **Save**.
5. Wait ~1–2 minutes for the first build. GitHub will show a green banner with the live URL:

   **https://sanglylab.github.io/sanglylab/**

That’s it — every future push to `gh-pages` re-publishes automatically.

> **Tip — a shorter URL:** to serve the site at the root
> `https://sanglylab.github.io/`, create a repository named exactly
> **`sanglylab.github.io`** and push these files to its default branch.
> To use your own domain (e.g. `srinivaslab.org`), add a `CNAME` file
> containing the domain and configure it under **Settings → Pages → Custom domain**.

---

## Editing the content

Everything is plain HTML — edit `index.html` directly:

- **Publications** — add a `<li class="pub reveal">…</li>` block inside `<ol class="pub-list">`.
- **Collaborators** — add a `<div class="collab reveal">…</div>` inside `.collab-grid`.
- **Research programs** — edit the six `<article class="card reveal">` blocks.
- **PI photo** — to replace the “SPS” monogram with a real headshot, drop an image at
  `assets/img/pi.jpg` and swap the `.pi-portrait` block for an `<img>`.
- **Colors / fonts** — all design tokens are the `:root` variables at the top of `style.css`.

## Preview locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

*Publication metadata compiled from PubMed and Google Scholar. Content is for research and educational purposes.*
