# ROBOT RACING — Classroom Studio

A local-first classroom racing app. Students colour printable vehicle worksheets; the teacher scans the paper, removes the connected paper background, registers the original image and races it on a track.

## Run locally
Because this app uses JavaScript modules and camera APIs, serve it over HTTP (do not open `index.html` as a `file://` URL).

```bash
# Python
python -m http.server 8000
```
Open http://localhost:8000

Or use VS Code Live Server.

## Deploy to Vercel
1. Upload this folder to a Git repository.
2. In Vercel choose **Add New → Project** and import the repository.
3. Framework preset: **Other**. Build command: leave empty. Output directory: `.`.
4. Deploy. Camera access is allowed on the HTTPS Vercel domain.

`vercel.json` is included; no server functions or environment variables are required.

## Classroom workflow
1. Open **Templates**, choose a category and print a worksheet.
2. Students colour inside the vehicle outline and return the sheet.
3. Open **Scanner**, start a camera or upload a photo.
4. **Remove paper** uses edge-connected white-pixel flood fill. This removes white paper connected to the image edge but preserves enclosed white regions (e.g. windows and headlights). Use Erase/Restore brushes to correct the mask.
5. Fill student name, class, vehicle name and save.
6. Open **Races**, select 2–12 vehicles, choose track and laps, then start.

## Notes and limitations
- **Local-only storage:** images and records live in IndexedDB in this browser profile. They do not sync to another computer. Export JSON on the Settings page for backups and transfer.
- **Scanner:** QR recognition is attempted with jsQR. The included generated worksheets encode a template identifier in a QR image. If QR fails, enter/select a template manually. The first version provides a framing guide and manual crop/brush correction; full automatic four-marker perspective homography is not yet implemented. Capture a straight-on photo or upload a cropped photo for best results.
- **3D:** original drawings are kept as transparent PNG artwork. The race uses a 2D track renderer with the original image-derived colour represented by a simple vehicle token; the garage shows the original drawing. This is not a true 3D reconstruction. A 2.5D Three.js viewer can be added as a next phase.
- **External libraries:** QRCode.js and jsQR are loaded from public CDNs. OpenCV.js is included as an optional library hook but is not required for the core flow. Initial load needs internet access.
- **Privacy:** QR codes contain opaque vehicle/template/student IDs only, not names or class details.
- **Browser support:** current Chrome/Edge/Firefox/Safari. Camera requires HTTPS or localhost.

## Project structure
- `index.html` — app shell and all sections
- `styles.css` — responsive dashboard styling
- `js/app.js` — navigation, views, registration, garage, races, results, import/export
- `js/db.js` — IndexedDB persistence
- `js/i18n.js` — Kazakh/Russian/English interface labels
- `js/templates.js` — printable worksheet SVG generation
- `js/scanner.js` — camera, image import, QR read, paper extraction and correction
- `js/race.js` — track rendering and race simulation
- `vercel.json` — static deployment config
