# Highlands Production — Livemix Pro Simulator

A standalone, static training website for practicing Livemix Pro Solo operation. The landing page includes Loading a Mix, Saving a Mix, Working With Groups, and Adjust Reverb. The simulator has not been supplied, so the page shows **Simulator coming soon**.

This is an independent browser training simulation with no audio processing or connection to physical equipment.

## Preview and build

Use Node.js 22 or later. There are no third-party build or runtime packages to install.

```sh
npm test
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/`. Also test `http://127.0.0.1:4173/livemix-training-simulator/` to preview a GitHub Pages repository subpath. Stop preview with Ctrl+C. Rebuild after edits, then refresh the page.

The build creates a fresh `dist/` containing only `index.html`, public files from `assets/`, `.nojekyll`, and the enabled simulator. Documentation, tests, scripts, Git metadata, and workflow configuration are excluded. Hidden files are omitted, symbolic links are rejected, and unrecognized asset types fail the build. This allowlist is not a secret scanner: review everything in public asset folders, including SVG metadata and JavaScript.

## Training PIN

The initial four-digit PIN is `4700`. Change the `pin` string in `assets/site-config.js` and rebuild to update it. Preserve quotes so a PIN can start with zero.

**This is a convenience gate, not secure access control.** The PIN, page content, and deployed simulator files are public and can be read or bypassed. GitHub Pages does not authenticate visitors using this form. If access must truly be restricted to authorized people, use hosting with server-side access control before publishing sensitive content.

Unlocking lasts until the page reloads. “Lock page” hides the content again. No PIN or unlock state is saved to browser storage.

## Add the simulator

1. Manually copy the approved, self-contained HTML to `simulator/index.html`. Do not copy unrelated files or repository metadata.
2. If it needs companion files, copy only required public assets under `simulator/`, preserving relative references. Remove external network dependencies, private links, credentials, and machine-specific paths before integration. No files from another checkout are read by this project.
3. Set `simulatorEnabled: true` in `assets/site-config.js`. The launch action is a relative link to `./simulator/index.html`; no workflow deep links are assumed. The build fails if enabled without the HTML file.
4. Run the build and preview commands. Test launch from both preview URLs, all simulator assets, touch controls, keyboard controls, and saving/reloading practice mixes.

Practice mixes, once integrated, are stored in the current browser. Verify this behavior in the supplied simulator before enabling launch. Browser storage is specific to the browser profile and website origin; private browsing, clearing site data, or changing domains can remove or separate saved mixes. The PIN screen does not secure those mixes.

## Add approved artwork

Reserved destinations:

- `assets/branding/highlands-logo.svg` — approved Highlands logo.
- `assets/product/livemix-pro-solo.webp` — approved Solo product photo.

The page uses text branding and an original abstract CSS fader graphic, labeled as illustrative. It has no references to missing artwork. `assets/favicon.svg` is an original slider motif.

After copying artwork, explicitly add relative image references in `index.html` and style them in `assets/site.css`. Replace the illustrative graphic with the supplied photo if desired. Set accurate alt text, intrinsic width and height, and responsive sizing; decorative logo images beside equivalent brand text should use empty alt text. Review SVG source and image metadata before publication. Do not download substitute product or branding images.

## Deploy to GitHub Pages

The prepared workflow is `.github/workflows/pages.yml`. In the repository’s **Settings → Pages**, select **GitHub Actions** as the source. After committing and pushing approved files yourself, open **Actions → Deploy website to GitHub Pages → Run workflow**. Deployment is manual only; there is no push trigger. The deploy job uses the `github-pages` environment, where deployment protection rules can be configured.

The workflow runs tests, builds the site, and uploads only `dist/`. Build permissions are read-only; only the deploy job can write Pages deployments. The workflow follows [GitHub’s custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Website links are relative, so repository subpaths and domain-root hosting work. No custom domain, analytics, external fonts, backend, or remote runtime services are configured. GitHub Actions uses the public action versions specified in the workflow; application builds need only Node.js and files in this project.

## Future updates

Manually replace `simulator/index.html` and its required companion files with the next approved version. Remove obsolete simulator assets deliberately. Keep the same public entry point and `simulatorEnabled: true`. Build, preview, and check existing browser-saved mixes for compatibility; preserve existing storage keys unless an approved migration is included. The website does not merge, migrate, or clear simulator storage.

Copy only approved public delivery files. Do not add research notes, internal documentation, firmware, dumps, manuals, confidential information, or Git history. Review staged changes before committing. Every committed file and historical revision is public; ignore rules cannot remove an already committed secret. Revoke or rotate any accidentally published credential immediately.

## Project layout

```text
index.html                 Landing page and PIN screen
assets/site.css            Responsive styles
assets/site.js             PIN interaction and launch state
assets/site-config.js      Public PIN and simulator enable flag
assets/favicon.svg         Original favicon
assets/branding/           Approved Highlands artwork
assets/product/            Approved product artwork
simulator/                 Manually supplied simulator delivery
scripts/                   Dependency-free build and local preview
tests/                    Build, publication boundary, and link checks
.github/workflows/         Manual GitHub Pages deployment
```
