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
        YAMP.UnderscoreEmphasis,
        YAMP.Highlight,
        YAMP.Underlined,
        YAMP.HorizontalRule,
        YAMP.Image,
        YAMP.Link,
        YAMP.List,
        YAMP.Table,
        YAMP.EscapeIncompleteHtml
    ]
}


export class Editor {
    #parent_element: HTMLElement;
    #options: options;

    #wrapper: HTMLElement;
    #nav: HTMLElement;
    #editor: HTMLElement;
    #input: HTMLTextAreaElement;
    #text_display: HTMLElement;

    #is_parsing: boolean = false;

    #parse_worker: Worker;

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
        
        this.#gen_btn(block_1, () => {}, "H1", "Heading 1 | CTRL + H", 'infill-align-right');
        this.#gen_btn(block_1, () => {}, "H2", "Heading 2", 'infill-align-right');
        this.#gen_btn(block_1, () => {}, "H3", "Heading 3");

        this.#gen_btn(block_1, () => {}, '<i class="infill-icon infill-icon-blockquote"></i>', 'Blockquote | CTRL Q');
        this.#gen_btn(block_1, () => {}, '<i class="infill-icon infill-icon-codeblock"></i>', 'Codeblock');
        this.#gen_btn(block_1, () => {}, '<i class="infill-icon infill-icon-code"></i>', 'Code | CTRL T');

        // Bold, italic, strikethrough, highlight, underline, colored
        let block_2 = document.createElement('div');
        block_2.classList.add('infill-editor-nav-block');
        this.#nav.appendChild(block_2);

        this.#gen_btn(block_2, () => {}, '<strong>B</strong>', 'Bold Text | CTRL B');
        this.#gen_btn(block_2, () => {}, '<em>I</em>', 'Italic Text | CTRL I');
        this.#gen_btn(block_2, () => {}, '<s>S</s>', 'Strikethrough Text | CTRL S');
        this.#gen_btn(block_2, () => {}, '<u>U</u>', 'Underline Text | CTRL U');
        this.#gen_btn(block_2, () => {}, '<mark>H</mark>', 'Highlighted Text | CTRL H');
        this.#gen_btn(block_2, () => {}, '<i class="infill-icon infill-icon-coloured"></i>', 'Colored Text');

        // Lists, links, images
        let block_3 = document.createElement('div');
        block_3.classList.add('infill-editor-nav-block');
        this.#nav.appendChild(block_3);

        this.#gen_btn(block_3, () => {}, '<i class="infill-icon infill-icon-unordered-list"></i>', 'Unordered list | CTRL L');
        this.#gen_btn(block_3, () => {}, '<i class="infill-icon infill-icon-ordered-list"></i>', 'Ordered list | CTRL O');
        this.#gen_btn(block_3, () => {}, '<i class="infill-icon infill-icon-link"></i>', 'Refrence Link | CTRL R');
        this.#gen_btn(block_3, () => {}, '<i class="infill-icon infill-icon-image"></i>', 'Image | CTRL M');

        let sizer = document.createElement('div');
        this.#nav.appendChild(sizer);

        // Zoom slider
        let slider_wrapper = document.createElement('div');
        slider_wrapper.classList.add('infill-slider-wrapper');

        let slider = document.createElement('input');
        slider.setAttribute('type', 'range');
        slider.setAttribute('value', '50');
        slider.setAttribute('value', '50');
        slider.setAttribute('step', '5');
        slider.setAttribute('min', '0');
        slider.setAttribute('max', '100');
        slider.classList.add('infill-slider');
        slider_wrapper.appendChild(slider);

        this.#nav.appendChild(slider_wrapper);

        // Markdown toggle
        let toggle_wrapper = document.createElement('div');
        toggle_wrapper.classList.add('infill-toggle-wrapper');
        this.#nav.appendChild(toggle_wrapper);

        let toggle_checkbox = document.createElement('input');
        toggle_checkbox.setAttribute('type', 'checkbox');
        toggle_checkbox.setAttribute('checked', '');
        toggle_checkbox.classList.add('infill-toggle-check');
        toggle_wrapper.appendChild(toggle_checkbox);

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
        this.#text_display.addEventListener('pointerleave', (e) => this.#editor_mouse_down(e));
        this.#text_display.addEventListener('pointerup', (e) => this.#editor_mouse_up(e));
        this.#editor.appendChild(this.#text_display);
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

    // -------------------------------
    //  Zoom slider stuff                            
    // -------------------------------

    #slider_mouse_down(e: Event) {

    }

    #slider_mouse_move(e: Event) {

    }

    #slider_mouse_up(e: Event) {

    }

    // -------------------------------
    //  Editor cursor stuff                           
    // -------------------------------

    #selection_start: Array<number> = [0, 0];
    #selection_end: Array<number> = [0, 0];
    #mouse_down: boolean = false;
    #has_selection: boolean = false;

    #editor_mouse_down(e: MouseEvent) {
        this.#mouse_down = true;
        this.#has_selection = false;
        this.#selection_start = [e.clientX, e.clientY];
    }

    #editor_mouse_leave(e: Event) {
        this.#mouse_down = false;
    }

    #editor_mouse_move(e: MouseEvent) {
        if(this.#mouse_down && !this.#has_selection && this.#selection_start) {
            let start_x = this.#selection_start[0];
            let start_y = this.#selection_start[1];

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
            this.#selection_end = [e.clientX, e.clientY];
            if(!this.#has_selection) {

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

    set_cursor(position: number) {
        this.#text_display.querySelector('.infill-editor-cursor')?.classList.add('infill-cursor-force-mark');
        window.setTimeout(() => this.#text_display.querySelector('.infill-editor-cursor')?.classList.remove('infill-cursor-force-mark'), 500);
        this.#input.focus();
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
        this.#is_parsing = true;
        let markdown_input = this.#input.value;


        // Insert a cursor
        const cursor_pos = this.#input.selectionStart;
        markdown_input = markdown_input.slice(0, cursor_pos) + '\uE003' + markdown_input.slice(cursor_pos);

        // Parse markdown
        console.log(markdown_input);

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
    }
}