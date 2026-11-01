# MiseOS Registry Atrium

Interactive single-page Three.js exhibition for the 23-card Mise Orchestra Season 1 roster.

## Run locally

From this directory:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`. A local server is recommended so browser security rules and relative assets behave consistently.

## Controls

- Drag to orbit
- Scroll or pinch to zoom
- Click a card to inspect its registry record
- Use department filters on desktop
- Press `R` to open or close the roster
- Press `Escape` to close the active panel

## Data provenance

Agent names, roles, departments, rarity, lore, traits, and operational stats are derived from the supplied `mise_orchestra_trading_cards_pack.zip` collection manifest and ERC-721 metadata.
