# Neural Aurora Field — Full Working Example

This package contains two working paths:

1. `CodeArt/neural_aurora_field_codeart.js` — paste directly into Cødeart / CodeArt / any p5.js editor.
2. `iOS/NeuralAuroraField/` — SwiftUI + WKWebView example with voice commands, optional Core ML classification, and a replaceable `LumerieClient` adapter.

## Important correction

I could not verify a public official Lumerie SDK or developer portal. This example does not use fake C++ headers like `#include <SDK/NeuralAurora.h>`. Instead, it uses a clean adapter pattern:

- `LumerieClient` protocol
- `MockLumerieClient` for local testing
- `HTTPLumerieClient` for a real device/API endpoint if one exists

## Cødeart / p5.js usage

Paste `CodeArt/neural_aurora_field_codeart.js` into the editor.

Controls:

- Move finger/mouse: bend the field
- `1`, `2`, `3`: particle density
- `H`: HUD
- `S`: save image
- `R`: reset background

## iOS usage

1. Open Xcode.
2. Create a new iOS App project.
3. Choose SwiftUI and Swift.
4. Drag the files from `iOS/NeuralAuroraField/` into your app target.
5. Drag the `Web` folder into the app target and make sure `aurora.html` is included in Copy Bundle Resources.
6. Add the permissions from `Info.plist.snippet`.
7. Build and run on a physical device for speech recognition.

The iOS example works without a Core ML model. It uses keyword fallback commands. To enable Core ML, add a compiled `AuroraIntent.mlmodelc` with:

- text input key: `text`
- output label key: `label`

Supported commands: `faster`, `calm`, `slower`, `more particles`, `less particles`, `blue`, `green`, `pink`, `pause`, `resume`, `reset`.

## Architecture

```txt
Speech / Buttons
      ↓
AuroraIntentClassifier
      ↓
AuroraBridge
      ↓
WKWebView JavaScript function: window.applyAuroraCommand(...)
      ↓
Canvas particle engine
      ↓
WKScriptMessageHandler metrics/events back to Swift
      ↓
Optional LumerieClient adapter
```

## Production notes

- Do not store API keys in JavaScript.
- Use Keychain for small secrets.
- Prefer local/on-device inference where possible.
- If you use an HTTP device endpoint, keep it local only during development.
- Use HTTPS + auth tokens for production.
- Reduce particles dynamically if FPS drops below target.
