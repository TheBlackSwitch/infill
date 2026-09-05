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
import { cursor_pos_from_point, download_file, touch_only } from './utils';
import { EditorSelection } from './selection';
import Prism from 'prismjs';
export * as YAMP from '@theblackswitch/yamp';

interface history_item {
    input_value: string,
    cursor_pos: number,
    is_character_change: boolean
}

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
        "zoom": true,
        "export": true,
        "import": true        
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
    #place_holder: string;

    #wrapper: HTMLElement;
    #nav: HTMLElement;
    #bott_nav: HTMLElement;
    #bott_nav_left: HTMLElement;
    #bott_nav_right: HTMLElement;
    #editor: HTMLElement;
    #input: HTMLTextAreaElement;
    #text_display: HTMLElement;
    #selection_mask: HTMLElement;
    #slider: HTMLInputElement;
    #toggle_check: HTMLInputElement;

    #history: {undo_states: Array<history_item>, redo_states: Array<history_item>} = {
        "undo_states": [],
        "redo_states": []
    }

    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                         CONSTRUCTOR + HTML GEN                                                                 
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================

    constructor(parent_element: HTMLElement, options: options = {}, width: string = "100%", height: string = "40vh", placeholder = "Enter text here, you can use markdown formatting.") {
        if(!parent_element) throw Error('[Infill]: Failed to instantiate new editor. No parent element provided!');
        this.#parent_element = parent_element;
        this.#place_holder = placeholder;

        this.#options = {};
        for(const [option, value] of Object.entries(default_options)) {
            if(options[option] !== undefined) {
                
                // Yup this is cursed. Instead of complaining, make a pull request that fixes this mess
                if(typeof options[option] === "object") {
                    console.log("OBJECT");
                    this.#options[option] = {};
                    for(const [sub_option, value] of Object.entries(default_options[option])) {
                        if(options[option][sub_option] === undefined) {
                            this.#options[option][sub_option] = default_options[option][sub_option];
                        } else {
                            this.#options[option][sub_option] = options[option][sub_option];
                        }
                    }

                } else {
                    this.#options[option] = options[option];
                }
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

        //this.#parse_worker = new Worker(new URL("./workers/parse.ts", import.meta.url), { type: "module" });

        // -------------------------------
        //  Construct HTML                            
        // -------------------------------

        // ======= WRAPPER =======
        this.#wrapper = document.createElement('div');
        this.#wrapper.classList.add('infill-editor-wrapper');
        this.#parent_element.appendChild(this.#wrapper);
        this.#wrapper.style.width = width;
        this.#wrapper.style.height = height;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (!entry.contentBoxSize) return;
                const contentBoxSize = entry.contentBoxSize[0];
                const width = entry.contentRect.width;
                if(width < 620) {
                    this.#wrapper.style.height = `calc(${height} * 0.7)`;
                } else {
                    this.#wrapper.style.height = height;
                }
            }
        });
        resizeObserver.observe(this.#wrapper);

        // ======= TOP NAV =======
        this.#nav = document.createElement('div');
        this.#nav.classList.add('infill-editor-nav');
        this.#wrapper.appendChild(this.#nav);

        // Header buttons + Code + Block quote
        let button_wrapper = document.createElement('div');
        button_wrapper.classList.add('infill-editor-nav-button-wrapper');
        this.#nav.appendChild(button_wrapper);
        
        let block_1 = document.createElement('div');
        block_1.classList.add('infill-editor-nav-block');
        button_wrapper.appendChild(block_1);

        if(this.#options.nav?.header) this.#gen_btn(block_1, () => this.#insert_text("# ", "", true), "H1", `Heading 1 ${this.#options.keyboard_shortcuts_enabled ? "| CTRL H" : ""}`, 'infill-align-right');
        if(this.#options.nav?.header) this.#gen_btn(block_1, () => this.#insert_text("## ", "", true), "H2", "Heading 2", 'infill-align-right');
        if(this.#options.nav?.header) this.#gen_btn(block_1, () => this.#insert_text("### ", "", true), "H3", "Heading 3");

        if(this.#options.nav?.blockquote) this.#gen_btn(block_1, () => this.#insert_text("> ", "", true), '<i class="infill-icon infill-icon-blockquote"></i>', `Blockquote ${this.#options.keyboard_shortcuts_enabled ? "| CTRL Q" : ""}`);
        if(this.#options.nav?.code_block) this.#gen_btn(block_1, () => this.#insert_text("```", "\n```", true), '<i class="infill-icon infill-icon-codeblock"></i>', `Codeblock  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL E" : ""}`);
        if(this.#options.nav?.code) this.#gen_btn(block_1, () => this.#insert_text("``", "``", false), '<i class="infill-icon infill-icon-code"></i>', `Code  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL T" : ""}`);

        // Bold, italic, strikethrough, highlight, underline, colored
        let sep_1 = document.createElement('div');
        sep_1.classList.add('infill-editor-nav-separator');
        block_1.appendChild(sep_1);

        let block_2 = document.createElement('div');
        block_2.classList.add('infill-editor-nav-block');
        button_wrapper.appendChild(block_2);

        if(this.#options.nav?.list) this.#gen_btn(block_2, () => this.#insert_text("- ", "", true), '<i class="infill-icon infill-icon-unordered-list"></i>', `Unordered list ${this.#options.keyboard_shortcuts_enabled ? "| CTRL L" : ""}`);
        if(this.#options.nav?.link) this.#gen_btn(block_2, () => this.#insert_text("1. ", "", true), '<i class="infill-icon infill-icon-ordered-list"></i>', `Ordered list | ${this.#options.keyboard_shortcuts_enabled ? "| CTRL O" : ""}`);
        if(this.#options.nav?.link) this.#gen_btn(block_2, () => this.#insert_text("[", "]()", false), '<i class="infill-icon infill-icon-link"></i>', `Link ${this.#options.keyboard_shortcuts_enabled ? "| CTRL K" : ""}`);
        if(this.#options.nav?.image) this.#gen_btn(block_2, () => this.#insert_text("![]()", "", false), '<i class="infill-icon infill-icon-image"></i>', `Picture ${this.#options.keyboard_shortcuts_enabled ? "| CTRL P" : ""}`);

        // Lists, links, images
        let sep_2 = document.createElement('div');
        sep_2.classList.add('infill-editor-nav-separator');
        block_2.appendChild(sep_2);

        let block_3 = document.createElement('div');
        block_3.classList.add('infill-editor-nav-block');
        button_wrapper.appendChild(block_3);

        if(this.#options.nav?.bold) this.#gen_btn(block_3, () => this.#insert_text("**", "**", false), '<strong>B</strong>', `Bold Text  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL B" : ""}`);
        if(this.#options.nav?.italic) this.#gen_btn(block_3, () => this.#insert_text("_", "_", false), '<em>I</em>', `Italic Text  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL I" : ""}`);
        if(this.#options.nav?.strikethrough) this.#gen_btn(block_3, () => this.#insert_text("~~", "~~", false), '<s>S</s>', `Strikethrough Text  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL S" : ""}`);
        if(this.#options.nav?.underline) this.#gen_btn(block_3, () => this.#insert_text("==", "==", false), '<u>U</u>', `Underline Text  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL U" : ""}`);
        if(this.#options.nav?.highlight) this.#gen_btn(block_3, () => this.#insert_text("^", "^", false), '<mark>H</mark>', `Marked Text ${this.#options.keyboard_shortcuts_enabled ? "| CTRL M" : ""}`);
        if(this.#options.nav?.coloured) this.#gen_btn(block_3, () => this.#insert_text("[|", "]", false), '<i class="infill-icon infill-icon-coloured"></i>', `Dyed Text ${this.#options.keyboard_shortcuts_enabled ? "| CTRL D" : ""}`);

        // Lists, links, images
        let sep_3 = document.createElement('div');
        sep_3.classList.add('infill-editor-nav-separator', 'infill-end');
        block_3.appendChild(sep_3);

        let sizer = document.createElement('div');
        sizer.classList.add('infill-editor-sizer');
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
        this.#toggle_check.addEventListener('click', () => window.setTimeout(() => this.#click_toggle(), 100));
        this.#toggle_check.addEventListener('pointerdown', () => this.#register_focus());
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
        this.#input.addEventListener("beforeinput", (e) => this.#before_input(e));
        this.#input.addEventListener("input", () => this.#update_markdown_render());
        this.#input.addEventListener('blur', () => this.#update_markdown_render());
        this.#editor.appendChild(this.#input);

        this.#text_display = document.createElement('div');
        this.#text_display.classList.add('infill-editor-display');
        this.#text_display.addEventListener('pointermove', (e) => this.#editor_mouse_move(e));
        this.#text_display.addEventListener('scroll', (e) => this.#editor_scroll(e));

        // Stop mobile losing focus of the text area
        this.#text_display.addEventListener('pointerdown', e => e.preventDefault());

        document.addEventListener('pointerdown', (e) => this.#editor_mouse_down(e));
        document.addEventListener('pointerup', (e) => this.#editor_mouse_up(e));
        document.addEventListener('pointermove', (e) => this.#selection_thumb_move(e));
        document.addEventListener('scroll', () => this.#cancel_hold());
        this.#editor.appendChild(this.#text_display);

        this.#selection_mask = document.createElement('div');
        this.#selection_mask.classList.add('infill-editor-selection-mask');
        this.#editor.appendChild(this.#selection_mask);

        // Events
        document.addEventListener('keydown', (e) => this.#on_key_down(e));
        document.addEventListener('paste', (e: ClipboardEvent) => this.#paste_selection(e));
        document.addEventListener('copy', (e: ClipboardEvent) => this.#copy_selection(e));
        document.addEventListener('cut', (e: ClipboardEvent) => this.#cut_selection(e));
        
        // ======= BOTTOM NAV =======
        this.#bott_nav = document.createElement('div');
        this.#bott_nav.classList.add('infill-editor-bottom-nav');
        this.#wrapper.appendChild(this.#bott_nav);

        // Left aligned
        this.#bott_nav_left = document.createElement('div');
        this.#bott_nav_left.classList.add('infill-editor-bottom-nav-left');
        this.#bott_nav.appendChild(this.#bott_nav_left);

        this.#gen_btn(this.#bott_nav_left, (e: KeyboardEvent) => this.#copy_selection(navigator.clipboard), '<i class="infill-icon infill-icon-copy"></i>', 'Copy | CTRL + C');
        this.#gen_btn(this.#bott_nav_left, (e: KeyboardEvent) => this.#paste_selection(navigator.clipboard), '<i class="infill-icon infill-icon-paste"></i>', 'Paste | CTRL + V');
        this.#gen_btn(this.#bott_nav_left, (e: KeyboardEvent) => this.#cut_selection(navigator.clipboard), '<i class="infill-icon infill-icon-cut"></i>', 'Cut | CTRL + X');

        let sep_4 = document.createElement('div');
        sep_4.classList.add('infill-editor-nav-separator');
        this.#bott_nav_left.appendChild(sep_4);

        this.#gen_btn(this.#bott_nav_left, (e: KeyboardEvent) => this.set_cursor(Math.max(0, this.#input.selectionStart - 1)), '<i class="infill-icon infill-icon-arrow-left"></i>', 'Move cursor left | Left Arrow');
        this.#gen_btn(this.#bott_nav_left, (e: KeyboardEvent) => this.set_cursor(Math.min(this.#input.value.length, this.#input.selectionStart + 1)), '<i class="infill-icon infill-icon-arrow-right"></i>', 'Move cursor right | Right Arrow');


        // Right aligned
        this.#bott_nav_right = document.createElement('div');
        this.#bott_nav_right.classList.add('infill-editor-bottom-nav-right');
        this.#bott_nav.appendChild(this.#bott_nav_right);

        this.#gen_btn(this.#bott_nav_right, (e: KeyboardEvent) => this.#undo(e, true), '<i class="infill-icon infill-icon-undo"></i>', 'Undo');
        this.#gen_btn(this.#bott_nav_right, (e: KeyboardEvent) => this.#redo(e, true), '<i class="infill-icon infill-icon-redo"></i>', 'Redo');

        let sep_5 = document.createElement('div');
        sep_5.classList.add('infill-editor-nav-separator');
        this.#bott_nav_right.appendChild(sep_5);

        this.#gen_btn(this.#bott_nav_right, () => this.#export_file(), '<i class="infill-icon infill-icon-export"></i>', 'Export File');
        this.#gen_btn(this.#bott_nav_right, () => this.#import_file(), '<i class="infill-icon infill-icon-import"></i>', 'Open File');

        this.#register_history_state();

        this.#update_markdown_render();
    }

    // -------------------------------
    //  Generate the html for a btn                            
    // -------------------------------

    #gen_btn(parent_element: Element, on_click: Function, inner: string, tooltip: string, ...css_classes: Array<string>) {
        let btn = document.createElement('div');
        btn.innerHTML = inner;
        btn.setAttribute('data-infill-tooltip', tooltip);
        btn.classList.add('infill-nav-btn', 'infill-tooltip', ...css_classes);

        // Stop mobile losing focus of the text area
        btn.addEventListener('pointerdown', e => {
            e.preventDefault();
        });

        parent_element.appendChild(btn);
        btn.addEventListener('click', (e) => {
            on_click(e);
        });
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
        
        // Split the text into parts depending on the cursor / selection
        let select_start: number | undefined = 0;
        let select_end: number | undefined = 0;

        if(this.#selection !== null && this.#selection.visible) {
            select_start = this.#map_cursor_pos(this.#selection.lo);
            select_end = this.#map_cursor_pos(this.#selection.hi);

            if(select_end === undefined || select_start === undefined) return;

            before = this.#input.value.slice(0, select_start);
            inside = this.#input.value.slice(select_start, select_end);
            after = this.#input.value.slice(select_end);
            
        } else {
            const cursor_pos = this.#input.selectionStart;
            before = this.#input.value.slice(0, cursor_pos);
            after = this.#input.value.slice(cursor_pos);
        }

        console.log("TEST", before, after);

        // Remove the styling instead of duplicating it
        const should_remove_start = before.endsWith(before_cursor) || inside.startsWith(before_cursor);
        const should_remove_end = after.startsWith(after_cursor) || inside.endsWith(after_cursor);

        // Start
        if(should_remove_start) {
            if(before.endsWith(before_cursor)) {
                before = before.slice(0, before.length - before_cursor.length);
            } else {
                inside = inside.slice(before_cursor.length);
            }    

        // Otherwise we just add the styling like usual
        } else {
            if(force_linebreak && before[before.length - 1] !== "\n" && before.length > 0) {
                before += "\n";
            }
            before += before_cursor;
        }
        
        // End
        if(should_remove_end) {
            if(after.startsWith(after_cursor)) {
                after = after.slice(after_cursor.length);
            } else {
                inside = inside.slice(0, inside.length - after_cursor.length);
            }
                    
        // Otherwise we just add the styling like usual
        } else {
            after = after_cursor + after;
        }

        this.#input.value = before + inside + after;

        // Only move the cursor to the end of everything when selecting
        const end_offs = (should_remove_end || this.#selection === null || !this.#selection.visible ? 0 : after_cursor.length);

        if(!this.#selection?.is_mobile) window.setTimeout(() => this.set_cursor(before.length + inside.length + end_offs), 1);
        if(force_linebreak) this.#selection?.discard();

        this.#update_markdown_render();

        // Update the selection according to the inserted text and the updated markdown render
        if(this.#selection !== null && this.#selection.visible) {
            const new_start = this.#inverse_map_cursor_pos(before.length);
            const new_end = this.#inverse_map_cursor_pos(before.length + inside.length + (should_remove_end ? 0 : after_cursor.length));
            this.#selection.set_start(new_start);
            this.#selection.set_end(new_end);
            this.#selection.update_render();
        }

        this.#register_history_state();
    }

    // -------------------------------
    //  Slider                            
    // -------------------------------

    #slider_change() {
        let scale = 1.0;

        const slider_value = Number(this.#slider.value);

        // Use an exponential function to convert the slider into a zoom
        scale = 0.5 * Math.pow(4, slider_value / 100);

        this.#text_display.style.fontSize = `${scale * 16}px`;
        this.#input.style.fontSize = `${scale * 16}px`;

        this.#selection?.update_render();
    }

    // -------------------------------
    //  Toggle button                            
    // -------------------------------

    #editor_had_focus: boolean = false;

    // Register if the editor is focused just before it will lose focus due to clicking on the toggle
    #register_focus() {
        this.#editor_had_focus = document.activeElement === this.#input;
    }

    #click_toggle() {
        const enabled = this.#toggle_check.checked;

        console.log('CHECK');

        if(enabled) {
            this.#wrapper.classList.remove('infill-parsing-disabled');
            window.setTimeout(() => this.set_cursor(this.#input.selectionStart, !this.#editor_had_focus), 10);
            this.#update_markdown_render();
        } else {
            this.#wrapper.classList.add('infill-parsing-disabled');
            if(this.#editor_had_focus) this.#input.focus();
            if(this.#selection !== null) this.#selection.discard();
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

        if(markdown_input.length === 0 && document.activeElement !== this.#input) {
            markdown_input = `<span class="infill-placeholder">${this.#place_holder}</span>`;
        }

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
        
        this.#text_display.innerHTML = text;

        Prism.highlightAllUnder(this.#wrapper);

        // Replace the cursor character with an actual element
        this.#text_display.innerHTML = this.#text_display.innerHTML.replaceAll('\uE003','<i class="infill-editor-cursor"></i>');

        document.getElementsByClassName('infill-editor-cursor')[0]?.scrollIntoView({
            "behavior": "instant",
            "block": "nearest",
            "inline": "center"
        });

        
    }

    #editor_scroll(e: Event) {
        if(this.#selection !== null && this.#selection.visible) this.#selection.update_render();
        console.log('HELLO');
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

        } else if(key === "k" && is_shortcut) {
            this.#insert_text("[", "]()", false);

        } else if(key === "p" && is_shortcut) {
            this.#insert_text("![]()", "", false);
        }

        // Prevent default when using a shortcut
        if(is_shortcut && 'hqetbisumdlokp'.includes(key)) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        // ======= SELECTIONS =======

        // Replace a selection
        if(e.key.length === 1 && !e.getModifierState('Control') && !e.getModifierState('Alt') && this.#selection !== null && this.#selection.visible) {
            e.preventDefault();
            e.stopPropagation();
            this.#replace_selection(e.key);
            this.#register_history_state();
            return;
        }

        // Remove selection
        if((e.key === "Delete" || e.key === "Backspace") && this.#selection !== null && this.#selection.visible) {
            e.preventDefault();
            e.stopPropagation();
            this.#replace_selection('');
            this.#register_history_state();
            return;
        }

        // Select all
        if(
            e.key === "a" && e.getModifierState('Control') && !(e.getModifierState('Alt') || e.getModifierState('Shift')) && 
            this.#wrapper.contains(document.activeElement)
        ) {
            this.#select_all(e);
            return;
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
        
        // ======= Undo / Redo history =======
        if(e.key === "z" && e.getModifierState('Control') && !e.getModifierState('Alt')) this.#undo(e);
        if(e.key === "y" && e.getModifierState('Control') && !e.getModifierState('Alt')) this.#redo(e);

        if(e.key === "Delete" || e.key === "Backspace") {
            this.#register_history_state();
        }

    }
    
    #before_input(e: InputEvent) {
        const key = e.data
        if(key?.length === 1) {
            if(" -\n".includes(key)) {
                window.setTimeout(() => this.#register_history_state(true, true), 10);
            } else {
                window.setTimeout(() => this.#register_history_state(true), 10);
            }
        }

        if(key === null) {
            window.setTimeout(() => this.#register_history_state(true, true), 10);
        }
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
    #mouse_hold: boolean = false;
    #hold_timeout: number | null = null;
    #last_click: number = 0;
    #last_click_pos: number | undefined = 0;

    // -------------------------------
    //  Mouse down                            
    // -------------------------------

    #editor_mouse_down(e: PointerEvent) {
        if(e.target === null || !(e.target instanceof Node)) return;
        if(!this.#toggle_check.checked) return;

        const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;

        // Detect double clicking
        if(this.#last_click + 300 > Date.now() && this.#last_click_pos !== undefined && cursor === this.#last_click_pos) {
            if(e.pointerType === "mouse") this.#select_word();
            this.#last_click = Date.now();
            return;
        }
        this.#last_click = Date.now();
        this.#last_click_pos = cursor;

        this.#mouse_hold = false;

        // Ignore clicking on any of the selection thumbs (for mobile only)
        if(this.#selection_mask.contains(e.target)) {
            return;
        
        // Click on the editor
        } else if(this.#editor.contains(e.target)) {
            this.#mouse_down = true;
            this.#anchor_pos = [e.clientX, e.clientY];

            // discard the old selection
            this.#selection?.discard();

            if(cursor === undefined) return this.#selection = null;
            this.#target_line_offs = null; // Reset the offset (used for selecting up and down)

            // Register a new selection
            const mapped_pos = this.#map_cursor_pos(cursor);
            if(mapped_pos === undefined) return;
            this.#selection_anchor = mapped_pos;
            this.#selection = new EditorSelection(this.#text_display, this.#selection_mask, cursor, cursor);

            // Detect holding pointer down (for mobile only)
            if(e.pointerType !== "mouse") this.#hold_timeout = window.setTimeout(() => {
                if(!this.#mouse_down) return;
                this.#mouse_hold = true;
                this.#mobile_selection(mapped_pos);
                e.preventDefault();
            }, 800);

        // Discard the selection when we click on anything other than the nav (and editor)
        } else if(!this.#nav.contains(e.target) && !this.#bott_nav.contains(e.target)) {
            this.#selection?.discard();
        }
    }

    #cancel_hold() {
        if(this.#hold_timeout === null) return;
        window.clearTimeout(this.#hold_timeout);
        this.#hold_timeout = null;
    }

    // -------------------------------
    //  Mouse move                            
    // -------------------------------

    #editor_mouse_move(e: PointerEvent) {
        if(!this.#toggle_check.checked) return;

        // Update the selection
        if(this.#mouse_down && e.pointerType === "mouse" && this.#input.value.length > 0 /* Make sure we can't select the placeholder */) {
            const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;
            if(cursor !== undefined) {
                const mapped = this.#map_cursor_pos(cursor);
                if(mapped !== undefined) this.set_cursor(mapped)
                this.#selection?.set_end(cursor);
            }
        }

        // Detect if the mouse should start selecting by calculating the position from the anchor
        if(this.#mouse_down && (this.#selection === null || !this.#selection.visible)) {
            let start_x = this.#anchor_pos[0];
            let start_y = this.#anchor_pos[1];

            if(start_x === undefined || start_y === undefined) return;

            let dist = (start_x - e.clientX)**2 + (start_y - e.clientY)**2;
            if(dist >= 64) {
                if(e.pointerType === "mouse" && this.#input.value.length > 0 /* Make sure we can't select the placeholder */) {
                    this.#selection?.apply();
                    this.#target_line_offs = null;
                }

                // Clear any possible hold when we started selecting
                if(this.#hold_timeout !== null) {
                    window.clearInterval(this.#hold_timeout);
                    this.#hold_timeout = null;
                }
            }
        }
    }

    // -------------------------------
    //  Mouse Up                            
    // -------------------------------

    #editor_mouse_up(e: PointerEvent) {
        if(!this.#toggle_check.checked) return;
        this.#selection_thumb_up(e);

        if(this.#hold_timeout !== null) {
            window.clearInterval(this.#hold_timeout);
            this.#hold_timeout = null;
        }

        if(this.#mouse_hold) {
            e.preventDefault();
            this.#mouse_down = false;
            return;
        }

        if(this.#mouse_down) {
            const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;
            if(cursor !== undefined && this.#input.value.length > 0 /* Make sure we can't select the placeholder */) this.#selection?.set_end(cursor);

            // Always move the position
            if(cursor !== undefined) {
                const mapped_pos = this.#map_cursor_pos(cursor);
                if(mapped_pos !== undefined) window.setTimeout(() => this.set_cursor(mapped_pos), 10);
            } else {
                window.setTimeout(() => this.set_cursor(this.#input.value.length), 10);
            }
            this.#update_markdown_render();
        }
        this.#mouse_down = false;
    }

    // -------------------------------
    //  Create mobile selection                            
    // -------------------------------

    #mobile_selection(cursor: number) {
        this.#input.blur();

        const word_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        let start = cursor;
        while(word_chars.includes(this.#input.value.charAt(start - 1)) && start > 0) {
            start--;
        }

        let end = cursor;
        while(word_chars.includes(this.#input.value.charAt(end)) && end < this.#input.value.length) {
            end++;
        }

        const mapped_start = this.#inverse_map_cursor_pos(start);
        const mapped_end = this.#inverse_map_cursor_pos(end);

        this.#selection?.discard();
        this.#selection = new EditorSelection(
            this.#text_display, 
            this.#selection_mask, 
            mapped_start, 
            mapped_end, 
            true, 
            (e: PointerEvent, type: "end" | "start") => this.#selection_thumb_down(e, type)
        );
        this.#selection.apply();
        window.setTimeout(() => document.getSelection()?.removeAllRanges(), 10);
    }

    // -------------------------------
    //  Adjust mobile selection                            
    // -------------------------------

    #thumb_down: boolean = false;
    #selected_thumb: "start" | "end" = "end";

    #selection_thumb_down(e: PointerEvent, type: "start" | "end") {
        this.#selected_thumb = type;
        this.#thumb_down = true;
        this.#mouse_hold = true;
        this.#editor.classList.add('infill-selection-busy');
    }

    #selection_thumb_up(e: PointerEvent) {
        this.#thumb_down = false;
        this.#editor.classList.remove('infill-selection-busy');
    }

    // Adjust selection
    #selection_thumb_move(e: PointerEvent) {
        if(this.#thumb_down) {
            const cursor = cursor_pos_from_point(this.#text_display, e.clientX, e.clientY)?.global;

            if(cursor !== undefined) {
                if(this.#selected_thumb === "start") {
                    this.#selection?.set_start(cursor);
                } else {
                    this.#selection?.set_end(cursor);
                }
            } else {
                if(this.#selected_thumb === "start") {
                    this.#selection?.set_start(this.#last_parse.char_map.absolute_map.length);
                } else {
                    this.#selection?.set_end(this.#last_parse.char_map.absolute_map.length);
                }
            }
            this.#update_markdown_render();
        }
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

    #copy_selection(e: ClipboardEvent | Clipboard) {
        if(!this.#toggle_check.checked) return;
        if(this.#selection !== null && this.#selection.visible) {
            if(e instanceof ClipboardEvent) {
                e.preventDefault();
                e.stopPropagation();
            }

            const start = this.#map_cursor_pos(this.#selection.lo);
            const end = this.#map_cursor_pos(this.#selection.hi);

            const selected = this.#input.value.slice(start, end);

            if(e instanceof ClipboardEvent) e.clipboardData?.setData('text', selected);
            if(e instanceof Clipboard) e.writeText(selected);
        }
    }

    // -------------------------------
    //  Paste                            
    // -------------------------------

    async #paste_selection(e: ClipboardEvent | Clipboard) {
        window.setTimeout(() => this.#register_history_state(), 10);
        if(!this.#toggle_check.checked) return;
        if(this.#selection !== null && this.#selection.visible) {
            if(e instanceof ClipboardEvent) {
                e.preventDefault();
                e.stopPropagation();
            }

            const replacement = e instanceof ClipboardEvent ? e.clipboardData?.getData('text') : await e.readText();

            if(replacement === undefined) return;

            this.#replace_selection(replacement);
        } else if (e instanceof Clipboard) {
            this.#insert_text(await e.readText(), "");
        }
    }

    // -------------------------------
    //  Cut                            
    // -------------------------------

    #cut_selection(e: ClipboardEvent | Clipboard) {
        window.setTimeout(() => this.#register_history_state(), 10);
        if(!this.#toggle_check.checked) return;
        if(this.#selection !== null && this.#selection.visible) {
            if(e instanceof ClipboardEvent) {
                e.preventDefault();
                e.stopPropagation();
            }

            const inside = this.#replace_selection("");
            if(inside === null) return;

            if(e instanceof ClipboardEvent) e.clipboardData?.setData('text', inside);
            if(e instanceof Clipboard) e.writeText(inside);
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
    //  Select word                            
    // -------------------------------

    #select_word() {
        if(this.#selection !== null && this.#selection?.visible) return;

        const word_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const cursor = this.#input.selectionStart;


        let start = cursor;
        while(word_chars.includes(this.#input.value.charAt(start - 1)) && start > 0) {
            start--;
        }

        let end = cursor;
        while(word_chars.includes(this.#input.value.charAt(end)) && end < this.#input.value.length) {
            end++;
        }

        const mapped_start = this.#inverse_map_cursor_pos(start);
        const mapped_end = this.#inverse_map_cursor_pos(end);

        this.#selection?.discard();
        this.#selection = new EditorSelection(this.#text_display, this.#selection_mask, mapped_start, mapped_end);

        this.#selection_anchor = Math.min(start, end);
        this.set_cursor(Math.max(start, end));

        this.#selection.apply();
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

    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                         UNDO / REDO HISTORY                                                                       
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================

    #register_history_state(is_character_change: boolean = false, force_new_state: boolean = false) {
        const item: history_item = {
            "input_value": this.#input.value,
            "cursor_pos": this.#input.selectionStart,
            "is_character_change": is_character_change 
        }

        // Skip this state if the input string is exactly the same as the previous one
        if(item.input_value === this.#history.undo_states[this.#history.undo_states.length - 1]?.input_value) {
            return;
        }

        // Character changes can replace the previous history state if that was a character change so check for that
        if(is_character_change && !force_new_state && this.#history.undo_states[this.#history.undo_states.length - 1]?.is_character_change) {
            this.#history.undo_states[this.#history.undo_states.length - 1] = item;

        // Otherwise just create a new one
        } else {
            this.#history.undo_states.push(item);
            if(this.#history.undo_states.length > 100) this.#history.undo_states.splice(0, 1);
        }

        this.#history.redo_states = [];
    }

    #undo(e: KeyboardEvent, force_enabled: boolean = false) {
        if(!this.#toggle_check.checked && !force_enabled) return;
        e.preventDefault();
        e.stopPropagation();
        if(this.#selection !== null) this.#selection.discard();

        if(this.#history.undo_states.length < 2) return;

        const states = this.#history.undo_states;
        const prev_state = this.#history.undo_states.pop();

        if(prev_state !== undefined) this.#history.redo_states.push(prev_state);

        // Restore the last state
        const new_state = states[states.length - 1];
        if(new_state !== undefined) this.#input.value = new_state.input_value;
        if(new_state !== undefined) this.set_cursor(new_state.cursor_pos);
    }

    #redo(e: KeyboardEvent, force_enabled: boolean = false) {
        if(!this.#toggle_check.checked && !force_enabled) return;
        e.preventDefault();
        e.stopPropagation();

        if(this.#history.redo_states.length < 1) return;

        const states = this.#history.redo_states;
        const last_state = this.#history.redo_states.pop();

        if(last_state === undefined) return;
        
        this.#history.undo_states.push(last_state);

        this.#input.value = last_state.input_value;
        this.set_cursor(last_state.cursor_pos);
    }

    // ==========================================================================================================================================
    // ------------------------------------------------------------------------------------------------------------------------------------------
    //                                                      USER INTERACTIVE METHODS                                                                     
    // ------------------------------------------------------------------------------------------------------------------------------------------
    // ==========================================================================================================================================
    // These methods are designed to be used by the user of this library

    // -------------------------------
    //  Getters                            
    // -------------------------------

    get_markdown() {
        return this.#input.value;
    }

    get_html() {
        return this.#last_parse.html;
    }

    get_button_state() {
        return {
            "zoom_slider": this.#slider.value,
            "markdown_enabled": this.#toggle_check.checked
        }
    }

    get_cursor_pos() {
        return this.#input.selectionStart;
    }

    // -------------------------------
    //  Setters                            
    // -------------------------------

    set_button_state(state: {zoom_slider: string, markdown_enabled: boolean}) {
        this.#slider.value = state.zoom_slider;
        this.#slider_change();

        this.#toggle_check.checked = state.markdown_enabled;
        this.#click_toggle();
    }
    
    set_markdown(value: string) {
        this.#input.value = value;
        this.#update_markdown_render();
    }
}