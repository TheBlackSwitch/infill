Omg this editor is killing me

### New features
- Added a new destroy() method which should be called before removing the editor. This will clear any event listeners

### Changes
- The on_input() method now accepts an (event: InputEvent) => void as a callback instead of a normal Function
- Some tweaks to mobile selections to make them slightly more user friendly

### Bugs fixed
- Clicking on the button tooltip also counted as clicking on the corresponding button
- Fixed a z-index issue with the button tooltips
- The editor didn't re-parse it's contents when it got loaded from cache
- When moving the cursor it sometimes randomly blinks at the old location
- The editor sometimes scrolled weirdly when placing the cursor
- Selecting backwards across newlines shifted the selection anchor by one character
- Selecting backwards across newlines moved the cursor to the end of the file when stopping the selection
- List items didn't do their text wrap thingy
- Couldn't propperly scroll inside code blocks
- Moving the cursor sometimes caused some weird flicker
- Double clicking on the same line sometimes put the cursor at the end of the file
- The cursor blinked at the end of the file, each time a button was pressed