import * as Infill from "./infill/main.js"

// Yup you're seing this correctly, you need THIS LITTLE code
// Awesome right?

let editor_parent = document.getElementById('editor-wrapper');
let editor = new Infill.Editor(editor_parent, {
    "nav": {
        "header": true
    }
}, "100%", "70vh");