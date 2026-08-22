// As you can see, I'm still learning how I can split my code across multiple files :/


// ==========================================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------------------
//                                                              IMPORTS                                                                       
// ------------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================================================================================================

import './utils';
import type { options } from "./public_types";
import * as YAMP from "@theblackswitch/yamp";
import './prismjs_highlight/mcfunction';
import DOMPurify from 'dompurify'
import { cursor_pos_from_point } from './utils';
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

        // ======= NAV =======
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

    #last_parse: {html: string, char_map: {width_map: Array<Array<number>>, absolute_map: Array<number>, line_map: Array<Array<number>>}} = {
        "html": "",
        "char_map": {
            "absolute_map": [],
            "width_map": [],
            "line_map": []
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

        if(e.key === "ArrowLeft") this.#select_left(e, e.getModifierState('Control'));
        if(e.key === "ArrowRight" && e.getModifierState('Shift')) this.#select_right(e, e.getModifierState('Control'));
        if(e.key === "ArrowUp" && e.getModifierState('Shift')) this.#select_up(e);
        if(e.key === "ArrowDown" && e.getModifierState('Shift')) this.#select_down(e);

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
    #has_selection: boolean = false;

    // -------------------------------
    //  Mouse down                            
    // -------------------------------

    #editor_mouse_down(e: MouseEvent) {
        if(e.target === null || !(e.target instanceof Node)) return;

        
        if(this.#editor.contains(e.target)) {
            this.#mouse_down = true;
            this.#has_selection = false;
            this.#anchor_pos = [e.clientX, e.clientY];

            const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;

            // discard the old selection
            this.#selection?.discard();

            if(cursor === undefined) return this.#selection = null;
            this.#target_line_offs = null; // Reset the offset (used for selecting up and down)

            // Register a new selection
            this.#selection = new EditorSelection(this.#text_display, this.#selection_mask, cursor, cursor);
        } else if(!this.#nav.contains(e.target)) {
            this.#selection?.discard();
        }
    }

    // -------------------------------
    //  Mouse move                            
    // -------------------------------

    #editor_mouse_move(e: MouseEvent) {

        // Update the selection
        if(this.#mouse_down) {
            const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;
            if(cursor !== undefined) this.#selection?.set_end(cursor);
        }

        // Detect if the mouse should start selecting by calculating the position from the anchor
        if(this.#mouse_down && !this.#has_selection) {
            let start_x = this.#anchor_pos[0];
            let start_y = this.#anchor_pos[1];

            if(start_x === undefined || start_y === undefined) return;

            let dist = (start_x - e.clientX)**2 + (start_y - e.clientY)**2;
            if(dist >= 64) {
                this.#selection?.apply();
                this.#has_selection = true;
                this.#target_line_offs = null;
            }
        }
    }

    // -------------------------------
    //  Mouse Up                            
    // -------------------------------

    #editor_mouse_up(e: MouseEvent) {
        if(this.#mouse_down) {
            const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;
            if(cursor !== undefined) this.#selection?.set_end(cursor);

            // This event is a click so re-position the cursor
            if(!this.#has_selection && !window.getSelection()?.toString()) {
                if(cursor) {
                    const mapped_pos = this.#map_cursor_pos(cursor);
                    if(mapped_pos !== undefined) this.set_cursor(mapped_pos);
                } else {
                    this.set_cursor(this.#input.value.length);
                }
                this.#update_markdown_render();
            }
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
        return this.#last_parse.char_map.;
    }

    // -------------------------------
    //  Copy                            
    // -------------------------------

    #copy_selection(e: ClipboardEvent) {
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
        if(this.#selection !== null && this.#selection.visible) {
            e.preventDefault();
            e.stopPropagation();

            const inside = this.#replace_selection("");
            if(inside === null) return;

            e.clipboardData?.setData('text', inside);
        }
    }

    // -------------------------------
    //  Select with shift                            
    // -------------------------------

    // Main helper
    #select(dist: number) {
        const cursor = this.#inverse_map_cursor_pos(this.#input.selectionStart);

        console.log(cursor);

        if(cursor === undefined) return;

        if(this.#selection === null || !this.#selection.visible) {
            this.#input.blur();
            this.#selection = new EditorSelection(this.#text_display, this.#selection_mask, cursor, cursor);
            this.#selection.apply();
        }

        // limit the final distance to not extend beyond the text contents
        const final_dist = Math.max(
            Math.min(
                dist,
                this.#last_parse.char_map?.absolute_map.length - this.#selection.end - 2
            ),
            -this.#selection.end
        );

        console.log(dist, final_dist, this.#selection.end);

        // Apply the final distance
        if(final_dist !== 0) this.#selection.move_end(final_dist);

        // Collapse into a cursor
        if(this.#selection.length === 0) {
            const sel = this.#map_cursor_pos(this.#selection.end)
            if(sel !== undefined) this.set_cursor(sel);
            this.#selection.discard();
        
        // Move the cursor with the selection
        } else if(this.#selection !== null) {
            const sel = this.#map_cursor_pos(this.#selection.end)
            if(sel !== undefined) this.set_cursor(sel);
        }
    }

    #target_line_offs: number | null = 0;

    #select_left(e: KeyboardEvent, ctrl: boolean) {
        
        if((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
        e.preventDefault();
        e.stopPropagation();

        console.log('SELECT');


        // Select till the start of the line whith CTRL
        if(ctrl) {
            const cursor_pos = this.#input.selectionStart;
            const line_idx = this.#get_line_idx(cursor_pos);

            const curr_line_map = this.#last_parse.char_map.line_map[line_idx];

            if(curr_line_map == undefined) return;

            let end_line_offset = curr_line_map.indexOf(cursor_pos);
            if(end_line_offset === -1) end_line_offset = curr_line_map.length;

            this.#select(-end_line_offset - 1);

        // Otherwise just decrease the selection end by one
        } else {
            this.#select(-1);
        }

        this.#target_line_offs = null;
    }

    #select_right(e: KeyboardEvent, ctrl: boolean) {
        if((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
        e.preventDefault();
        e.stopPropagation();

        // Select till the end of the line whith CTRL
        if(ctrl) {
            const cursor_pos = this.#input.selectionStart;
            const line_idx = this.#get_line_idx(cursor_pos);

            const curr_line_map = this.#last_parse.char_map.line_map[line_idx];

            if(curr_line_map == undefined) return;

            let end_line_offset = curr_line_map.indexOf(cursor_pos);
            if(end_line_offset === -1) end_line_offset = curr_line_map.length;

            this.#select(curr_line_map.length - end_line_offset);

        // Otherwise just increase the selection end by 1
        } else {
            this.#select(1);
        }

        this.#target_line_offs = null;
    }

    #select_up(e: KeyboardEvent) {
        if((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
        e.preventDefault();
        e.stopPropagation();

        const cursor_pos_html = this.#inverse_map_cursor_pos(this.#input.selectionStart);

        if(this.#selection === null || !this.#selection.visible) {

            // Calculate the target offset
            const line_idx = this.#get_line_idx(cursor_pos_html); // The index of the current line
            const curr_line_map = this.#last_parse

            const line_start_offs = 

            this.#input.blur();
            this.#selection = new EditorSelection(this.#text_display, this.#selection_mask, cursor_pos_html, cursor_pos_html);
            this.#selection.apply();
        }

        const selection_pos = this.#selection.end;

        
    }

    #select_down(e: KeyboardEvent) {
        if((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
        e.preventDefault();
        e.stopPropagation();

        
    }
}