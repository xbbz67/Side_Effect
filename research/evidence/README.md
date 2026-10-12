# Local research evidence

Downloaded 12 October 2026 from public publisher/video pages. These are research references, **not authorized game assets for distribution**. See [source register](../sources.md) for exact origin URLs and confidence.

The public Git repository includes this inventory and the extraction helpers. Downloaded images, HTML, captions and video metadata are excluded by `.gitignore`, so they are present only in the original local workspace. The research validator checks the inventory without requiring those downloads.

- `step-01.png` through `step-12.png`: complete official illustrated booklet sequence; all images visually inspected. Booklet contextual page says ©2021; website's numbered step labels are image sequence, not assumed printed page numbering.
- `product-01.jpg` through `product-07.jpg`: seven publisher product photographs, all visually inspected. `product-02.jpg` shows current 89-card box with ©2024; `product-04.jpg` shows a real table in progress; `product-05.jpg` and `product-06.jpg` show readable card portions.
- `publisher-page.html`: downloaded page identifying rule and photo URLs.
- `video-official.html`, `video-skytiger.html` and matching `*-player.json`: fetched public metadata, used only to locate caption/storyboard references. Some media URLs are temporary signed public links, not workspace/user credentials.
- `video-official-storyboard-0.jpg` through `-3.jpg`: 99 actual video preview samples, 5×5 cells, 160×90 each, ~10-second interval; all inspected chronologically.
- `video-skytiger-storyboard-0.jpg` through `-16.jpg`: 147 actual preview samples, 3×3 cells, 320×180 each, ~10-second interval; all inspected chronologically.
- `*-storyboard-index.json`: sample geometry and approximate timestamp interval. Sample n is approximately n×10 seconds; table observations do not certify exact inter-frame timing.
- `*-captions.json`: zero-byte responses. They are failed evidence retrieval, not transcripts. Do not parse or quote them as speech.
- `video-player.json`: earlier official-video metadata extraction retained for traceability; `video-official-player.json` is the consistently named extraction.
- `inspect-video.cjs` and `fetch-video-evidence.ps1`: evidence extraction/download helpers only, not game code. Re-running the download helper needs network authorization and may use expired media URLs.

Continuous video review/audio remains outstanding. Read [video-observations.md](../gameplay/video-observations.md) before interpreting samples. Later revisions should preserve observations separately from rule claims and identify the relevant printing.
