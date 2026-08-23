// As you can see, I'm still learning how I can split my code across multiple files :/

// Possible inprovements:
// - Make the EditorSelection start and end position in markdown coords and update it everytime the html render changes
// - 


// ==========================================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------------------
//                                                              IMPORTS                                                                       
// ------------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================================================================================================

import './utils';
import type { absolute_map, options } from "./public_types";
import * as YAMP from "@theblackswitch/yamp";
import './prismjs_highlight/mcfunction';
import DOMPurify from 'dompurify'
import { cursor_pos_from_point, download_file } from './utils';
import { EditorSelection } from './selection';

// ==========================================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------------------
//                                                               MAIN PIPELINE                                                                       
// ------------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================================================================================================

export const default_options: options = {
    "nav": {
        "header": true,
        "bold": true,
        "italic": true,
        "strikethrough": true,
        "highlight": true,
        "underline": true,
        "code": true,
        "code_block": true,
        "list": true,
        "blockquote": true,
        "link": true,
        "image": true,
        "coloured": true,
        "toggle_markdown_parsing": true,
        "zoom": true        
    },
    "enabled_features": [
        YAMP.Header,
        YAMP.AlternateHeader,
        YAMP.BlockQuote,
        YAMP.Code,
        YAMP.CodeBlock,
        YAMP.Color,
        YAMP.Emphasis,
        YAMP.Strikethrough,
        YAMP.UnderscoreEmphasis,
        YAMP.Highlight,
        YAMP.Underlined,
        YAMP.HorizontalRule,
        YAMP.Image,
        YAMP.Link,
        YAMP.List,
        YAMP.Table,
        YAMP.EscapeIncompleteHtml
    ],
    "keyboard_shortcuts_enabled": true
}


export class Editor {
    #parent_element: HTMLElement;
    #options: options;

    #wrapper: HTMLElement;
    #nav: HTMLElement;
    #bott_nav: HTMLElement;
    #editor: HTMLElement;
    #input: HTMLTextAreaElement;
    #text_display: HTMLElement;
    #selection_mask: HTMLElement;
    #slider: HTMLInputElement;
    #toggle_check: HTMLInputElement;

    #is_parsing: boolean = false;

    #parse_worker: Worker;

    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                         CONSTRUCTOR + HTML GEN                                                                 
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================

    constructor(parent_element: HTMLElement, width: string = "100%", height: string = "60vh", options: options = {}) {
        if(!parent_element) throw Error('[Infill]: Failed to instantiate new editor. No parent element provided!');
        this.#parent_element = parent_element;

        this.#options = {};
        for(const [option, value] of Object.entries(default_options)) {
            if(options[option] !== undefined) {
                this.#options[option] = options[option];
            } else {
                this.#options[option] = default_options[option];
            }
        }

        YAMP.set_options({
            "enabled_features": this.#options.enabled_features,
            "add_zero_width_space_for_cursor_positions": true,
            "disable_paragraph_elements": false,
            "enable_trailing_linebreaks": true,
            "finalize_spaces": true,
            "literal_mid_word_underscores": true
        })

        // -------------------------------
        //  Create a worker for the parse                            
        // -------------------------------

        this.#parse_worker = new Worker(new URL("./workers/parse.ts", import.meta.url), { type: "module" });

        // -------------------------------
        //  Construct HTML                            
        // -------------------------------

        // ======= WRAPPER =======
        this.#wrapper = document.createElement('div');
        this.#wrapper.classList.add('infill-editor-wrapper');
        this.#parent_element.appendChild(this.#wrapper);
        this.#wrapper.style.width = width;
        this.#wrapper.style.height = height;

        // ======= TOP NAV =======
        this.#nav = document.createElement('div');
        this.#nav.classList.add('infill-editor-nav');
        this.#wrapper.appendChild(this.#nav);

        // Header buttons + Code + Block quote
        let block_1 = document.createElement('div');
        block_1.classList.add('infill-editor-nav-block');
        this.#nav.appendChild(block_1);
        
        this.#gen_btn(block_1, () => this.#insert_text("# ", "", true), "H1", "Heading 1 | CTRL H", 'infill-align-right');
        this.#gen_btn(block_1, () => this.#insert_text("## ", "", true), "H2", "Heading 2", 'infill-align-right');
        this.#gen_btn(block_1, () => this.#insert_text("### ", "", true), "H3", "Heading 3");

        this.#gen_btn(block_1, () => this.#insert_text("> ", "", true), '<i class="infill-icon infill-icon-blockquote"></i>', 'Blockquote | CTRL Q');
        this.#gen_btn(block_1, () => this.#insert_text("```", "\n```", true), '<i class="infill-icon infill-icon-codeblock"></i>', 'Codeblock | CTRL E');
        this.#gen_btn(block_1, () => this.#insert_text("``", "``", false), '<i class="infill-icon infill-icon-code"></i>', 'Code | CTRL T');

        // Bold, italic, strikethrough, highlight, underline, colored
        let block_2 = document.createElement('div');
        block_2.classList.add('infill-editor-nav-block');
        this.#nav.appendChild(block_2);

        this.#gen_btn(block_2, () => this.#insert_text("**", "**", false), '<strong>B</strong>', 'Bold Text | CTRL B');
        this.#gen_btn(block_2, () => this.#insert_text("_", "_", false), '<em>I</em>', 'Italic Text | CTRL I');
        this.#gen_btn(block_2, () => this.#insert_text("~~", "~~", false), '<s>S</s>', 'Strikethrough Text | CTRL S');
        this.#gen_btn(block_2, () => this.#insert_text("==", "==", false), '<u>U</u>', 'Underline Text | CTRL U');
        this.#gen_btn(block_2, () => this.#insert_text("^", "^", false), '<mark>H</mark>', 'Marked Text | CTRL M');
        this.#gen_btn(block_2, () => this.#insert_text("[|", "]", false), '<i class="infill-icon infill-icon-coloured"></i>', 'Dyed Text | CTRL D');

        // Lists, links, images
        let block_3 = document.createElement('div');
        block_3.classList.add('infill-editor-nav-block');
        this.#nav.appendChild(block_3);

        this.#gen_btn(block_3, () => this.#insert_text("- ", "", true), '<i class="infill-icon infill-icon-unordered-list"></i>', 'Unordered list | CTRL L');
        this.#gen_btn(block_3, () => this.#insert_text("1. ", "", true), '<i class="infill-icon infill-icon-ordered-list"></i>', 'Ordered list | CTRL O');
        this.#gen_btn(block_3, () => this.#insert_text("[", "]()", false), '<i class="infill-icon infill-icon-link"></i>', 'Refrence Link | CTRL R');
        this.#gen_btn(block_3, () => this.#insert_text("![]()", "", false), '<i class="infill-icon infill-icon-image"></i>', 'Picture | CTRL P');

        let sizer = document.createElement('div');
        this.#nav.appendChild(sizer);

        // Zoom slider
        let slider_wrapper = document.createElement('div');
        slider_wrapper.classList.add('infill-slider-wrapper');

        this.#slider = document.createElement('input');
        this.#slider.setAttribute('type', 'range');
        this.#slider.setAttribute('value', '50');
        this.#slider.setAttribute('value', '50');
        this.#slider.setAttribute('step', '5');
        this.#slider.setAttribute('min', '0');
        this.#slider.setAttribute('max', '100');
        this.#slider.classList.add('infill-slider');
        this.#slider.addEventListener('input', () => this.#slider_change());
        slider_wrapper.appendChild(this.#slider);

        this.#nav.appendChild(slider_wrapper);

        // Markdown toggle
        let toggle_wrapper = document.createElement('div');
        toggle_wrapper.classList.add('infill-toggle-wrapper');
        this.#nav.appendChild(toggle_wrapper);

        this.#toggle_check = document.createElement('input');
        this.#toggle_check.setAttribute('type', 'checkbox');
        this.#toggle_check.setAttribute('checked', '');
        this.#toggle_check.classList.add('infill-toggle-check');
        this.#toggle_check.addEventListener('click', () => this.#click_toggle());
        toggle_wrapper.appendChild(this.#toggle_check);

        let toggle_gutter = document.createElement('div');
        toggle_gutter.classList.add('infill-toggle-gutter');
        toggle_wrapper.appendChild(toggle_gutter);

        let toggle_gripper = document.createElement('div');
        toggle_gripper.classList.add('infill-toggle-gripper');
        toggle_wrapper.appendChild(toggle_gripper);

        // ======= EDITOR =======
        this.#editor = document.createElement('div');
        this.#editor.classList.add('infill-editor');
        this.#wrapper.appendChild(this.#editor);

        this.#input = document.createElement('textarea');
        this.#input.classList.add('infill-editor-input');
        this.#input.setAttribute('name', 'infill-editor-input');
        this.#input.addEventListener("input", () => this.#update_markdown_render());
        this.#editor.appendChild(this.#input);

        this.#text_display = document.createElement('div');
        this.#text_display.classList.add('infill-editor-display');
        this.#text_display.addEventListener('pointermove', (e) => this.#editor_mouse_move(e));
        document.addEventListener('pointerdown', (e) => this.#editor_mouse_down(e));
        document.addEventListener('pointerup', (e) => this.#editor_mouse_up(e));
        this.#editor.appendChild(this.#text_display);

        this.#selection_mask = document.createElement('div');
        this.#selection_mask.classList.add('infill-editor-selection-mask');
        this.#editor.appendChild(this.#selection_mask);

        // Events
        document.addEventListener('keydown', (e) => this.#on_key_down(e));
        document.addEventListener('keyup', (e) => this.#on_key_up(e));
        document.addEventListener('paste', (e: ClipboardEvent) => this.#paste_selection(e));
        document.addEventListener('copy', (e: ClipboardEvent) => this.#copy_selection(e));
        document.addEventListener('cut', (e: ClipboardEvent) => this.#cut_selection(e));
        
        // ======= BOTTOM NAV =======
        this.#bott_nav = document.createElement('div');
        this.#bott_nav.classList.add('infill-editor-bottom-nav');
        this.#wrapper.appendChild(this.#bott_nav);

        this.#gen_btn(this.#bott_nav, () => this.#export_file(), '<i class="infill-icon infill-icon-export"></i>', 'Export File');
        this.#gen_btn(this.#bott_nav, () => this.#import_file(), '<i class="infill-icon infill-icon-import"></i>', 'Open File');
    }

    // -------------------------------
    //  Generate the html for a btn                            
    // -------------------------------

    #gen_btn(parent_element: Element, on_click: Function, inner: string, tooltip: string, ...css_classes: Array<string>) {
        let btn = document.createElement('div');
        btn.innerHTML = inner;
        btn.setAttribute('data-infill-tooltip', tooltip);
        btn.classList.add('infill-nav-btn', 'infill-tooltip', ...css_classes);
        parent_element.appendChild(btn);
        btn.addEventListener('click', () => on_click());
    }

    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                            TOP NAVIGATION                                                           
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================

    #insert_text(before_cursor: string, after_cursor: string, force_linebreak: boolean = false) {
        
        let before = "";
        let after = "";
        let inside = "";

        console.log(this.#selection);
        
        if(this.#selection !== null && this.#selection.visible) {
            const start = this.#map_cursor_pos(this.#selection.lo);
            const end = this.#map_cursor_pos(this.#selection.hi);

            before = this.#input.value.slice(0, start);
            inside = this.#input.value.slice(start, end);
            after = this.#input.value.slice(end);
            
        } else {
            const cursor_pos = this.#input.selectionStart;
            before = this.#input.value.slice(0, cursor_pos);
            after = this.#input.value.slice(cursor_pos);
        }

        console.log("TEST", before, after);

        if(before.endsWith(before_cursor) && after.startsWith(after_cursor)) {
            before = before.slice(0, before.length - before_cursor.length);
            after = after.slice(after_cursor.length);

            console.log("AFTER_REPLACE", before, after);

            this.#input.value = before + inside + after;    
        } else {
            if(force_linebreak && before[before.length - 1] !== "\n" && before.length > 0) {
                before += "\n";
            }

            before += before_cursor;
            after = after_cursor + after;

            this.#input.value = before + inside + after;
        }

        window.setTimeout(() => this.set_cursor(before.length + inside.length), 1);
        if(force_linebreak) this.#selection?.discard();

        this.#update_markdown_render();
        if(this.#selection !== null && this.#selection.visible) this.#selection.update_render()
    }

    // -------------------------------
    //  Slider                            
    // -------------------------------

    #slider_change() {

        console.log("SLIDE")
        let scale = 1.0;

        const slider_value = Number(this.#slider.value);

        // Use an exponential function to convert the slider into a zoom
        scale = 0.5 * Math.pow(4, slider_value / 100);

        this.#text_display.style.fontSize = `${scale * 16}px`;
        this.#input.style.fontSize = `${scale * 16}px`;
    }

    // -------------------------------
    //  Toggle button                            
    // -------------------------------

    #click_toggle() {
        const enabled = this.#toggle_check.checked;

        if(enabled) {
            this.#wrapper.classList.remove('infill-parsing-disabled');
            this.#update_markdown_render();
        } else {
            this.#wrapper.classList.add('infill-parsing-disabled');
        }
    }

    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                               EDITOR                                                                       
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================

    // -------------------------------
    //  Editor typing stuff                            
    // -------------------------------

    #last_parse: absolute_map = {
        "html": "",
        "char_map": {
            "absolute_map": [],
            "width_map": [],
            "line_map": [],
            "line_idx_map": []
        }
    };

    #update_markdown_render() {
        let markdown_input = this.#input.value;

        if(! this.#toggle_check.checked) return;

        // Insert a cursor
        const cursor_pos = this.#input.selectionStart;
        markdown_input = markdown_input.slice(0, cursor_pos) + '\uE003' + markdown_input.slice(cursor_pos);

        // Parse markdown
        console.log(markdown_input);

        this.#last_parse = YAMP.parse(markdown_input);

        // Please say this never happens
        if(this.#last_parse.html === undefined) throw Error("[Infill]: whoops something went horribly wrong whilst parsing markdown. Please make an issue on github immediately.");

        console.log(this.#last_parse.html);

        // Sanatize html
        let text = DOMPurify.sanitize(this.#last_parse.html);

        console.log(this.#last_parse.html);

        // Replace the cursor character with an actual element
        this.#text_display.innerHTML = text.replaceAll('\uE003','<i class="infill-editor-cursor"></i>');

        /* 

        this.#parse_worker.postMessage(markdown_input);

        this.#parse_worker.onmessage = (e) => {
            this.#last_parse = e.data;

            // Please say this never happens
            if(this.#last_parse.html === undefined) throw Error("[Infill]: whoops something went horribly wrong whilst parsing markdown. Please make an issue on github immediately.");

            console.log(this.#last_parse.html);

            // Sanatize html
            let text = this.#last_parse.html
            //let text = DOMPurify.sanitize(this.#last_parse.html);

            console.log(this.#last_parse.html);

            // Replace the cursor character with an actual element
            this.#text_display.innerHTML = text.replaceAll('\uE003','<i class="infill-editor-cursor"></i>');
            this.#is_parsing = false;
        }

        */
    }

    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                           KEYBOARD
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================

    #on_key_down(e: KeyboardEvent) {

        // ======= HELPERS =======

        // Helper states
        const key = e.key.toLowerCase();
        const is_shortcut = (
            document.activeElement === this.#input && 
            this.#options.keyboard_shortcuts_enabled && 
            e.getModifierState('Control') && 
            !(e.getModifierState('Alt') || e.getModifierState('Shift'))
        );

        // Update render when using arrow keys        
        if((key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") && !(e.getModifierState('Shift') || e.getModifierState('Ctrl'))) {
            // Wait for the cursor to be moved by the browser and then update
            window.setTimeout(() => this.#update_markdown_render(), 1);
        }
        // ======= GENERAL SHORTCUTS =======
        
        // General insert shortcuts
        if(key === "h" && is_shortcut) {
            this.#insert_text("# ", "", true);

        } else if(key === "q" && is_shortcut) {
            this.#insert_text("> ", "", true);
            
        } else if(key === "e" && is_shortcut) {
            this.#insert_text("```", "\n```", true);

        } else if(key === "t" && is_shortcut) {
            this.#insert_text("``", "``", false);

        } else if(key === "b" && is_shortcut) {
            this.#insert_text("**", "**", false);

        } else if(key === "i" && is_shortcut) {
            this.#insert_text("*", "*", false);

        } else if(key === "s" && is_shortcut) {
            this.#insert_text("~~", "~~", false);

        } else if(key === "u" && is_shortcut) {
            this.#insert_text("==", "==", false);

        } else if(key === "m" && is_shortcut) {
            this.#insert_text("^", "^", false);

        } else if(key === "d" && is_shortcut) {
            this.#insert_text("[|", "]", false);

        } else if(key === "l" && is_shortcut) {
            this.#insert_text("- ", "", true);

        } else if(key === "o" && is_shortcut) {
            this.#insert_text("1. ", "", true);

        } else if(key === "r" && is_shortcut) {
            this.#insert_text("[", "]()", false);

        } else if(key === "p" && is_shortcut) {
            this.#insert_text("![]()", "", false);
        }

        // Prevent default when using a shortcut
        if(is_shortcut && 'hqetbisumdlorp'.includes(key)) {
            e.preventDefault();
            e.stopPropagation();
        }

        // ======= SELECTIONS =======

        // Replace a selection
        if(e.key.length === 1 && !e.getModifierState('Control') && !e.getModifierState('Alt') && this.#selection !== null && this.#selection.visible) {
            e.preventDefault();
            e.stopPropagation();
            this.#replace_selection(e.key);
        }

        // Remove selection
        if((e.key === "Delete" || e.key === "Backspace") && this.#selection !== null && this.#selection.visible) {
            e.preventDefault();
            e.stopPropagation();
            this.#replace_selection('');
        }

        // Select all
        if(
            e.key === "a" && e.getModifierState('Control') && !(e.getModifierState('Alt') || e.getModifierState('Shift')) && 
            this.#wrapper.contains(document.activeElement)
        ) {
            this.#select_all(e);
        }

        // Select with shift
        if(e.key === "ArrowLeft" && e.getModifierState('Shift')) this.#select_left(e, e.getModifierState('Control'));
        if(e.key === "ArrowRight" && e.getModifierState('Shift')) this.#select_right(e, e.getModifierState('Control'));
        if(e.key === "ArrowUp" && e.getModifierState('Shift')) this.#select_up(e);
        if(e.key === "ArrowDown" && e.getModifierState('Shift')) this.#select_down(e);

        // Escape selection
        if(e.key === "ArrowLeft" && !e.getModifierState('Shift')) this.#escape_selection(e, this.#selection?.lo, true);
        if(e.key === "ArrowRight" && !e.getModifierState('Shift')) this.#escape_selection(e, this.#selection?.hi, true);
        if(e.key === "ArrowUp" && !e.getModifierState('Shift')) this.#escape_selection_up(e);
        if(e.key === "ArrowDown" && !e.getModifierState('Shift')) this.#escape_selection_down(e);

        if(e.key == "Escape") this.#escape_selection(e);

    }
    
    #on_key_up(e: KeyboardEvent) {

    }

    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                          DETECT MOUSE EVENTS                                                            
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================

    // -------------------------------
    //  Detect clicking vs selecting                         
    // -------------------------------

    #selection: EditorSelection | null = null;
    #anchor_pos: Array<number> = [0, 0];
    #mouse_down: boolean = false;

    // -------------------------------
    //  Mouse down                            
    // -------------------------------

    #editor_mouse_down(e: MouseEvent) {
        if(e.target === null || !(e.target instanceof Node)) return;
        if(!this.#toggle_check.checked) return;

        
        if(this.#editor.contains(e.target)) {
            this.#mouse_down = true;
            this.#anchor_pos = [e.clientX, e.clientY];

            const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;

            // discard the old selection
            this.#selection?.discard();

            if(cursor === undefined) return this.#selection = null;
            this.#target_line_offs = null; // Reset the offset (used for selecting up and down)

            // Register a new selection
            const mapped_pos = this.#map_cursor_pos(cursor);
            if(mapped_pos !== undefined) this.#selection_anchor = mapped_pos;
            this.#selection = new EditorSelection(this.#text_display, this.#selection_mask, cursor, cursor);
        } else if(!this.#nav.contains(e.target)) {
            this.#selection?.discard();
        }
    }

    // -------------------------------
    //  Mouse move                            
    // -------------------------------

    #editor_mouse_move(e: MouseEvent) {
        if(!this.#toggle_check.checked) return;

        // Update the selection
        if(this.#mouse_down) {
            const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;
            if(cursor !== undefined) this.#selection?.set_end(cursor);
        }

        // Detect if the mouse should start selecting by calculating the position from the anchor
        if(this.#mouse_down && (this.#selection === null || !this.#selection.visible)) {
            let start_x = this.#anchor_pos[0];
            let start_y = this.#anchor_pos[1];

            if(start_x === undefined || start_y === undefined) return;

            let dist = (start_x - e.clientX)**2 + (start_y - e.clientY)**2;
            if(dist >= 64) {
                this.#selection?.apply();
                this.#target_line_offs = null;
            }
        }
    }

    // -------------------------------
    //  Mouse Up                            
    // -------------------------------

    #editor_mouse_up(e: MouseEvent) {
        if(!this.#toggle_check.checked) return;
        if(this.#mouse_down) {
            const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;
            if(cursor !== undefined) this.#selection?.set_end(cursor);

            // Always move the position
            if(cursor) {
                const mapped_pos = this.#map_cursor_pos(cursor);
                if(mapped_pos !== undefined) this.set_cursor(mapped_pos);
            } else {
                this.set_cursor(this.#input.value.length);
            }
            this.#update_markdown_render();
        }
        this.#mouse_down = false;
    }
    
    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                       HANDLE CURSORS                                                                       
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================

    // -------------------------------
    //  Helpers                            
    // -------------------------------

    set_cursor(position: number, no_focus = false, no_update = false) {
        this.#text_display.querySelector('.infill-editor-cursor')?.classList.add('infill-cursor-force-mark');
        window.setTimeout(() => this.#text_display.querySelector('.infill-editor-cursor')?.classList.remove('infill-cursor-force-mark'), 500);
        if(!no_focus) this.#input.focus();
        this.#input.selectionStart = position;
        this.#input.selectionEnd = position;
        if(!no_update) this.#update_markdown_render();
    }

    // Map a cursor pos from html to markdown
    #map_cursor_pos(position: number) {
        return this.#last_parse.char_map.absolute_map[position];
    }

    // Map a cusor pos from markdown to html
    #inverse_map_cursor_pos(position: number, map: Array<number> = this.#last_parse.char_map.absolute_map) {
        const last_item = map[map.length - 1];
        const first_item = map[0];

        let mapped = map.indexOf(position);

        // Detect index out of range
        if(last_item !== undefined && position > last_item) return -1;
        if(first_item !== undefined && position < first_item) return -1;

        // Get the closest lower bound if the cursor pos didn't exist
        while(mapped === -1 && position > 0) {
            position--;
            mapped = map.indexOf(position);
        }

        return mapped;
    }

    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                      HANDLE SELECTIONS                                                                       
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================

    // -------------------------------
    //  Helpers                            
    // -------------------------------

    // Replace selected text with a replacement string
    #replace_selection(value: string | undefined) {
        if(this.#selection === null || value === undefined) return null;

        // Convert the cursor pos from the html into a cursor pos in the textarea
        const start = this.#map_cursor_pos(this.#selection.lo);
        const end = this.#map_cursor_pos(this.#selection.hi);

        if(start === undefined) return null;

        const before = this.#input.value.slice(0, start);
        const inside = this.#input.value.slice(start, end);
        const after = this.#input.value.slice(end);

        this.#input.value = before + value + after;
        this.#update_markdown_render();

        this.set_cursor(start + value.length);
        this.#selection.discard();
        return inside;
    }

    // get the line idx corresponding to a character offset in html
    #get_line_idx(offs: number) {
        const result = this.#last_parse.char_map.line_idx_map[offs];
        if(result === undefined) return -1;
        return result;
    }

    // Create a new selection when there isn't one yet
    #init_selection(cursor_md_pos: number, cursor_html_pos: number) {
        if(this.#selection === null || !this.#selection.visible) {
            this.#target_line_offs === null;
            this.#selection_anchor = cursor_md_pos;
            this.#input.blur();
            let sel = new EditorSelection(this.#text_display, this.#selection_mask, cursor_html_pos, cursor_html_pos);
            sel.apply();
            return sel;
        }
        return this.#selection;
    }

    // Calculate the target offset when selecting up or down
    #init_target_offs(selection_pos: number, curr_line_map: Array<number>) {
        // Create a new target offset when there isn't one yet
        if(this.#target_line_offs === null) {         

            // Get the index of the first char of this line (MARKDOWN COORDS)
            let line_start_idx_markdown = curr_line_map[0];

            if(line_start_idx_markdown === undefined) line_start_idx_markdown = 0;

            // Get the index of the first char of this line (HTML COORDS)
            const line_start_idx = this.#inverse_map_cursor_pos(line_start_idx_markdown);

            return selection_pos - line_start_idx;
        }
        return this.#target_line_offs;
    }

    // -------------------------------
    //  Copy                            
    // -------------------------------

    #copy_selection(e: ClipboardEvent) {
        if(!this.#toggle_check.checked) return;
        if(this.#selection !== null && this.#selection.visible) {
            e.preventDefault();
            e.stopPropagation();

            const start = this.#map_cursor_pos(this.#selection.lo);
            const end = this.#map_cursor_pos(this.#selection.hi);

            const selected = this.#input.value.slice(start, end);

            e.clipboardData?.setData('text', selected);
        }
    }

    // -------------------------------
    //  Paste                            
    // -------------------------------

    #paste_selection(e: ClipboardEvent) {
        if(!this.#toggle_check.checked) return;
        if(this.#selection !== null && this.#selection.visible) {
            e.preventDefault();
            e.stopPropagation();

            const replacement = e.clipboardData?.getData('text');

            if(replacement === undefined) return;

            this.#replace_selection(replacement);
        }
    }

    // -------------------------------
    //  Cut                            
    // -------------------------------

    #cut_selection(e: ClipboardEvent) {
        if(!this.#toggle_check.checked) return;
        if(this.#selection !== null && this.#selection.visible) {
            e.preventDefault();
            e.stopPropagation();

            const inside = this.#replace_selection("");
            if(inside === null) return;

            e.clipboardData?.setData('text', inside);
        }
    }

    // -------------------------------
    //  Select All                            
    // -------------------------------

    #select_all(e: KeyboardEvent) {
        if(!this.#toggle_check.checked) return;
        const abs_map = this.#last_parse.char_map.absolute_map;

        if(this.#selection === null || !this.#selection.visible) {
            this.#selection = new EditorSelection(this.#text_display, this.#selection_mask, 0, abs_map.length - 1);
            this.#selection.apply();
        } else {
            this.#selection.set_start(0);
            this.#selection.set_end(abs_map.length - 1);
        }

        const targ_cursor_pos = abs_map[abs_map.length - 1];
        if(targ_cursor_pos !== undefined) this.set_cursor(targ_cursor_pos);

        e.preventDefault();
        e.stopPropagation();
    }

    // -------------------------------
    //  Select with shift                            
    // -------------------------------

    // Main helper
    #select_distance(dist: number) {
        if(!this.#toggle_check.checked) return;
        const cursor_md_pos = this.#input.selectionStart;
        const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);

        if(cursor_html_pos === undefined) return;
        this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);

        let sel_end_md = this.#map_cursor_pos(this.#selection.end + dist);

        const abs_char_map = this.#last_parse.char_map.absolute_map;
        const max_len = abs_char_map[abs_char_map.length - 1];
        if(max_len === undefined || sel_end_md === undefined) return;

        if(sel_end_md < 0) sel_end_md = 0;
        if(sel_end_md > max_len) sel_end_md = max_len;

        this.set_cursor(sel_end_md);

        const sel_end = this.#inverse_map_cursor_pos(sel_end_md);
        const sel_start = this.#inverse_map_cursor_pos(this.#selection_anchor);

        this.#selection.set_end(sel_end);
        this.#selection.set_start(sel_start);
    }

    #target_line_offs: number | null = 0;
    #selection_anchor: number = 0;

    #select_left(e: KeyboardEvent, ctrl: boolean) {
        if(!this.#toggle_check.checked) return;
        
        if((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
        e.preventDefault();
        e.stopPropagation();

        console.log('SELECT');

        if(ctrl) {
            // Collapse the selection with CTRL
            if(
                this.#selection !== null && this.#selection.visible && this.#selection.end > this.#selection.start
            ) {
                const start_line_idx = this.#get_line_idx(this.#selection.start)
                const end_line_idx = this.#get_line_idx(this.#selection.end)

                if(start_line_idx === end_line_idx || end_line_idx === start_line_idx + 1) {
                    this.#escape_selection(null, this.#selection.lo, true);
                    return;
                }
            }

            // Select till the start of the line whith CTRL
            
            const cursor_md_pos = this.#input.selectionStart;
            const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);

            // Init a new selection if needed
            this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);

            let line_idx = this.#get_line_idx(this.#selection.end); // The index of the current line
            
            let prev_line_map = this.#last_parse.char_map.line_map[line_idx - 1];
            let targ_md_pos: number | undefined;

            // We might be at the end of the line so select till there
            if(prev_line_map === undefined) {
                targ_md_pos = this.#last_parse.char_map.absolute_map[0];

            // else just select till the first char of the next line
            } else {
                targ_md_pos = prev_line_map[prev_line_map.length - 1];
            }

            if(targ_md_pos === undefined) return;

            this.set_cursor(targ_md_pos);

            const targ_html_pos = this.#inverse_map_cursor_pos(targ_md_pos);
            const targ_html_start_pos = this.#inverse_map_cursor_pos(this.#selection_anchor);

            this.#selection.set_start(targ_html_start_pos);  
            this.#selection.set_end(targ_html_pos);  

        // Otherwise just decrease the selection end by one
        } else {
            this.#select_distance(-1);
        }

        this.#target_line_offs = null;
    }

    #select_right(e: KeyboardEvent, ctrl: boolean) {
        if(!this.#toggle_check.checked) return;
        if((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
        e.preventDefault();
        e.stopPropagation();

        this.#target_line_offs = null;

        // Select till the end of the line whith CTRL
        if(ctrl) {
            // Collapse the selection with CTRL
            if(
                this.#selection !== null && this.#selection.visible && this.#selection.end < this.#selection.start
            ) {
                const start_line_idx = this.#get_line_idx(this.#selection.start)
                const end_line_idx = this.#get_line_idx(this.#selection.end)

                if(start_line_idx === end_line_idx || end_line_idx === start_line_idx - 1) {
                    this.#escape_selection(null, this.#selection.hi, true);
                    return;
                }
            }

            // Select till the end of the line whith CTRL
            const cursor_md_pos = this.#input.selectionStart;
            const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);

            // Init a new selection if needed
            this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);

            let line_idx = this.#get_line_idx(this.#selection.end); // The index of the current line
            
            let next_line_map = this.#last_parse.char_map.line_map[line_idx + 1];
            let targ_md_pos: number | undefined;

            // We might be at the end of the line so select till there
            if(next_line_map === undefined) {
                const abs_map = this.#last_parse.char_map.absolute_map;
                targ_md_pos = abs_map[abs_map.length - 1];

            // else just select till the first char of the next line
            } else {
                targ_md_pos = next_line_map[0];
            }

            if(targ_md_pos === undefined) return;
            

            targ_md_pos--;

            this.set_cursor(targ_md_pos);

            const targ_html_pos = this.#inverse_map_cursor_pos(targ_md_pos);
            const targ_html_start_pos = this.#inverse_map_cursor_pos(this.#selection_anchor);

            this.#selection.set_start(targ_html_start_pos);  
            this.#selection.set_end(targ_html_pos);  

        // Otherwise just increase the selection end by 1
        } else {
            this.#select_distance(1);
        }

        
    }

    #select_up(e: KeyboardEvent) {
        if(!this.#toggle_check.checked) return;
        if((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
        e.preventDefault();
        e.stopPropagation();

        const cursor_md_pos = this.#input.selectionStart
        const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);
        let line_idx = this.#get_line_idx(cursor_html_pos); // The index of the current line

        // Create a new selection when there isn't one yet
        this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);

        const selection_pos = this.#selection.end;
        const curr_line_map = this.#last_parse.char_map.line_map[line_idx];
        if(curr_line_map === undefined) return;

        // Init the target offset if it isn't already set
        this.#target_line_offs = this.#init_target_offs(selection_pos, curr_line_map);

        line_idx = this.#get_line_idx(this.#selection.end);
        const prev_line = this.#last_parse.char_map.line_map[line_idx - 1];

        // No previous line so select till the end
        if(prev_line === undefined) {

            // Yup it's here, the one and only var. In front of your eyes, to admire in all it's cursedness.
            var target_md_char = curr_line_map[0];
        } else {
            // Calculate the target character we'd like to select towards (MARKDOWN COORDS)
            var target_md_char = prev_line[this.#target_line_offs];

            // Else, select till the start of the line
            if(target_md_char === undefined) target_md_char = prev_line[prev_line.length - 1];
        }

        if(target_md_char === undefined) return; // Random typescript bullshit

        this.set_cursor(target_md_char);

        // Conver to html coords
        const target_end_char = this.#inverse_map_cursor_pos(target_md_char);

        // Re-calculate the start position too because the HTML layout might have changed due to the cursor movement
        const target_start_char = this.#inverse_map_cursor_pos(this.#selection_anchor);

        this.#selection.set_end(target_end_char);
        this.#selection.set_start(target_start_char);

        // Collapse selection
        if(this.#selection.length === 0) {
            this.#selection.discard();
        }
    }

    #select_down(e: KeyboardEvent) {
        if(!this.#toggle_check.checked) return;
        if((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
        e.preventDefault();
        e.stopPropagation();

        const cursor_md_pos = this.#input.selectionStart
        const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);
        let line_idx = this.#get_line_idx(cursor_html_pos); // The index of the current line

        // Create a new selection when there isn't one yet
        this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);

        const selection_pos = this.#selection.end;
        const curr_line_map = this.#last_parse.char_map.line_map[line_idx];
        if(curr_line_map === undefined) return;

        // Init the target offset if it isn't already set
        this.#target_line_offs = this.#init_target_offs(selection_pos, curr_line_map);

        line_idx = this.#get_line_idx(this.#selection.end);
        const next_line = this.#last_parse.char_map.line_map[line_idx + 1];

        // No previous line so select till the end
        if(next_line === undefined) {

            // Yup it's here, the one and only var. In front of your eyes, to admire in all it's cursedness.
            var target_md_char = curr_line_map[curr_line_map.length - 1];
            if(target_md_char === undefined) return; // Random typescript bullshit

        } else {
            // Calculate the target character we'd like to select towards (MARKDOWN COORDS)
            var target_md_char = next_line[this.#target_line_offs];

            // Else, select till the end of the next line
            if(target_md_char === undefined) target_md_char = next_line[next_line.length - 1];  
            if(target_md_char === undefined) return; // Random typescript bullshit
            target_md_char--;
        }

        this.set_cursor(target_md_char);

        // Conver to html coords
        const target_end_char = this.#inverse_map_cursor_pos(target_md_char);

        // Re-calculate the start position too because the HTML layout might have changed due to the cursor movement
        const target_start_char = this.#inverse_map_cursor_pos(this.#selection_anchor);

        this.#selection.set_end(target_end_char);
        this.#selection.set_start(target_start_char);

        // Collapse selection
        if(this.#selection.length === 0) {
            this.#selection.discard();
        }
    }

    // -------------------------------
    //  Escape selection                            
    // -------------------------------

    // Escape the selection whilst leaving the cursor position at the end of the selection
    #escape_selection(e: KeyboardEvent | null = null, cursor_pos: number | undefined = undefined, unit_html: boolean = true) {
        if(this.#selection === null || !this.#selection.visible) return;
        if(!this.#toggle_check.checked) return;

        // Optionally move the cursor pos
        if(cursor_pos !== undefined) {
            let target_pos: number | undefined;

            // Convert to md units if needed
            if(unit_html) {
                target_pos = this.#last_parse.char_map.absolute_map[cursor_pos];
            } else {
                target_pos = cursor_pos;
            }

            if(target_pos === undefined) return;
            this.set_cursor(target_pos);
        }

        if(e !== null) {
            e.preventDefault();
            e.stopPropagation();
        }

        this.#target_line_offs = null;
        this.#selection?.discard();
    }

    // Escape a selection on the left
    #escape_selection_up(e: KeyboardEvent) {
        if(this.#selection === null || !this.#selection.visible) return;
        if(!this.#toggle_check.checked) return;

        e.preventDefault();
        e.stopPropagation();

        let line_idx = this.#get_line_idx(this.#selection.lo); // The index of the current line

        const curr_line_map = this.#last_parse.char_map.line_map[line_idx];
        const prev_line_map = this.#last_parse.char_map.line_map[line_idx - 1];

        let targ_md_pos = this.#map_cursor_pos(this.#selection.lo);

        if(curr_line_map !== undefined && prev_line_map !== undefined) {
            const target = this.#init_target_offs(this.#selection.lo, curr_line_map);
            targ_md_pos = prev_line_map[target];   
        }
        
        this.#escape_selection(null, targ_md_pos, false);
    }

    // Escape a selection on the left
    #escape_selection_down(e: KeyboardEvent) {
        if(this.#selection === null || !this.#selection.visible) return;
        if(!this.#toggle_check.checked) return;

        e.preventDefault();
        e.stopPropagation();

        let line_idx = this.#get_line_idx(this.#selection.hi); // The index of the current line

        const curr_line_map = this.#last_parse.char_map.line_map[line_idx];
        const next_line_map = this.#last_parse.char_map.line_map[line_idx + 1];

        let targ_md_pos = this.#map_cursor_pos(this.#selection.hi);

        if(curr_line_map !== undefined && next_line_map !== undefined) {
            const target = this.#init_target_offs(this.#selection.hi, curr_line_map);
            targ_md_pos = next_line_map[target];   
        }
        
        if(targ_md_pos !== undefined) targ_md_pos--;
        
        this.#escape_selection(null, targ_md_pos, false);
    }
    
    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                       IMPORT / EXPORT FILES                                                                       
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================

    #import_file() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.txt,.md');
        input.click();
        input.addEventListener('change', (e) => {
            let file = input.files?.[0];
            let reader = new FileReader();

            input.value = ""; // Reset for next time

            if (!file) return; // Stop when there is no file

            reader.readAsText(file, "UTF-8");
            reader.addEventListener('load', (e) => {
                const result = reader.result;
                if(typeof result === "string") this.#input.value = result;

                this.#update_markdown_render();
            });
        });
    }

    #export_file() {
        const curr_date = new Date();

        let default_file_name = `infill_export_${curr_date.getDate()}-${curr_date.getMonth() + 1}_${curr_date.getHours()}-${curr_date.getMinutes()}.md`;

        download_file(this.#input.value, default_file_name, 'text/plain');
    }
}