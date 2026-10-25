Yay some simple features

### New features
- Added a new destroy() method which should be called before removing the editor. This will clear any event listeners

### Changes
- The on_input() method now accepts an (event: InputEvent) => void as a callback instead of a normal Function

### Bugs fixed
- The editor didn't re-parse it's contents when it got loaded from cache
- When moving the cursor it sometimes randomly blinks at the old location
- The editor sometimes scrolled weirdly when placing the cursor