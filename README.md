# Highlands Production — Livemix Pro Simulator

A standalone public training website with exactly two pages:

- `index.html`: a branded four-digit PIN lock screen.
- `simulator/index.html`: the Livemix Pro Solo training simulator.

Entering the correct PIN opens the simulator directly. Its **Lock** link returns to the lock screen. Both pages use the supplied Highlands logo and the simulator’s blue training palette. There is no intermediate landing page.

This is an independent browser training simulation with no audio processing or connection to physical equipment.

## Local preview and build

Use Node.js 22 or later. No third-party build or runtime packages are required.

```sh
npm test
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/`, or `http://127.0.0.1:4173/livemix-training-simulator/` to check repository-subpath hosting. Rebuild after edits and refresh. Stop preview with Ctrl+C.

The build creates a fresh `dist/` with the two pages, public assets, and `.nojekyll`. Documentation, tests, scripts, and repository configuration are excluded. Hidden files are omitted, symbolic links are rejected, and unexpected asset types fail the build. Review asset content and metadata before publication; the allowlist is not a secret scanner.

## Training PIN

The PIN is `4700`, configured as a four-digit string in `assets/site-config.js`. Keep quotes to support leading zeros. No PIN or unlock state is saved to browser storage. Returning to the lock screen requires entering the PIN again.

**The PIN is a convenience gate, not secure access control.** The public source, PIN, and simulator URL remain readable and can be accessed directly. Use hosting with server-side authentication if confidential content or genuine visitor restrictions are required.

## Simulator delivery and updates

The self-contained simulator is at `simulator/index.html`. Styles, code, training configuration, logo, and product photo are embedded. There are no companion files or remote runtime dependencies.

To update:

1. Manually replace `simulator/index.html` with the next approved public HTML delivery. Copy only required public companion assets if a future delivery needs them, keeping relative references.
2. Preserve or re-add the **Lock** link in the simulator header: `<a class="quiet" href="../index.html">Lock</a>`. The simulator also includes a small responsive header adjustment so navigation fits narrow phones.
3. Run tests, build, and preview. Check PIN entry, simulator launch, the return link, keyboard/touch controls, and saving/reloading mixes at both preview URLs. Launch is automatic after a valid PIN; no enable flag is needed. The build requires the simulator entry file.
4. Check compatibility with existing saved mixes. Preserve storage keys unless an approved migration is included. Remove obsolete assets deliberately.

Practice mixes are stored in the current browser and website origin. Clearing site data, private browsing, another browser profile, or another domain can remove or separate saved mixes. The lock screen does not secure or clear them.

## Branding

`assets/branding/highlands-logo.svg` is extracted from the supplied simulator’s embedded logo and is used by the lock screen and its favicon. The simulator retains its embedded copy and product photo. No third-party imagery or fonts are downloaded.

For future artwork changes, copy approved public assets into `assets/branding/`, update the relevant references, and check image metadata, alt text, intrinsic dimensions, and responsive sizing. Keep both pages’ branding consistent.

## GitHub Pages deployment

The manual workflow is `.github/workflows/pages.yml`. Select **GitHub Actions** in **Settings → Pages**. After committing and pushing approved files yourself, choose **Actions → Deploy website to GitHub Pages → Run workflow**. There is no automatic push trigger.

The workflow tests and builds, uploads only `dist/`, and deploys through the `github-pages` environment. Only the deploy job has Pages write permissions. Configure deployment protection rules on that environment as needed. See [GitHub’s custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Relative URLs support domain-root and repository-subpath hosting. No analytics, external fonts, backend, or remote runtime services are configured. Builds need only Node.js and this project’s files; CI uses the public GitHub Actions declared in the workflow.

## Public delivery boundary

Future updates arrive through deliberate manual file transfers. Do not add repository history, research notes, internal documentation, firmware, dumps, manuals, secrets, private links, or machine-specific paths. Review staged changes before committing. All committed content and history are public; ignore rules cannot remove a committed secret. Revoke or rotate accidentally published credentials immediately.

## Files

```text
index.html                         PIN lock screen
simulator/index.html               Simulator and embedded artwork
simulator/README.md                Delivery maintenance notes
assets/branding/highlands-logo.svg  Supplied logo for the lock screen
assets/site.css                    Lock screen styles
assets/site.js                     PIN validation and direct navigation
assets/site-config.js              Public training PIN
scripts/build.mjs                  Website-only build
scripts/preview.mjs                Local preview with subpath support
tests/build.test.mjs               Build, boundary, and delivery checks
.github/workflows/pages.yml        Manual GitHub Pages deployment
```
