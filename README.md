Integer Recurrence Explorer (PWA)

Live app: https://ncg777.github.io/integer-recurrence-explorer/

Explore classic and algorithmic integer sequences interactively. Pick a recurrence, set initial conditions and parameters, choose output length and range handling, then copy or download the generated terms.

This project is a lightweight Angular single-page app configured for GitHub Pages hosting and installable as a basic PWA.


## Features

- Built‑in catalog of sequences
	- Classic: Fibonacci, Lucas, Tribonacci, Pell, Padovan, Perrin, Collatz
	- 32‑bit generators with parameters:
		- Xorshift (shifts A,B,C)
		- LCG32 (a, c)
		- Weyl32 (omega)
		- LFSR32 (polynomial)
		- SplitMix32
		- ROL‑Mix (rotate amount)
- Initial conditions editor; quick “Fill default initial” helper
- Output length control
- Range handling (Max value):
	- mod: wrap modulo N
	- bounce: reflect in [0, N-1] (sawtooth bounce)
- One‑click Copy to Clipboard or Download .txt
- Installable via web app manifest (basic PWA)


## Try it online

Open the app here: https://ncg777.github.io/integer-recurrence-explorer/


## How it works

- Recurrence model
	- `Recurrence { name, order, next(values: number[], index?: number): number }`
	- `LambdaRecurrence` provides a simple wrapper around a rule function
	- `order` controls how many prior terms feed the next value (order 0 means index‑driven)
- Generation pipeline
	- Service (`RecurrenceService`) takes a recurrence, initial conditions, length, and range mode
	- Initials are normalized to exactly `order` terms: too short → left‑pad with zeros; too long → first N
	- Each step calls `recurrence.next(window, index)` and then applies range handling (`mod` or `bounce`)
	- Results stream via an RxJS `BehaviorSubject` for UI components
- UI components
	- `RecurrenceInputComponent`: choose recurrence, tweak parameters, enter initials, length, and range
	- `SequenceViewerComponent`: shows the sequence, copy/download actions


## Usage notes

- Initial conditions
	- For order‑2 sequences (e.g., Fibonacci), provide two initials like `0 1`
	- For order‑3 sequences (e.g., Tribonacci/Padovan/Perrin), provide three initials
	- Index‑driven sequences (order 0) ignore initials; their `next` depends only on index
- Parameters (when applicable)
	- Xorshift: shift counts A, B, C
	- LCG32: multiplier `a`, addend `c` (32‑bit arithmetic)
	- Weyl32: step `omega` (decimal or hex like `0x9E3779B9`)
	- LFSR32: feedback polynomial (hex)
	- ROL‑Mix: left rotation amount
- Range handling
	- mod: `value mod N` in [0, N-1]
	- bounce: reflects values into [0, N-1] using a period of `2*(N-1)`


## Development

Prerequisites
- Node.js 18+ and npm

Install dependencies

```
npm install
```

Run unit tests (Jest)

```
npm test
```

Serve locally (Angular CLI)

```
npx ng serve --open
```

Build for production (outputs to `docs/` for GitHub Pages)

```
npx ng build --configuration production
```

Notes
- Production build sets `baseHref` and `deployUrl` to `/integer-recurrence-explorer/` (see `angular.json`).
- The PWA manifest is at `src/assets/manifest.webmanifest` and is linked from `src/index.html`.


## Deploying to GitHub Pages

This repo is configured to publish the static site from the `docs/` folder on the default branch.

Typical flow:
1. Build the site: `npx ng build --configuration production`
2. Commit the updated `docs/` artifacts
3. Push to the repository’s default branch
4. Ensure repository Settings → Pages → Source is set to “Deploy from a branch” with folder `/docs`

The live URL is: https://ncg777.github.io/integer-recurrence-explorer/


## PWA details

- Manifest (`src/assets/manifest.webmanifest`)
	- name: “Integer Recurrence Explorer”
	- start_url: `/integer-recurrence-explorer`
	- display: `standalone`
	- theme/background colors
	- icon: `assets/favicon.png` (1024×1024)
- Service worker
	- This app does not currently register a service worker; offline behavior depends on normal browser caching
	- It is still installable thanks to the manifest


## Project structure (high level)

- `src/app/models/recurrence.ts` — Recurrence interfaces and `LambdaRecurrence`
- `src/app/services/recurrence-factory.ts` — Built‑in recurrence catalog and helpers
- `src/app/services/recurrence.service.ts` — Sequence generation and range handling
- `src/app/components/*` — UI components for input and display
- `src/assets/manifest.webmanifest` — PWA manifest
- `angular.json` — Build/serve configuration (production builds to `docs/` with GitHub Pages paths)


## Known limitations

- Integer range and overflow
	- Several generators use 32‑bit operations; results may wrap and become negative due to signed 32‑bit math in JavaScript
- Very long sequences can be memory‑intensive in the browser
- Collatz expects positive integers; non‑positive/invalid inputs are guarded in code to avoid degenerate behavior
- No service worker; offline use is limited


## License

See the `LICENSE` file in this repository for license details.
