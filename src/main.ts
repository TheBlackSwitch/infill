// ==========================================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------------------
//                                                              IMPORTS                                                                       
// ------------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================================================================================================

import type { options } from "./public_types";
import * as YAMP from "@theblackswitch/yamp";
import './prismjs_highlight/mcfunction';
import DOMPurify from 'dompurify'

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
        this.#text_display.classList.add('infill-editor-display')
        this.#text_display.addEventListener('pointerdown', (e) => this.#editor_mouse_down(e));
        this.#text_display.addEventListener('pointerleave', (e) => this.#editor_mouse_leave(e));
        this.#text_display.addEventListener('pointermove', (e) => this.#editor_mouse_move(e));
        this.#text_display.addEventListener('pointerup', (e) => this.#editor_mouse_up(e));
        this.#editor.appendChild(this.#text_display);

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

        if(window.getSelection()?.toString()) {

            const selection = this.#get_selection();

            if(selection === null) return;

            before = this.#input.value.slice(0, this.#last_parse.char_map.absolute_map[selection.start]);
            inside = this.#input.value.slice(this.#last_parse.char_map.absolute_map[selection.start], this.#last_parse.char_map.absolute_map[selection.end]);
            after = this.#input.value.slice(this.#last_parse.char_map.absolute_map[selection.end]);
            
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



        window.setTimeout(() => this.set_cursor(before.length + inside.length, true), 1);

        this.#update_markdown_render();
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

    #last_parse: {html: string, char_map: {width_map: Array<Array<number>>, absolute_map: Array<number>}} = {
        "html": "",
        "char_map": {
            "absolute_map": [],
            "width_map": []
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
        let text = this.#last_parse.html
        //let text = DOMPurify.sanitize(this.#last_parse.html);

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

    // -------------------------------
    //  Editor cursor stuff                           
    // -------------------------------

    #selection_start: number | null = null;
    #selection_start_pos: Array<number> = [0, 0];
    #selection_end: number = 0;
    #mouse_down: boolean = false;
    #has_selection: boolean = false;

    #editor_mouse_down(e: MouseEvent) {
        this.#mouse_down = true;
        this.#has_selection = false;
        this.#selection_start_pos = [e.clientX, e.clientY];
        const cursor = this.#get_carret_position_from_point(this.#text_display, e.clientX, e.clientY)?.global;
        this.#selection_start = cursor ? cursor : null;
    }

    #editor_mouse_leave(e: MouseEvent) {
    }

    #editor_mouse_move(e: MouseEvent) {
        if(this.#mouse_down) {
            const cursor = this.#get_carret_position_from_point(this.#text_display, e.clientX, e.clientY)?.global;
            console.log(cursor);
            if(cursor !== undefined) this.#selection_end = cursor;
        }
        if(this.#mouse_down && !this.#has_selection) {
            let start_x = this.#selection_start_pos[0];
            let start_y = this.#selection_start_pos[1];

            if(start_x === undefined || start_y === undefined) return;

            let dist = (start_x - e.clientX)**2 + (start_y - e.clientY)**2;
            if(dist >= 64) {
                console.log("SELECT!");
                this.#has_selection = true;
            }
        }
    }

    #editor_mouse_up(e: MouseEvent) {
        if(this.#mouse_down) {
            const cursor = this.#get_carret_position_from_point(this.#text_display, e.clientX, e.clientY)?.global;
            if(cursor !== undefined) this.#selection_end = cursor;
            if(!this.#has_selection && !window.getSelection()?.toString()) {

                let result = this.#get_carret_position_from_point(this.#text_display, e.clientX, e.clientY);
                console.log(result?.global);

                if(result !== null && result.global !== undefined) {
                    let mapped_cursor_pos = this.#last_parse.char_map.absolute_map[result.global];
                    if(mapped_cursor_pos !== undefined) this.set_cursor(mapped_cursor_pos);
                } else {
                    this.set_cursor(this.#input.value.length);
                }
            }
        }
        this.#mouse_down = false;
    }

    set_cursor(position: number, no_focus = false) {
        this.#text_display.querySelector('.infill-editor-cursor')?.classList.add('infill-cursor-force-mark');
        window.setTimeout(() => this.#text_display.querySelector('.infill-editor-cursor')?.classList.remove('infill-cursor-force-mark'), 500);
        if(!no_focus) this.#input.focus();
        this.#input.selectionStart = position;
        this.#input.selectionEnd = position;
        this.#update_markdown_render();
    }

    // Get the cursor position inside an element depending on the location at which we clicked
    #get_carret_position_from_point(root_element: HTMLElement, x: number, y: number) {

        let carret_node: Node;
        let local_offset: number = 0;

        // get the carret position on a node
        if(typeof document.caretPositionFromPoint === "function") {
            let carret_position = document.caretPositionFromPoint(x, y);
            if(!carret_position) return null;
            carret_node = carret_position.offsetNode;
            local_offset = carret_position.offset;

        // Browser compat
        } else if(typeof document.caretRangeFromPoint === "function") {
            let carret_position = document.caretRangeFromPoint(x, y);
            if(!carret_position) return null;
            carret_node = carret_position.startContainer;
            local_offset = carret_position.startOffset;

        } else {
            console.warn("You're using an older browser, selecting in the editor is not supported here!");
            return null;
        }


        const walker = document.createTreeWalker(root_element, NodeFilter.SHOW_ALL); // Create a walker to go through all text nodes

        let offset = 0;
        while(true) { // Go through all text nodes <p></p> <strong></strong> etc.
            let node = walker.nextNode();
            if(!node) return null;
            
            if(node.nodeType === Node.TEXT_NODE) {
                if(carret_node === node) {
                    offset += local_offset;
                    break;
                }
                if(node.textContent) offset += node.textContent.length;
            }
            
        }

        return {
            "global": offset,
            "local": local_offset
        };
    }

    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                           KEYBOARD
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================

    #on_key_down(e: KeyboardEvent) {
        const key = e.key.toLowerCase();
        const is_shortcut = (
            document.activeElement === this.#input && 
            this.#options.keyboard_shortcuts_enabled && 
            e.getModifierState('Control') && 
            !(e.getModifierState('Alt') || e.getModifierState('Shift'))
        );

        // Detect removing a selection
        if(
            window.getSelection()?.toString() && 
            (e.key === "Backspace" || e.key === "Delete")
        ) {
            e.preventDefault();
            e.stopPropagation();
            this.#replace_selection('');
        }

        // Detect replacing a selection
        if(
            window.getSelection()?.toString() && 
            e.key.length === 1 && 
            !e.getModifierState('Control') && 
            !e.getModifierState('Alt')
        ) {
            e.preventDefault();
            e.stopPropagation();
            this.#replace_selection(e.key);
        }

        // Update render when using arrow keys        
        if((key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") && !(e.getModifierState('Shift') || e.getModifierState('Ctrl'))) {
            window.setTimeout(() => this.#update_markdown_render(), 1);
        
        // General insert shortcuts
        } else if(key === "h" && is_shortcut) {
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
            
        // Start selection when using SHIFT + Arrow key
        } else if((key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") && e.getModifierState('Shift') && document.activeElement === this.#input) {
            const input_cursor_pos = this.#input.selectionStart;
            const output_cursor_pos = this.#last_parse.char_map.absolute_map.indexOf(input_cursor_pos);
            this.#select_text(this.#text_display, output_cursor_pos, output_cursor_pos);
        
        // Select all text
        } else if(key === "a" && e.getModifierState('Control') && !e.getModifierState('Shift')) {
            this.#select_all(e);
        }

        if(is_shortcut && 'hqetbisumdlorp'.includes(key)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
    
    #on_key_up(e: KeyboardEvent) {

    }

    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                        FIX SELECTIONS                                                                       
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================




    // Get the start and end pos of the last selection
    #get_selection() {

        // Get the cursor pos of start and end
        const sel_start = this.#selection_start;
        const sel_end = this.#selection_end;

        if(sel_start === null) return null;

        // Sort the cursor positions
        const start_char = Math.min(sel_start, sel_end);
        let end_char = Math.max(sel_start, sel_end);

        if(start_char === undefined || end_char === undefined) return null;

        if(end_char === this.#last_parse.char_map.absolute_map.length - 1) end_char = this.#input.value.length - 1;

        // Return the selection
        return {"start": start_char, "end": end_char};
    }

    // Check if the display element contains the currently selected text
    #contains_selection(): boolean {

        // Get the current selection
        const sel = document.getSelection();
        if(sel === null || !sel.toString()) return false;
        const curr_sel = sel.getRangeAt(0);

        // Check if the start and end of the selection are within the container
        return this.#wrapper.contains(curr_sel.startContainer) && this.#wrapper.contains(curr_sel.endContainer);
    }

    // Replace a selection when typing
    #replace_selection(value: string | undefined) {
        const selection = this.#get_selection();

        if(selection === null || value === undefined) return;

        // Convert the cursor pos from the html into a cursor pos in the textarea
        let start = this.#last_parse.char_map.absolute_map[selection.start];
        let end = this.#last_parse.char_map.absolute_map[selection.end];

        if(start === undefined) return;

        let before = this.#input.value.slice(0, start);
        let after = this.#input.value.slice(end);

        this.#input.value = before + value + after;
        this.#update_markdown_render();
        this.set_cursor(before.length + value.length);
    }

    #paste_selection(e: ClipboardEvent) {
        const text = e.clipboardData?.getData("text");
        if(window.getSelection()?.toString()) {
            e.preventDefault();
            e.stopPropagation();
            this.#replace_selection(text);
        }
    }

    #copy_selection(e: ClipboardEvent) {
        const selection = this.#get_selection();

        if(!this.#contains_selection()) return;
        if(!selection) return;

        e.preventDefault();
        e.stopPropagation();

        const end = this.#last_parse.char_map.absolute_map[selection.end];
        const start = this.#last_parse.char_map.absolute_map[selection.start];
        let inside = this.#input.value.slice(start, end);

        e.clipboardData?.setData('text', inside);
    }

    #cut_selection(e: ClipboardEvent) {
        const selection = this.#get_selection();

        if(!this.#contains_selection()) return;
        if(!selection) return;

        e.preventDefault();
        e.stopPropagation();

        const end = this.#last_parse.char_map.absolute_map[selection.end];
        const start = this.#last_parse.char_map.absolute_map[selection.start];

        let inside = this.#input.value.slice(start, end);
        let before = this.#input.value.slice(0, start);
        let after = this.#input.value.slice(end);

        this.#input.value = before + after;
        this.#update_markdown_render();
        this.set_cursor(before.length);

        e.clipboardData?.setData('text', inside);
    }

    #select_all(e: KeyboardEvent) {

        if(!this.#contains_selection() && this.#input !== document.activeElement) return;

        e.preventDefault();
        e.stopPropagation();

        // Create a new range covering the whole div
        const range = document.createRange();
        range.selectNodeContents(this.#text_display);
        const last_elem = this.#input.value.length;

        if(last_elem) {
            this.#selection_start = 0;
            this.#selection_end = last_elem;
        } else {
            this.#selection_start = null;
        }

        this.#input.blur();

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
    }

    #select_text(elem: Element, start: number, end: number) {
        const walker = document.createTreeWalker(
            elem,
            NodeFilter.SHOW_TEXT
        );

        let position = 0;
        let startNode = null;
        let startOffset = 0;
        let endNode = null;
        let endOffset = 0;

        let node;

        while (node = walker.nextNode()) {
            if(node.nodeValue === null) return;
            const length = node.nodeValue.length;

            if (startNode === null && start <= position + length) {
                startNode = node;
                startOffset = start - position;
            }

            if (end <= position + length) {
                endNode = node;
                endOffset = end - position;
                break;
            }

            position += length;
        }

        if (!startNode || !endNode) return;

        const selection = window.getSelection();
        if(selection === null) return;
        selection.removeAllRanges();

        selection.setBaseAndExtent(
            startNode,
            startOffset,
            endNode,
            endOffset
        );
        this.#input.blur();
    }
}
