// ==========================================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------------------
//                                                          IMPORTS                                                                       
// ------------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================================================================================================



// ==========================================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------------------
//                                                          MAIN STUFF                                                                       
// ------------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================================================================================================

export class EditorSelection {
    #start: number = 0;
    #end: number = 0;
    #parent_element: HTMLElement;
    #selection_mask: HTMLElement;
    #visible: boolean = false;
    #mobile_mode: boolean = false;
    #on_thumb_down: Function;
    
    #elems: Array<HTMLDivElement> = [];

    constructor(parent: HTMLElement, selection_mask: HTMLElement, start: number, end: number, mobile_mode: boolean = false, on_thumb_down: Function = () => {}) {
        this.#start = start;
        this.#end = end;
        this.#parent_element = parent;
        this.#selection_mask = selection_mask;
        this.#mobile_mode = mobile_mode;
        this.#on_thumb_down = on_thumb_down;
    }

    // -------------------------------
    //  Visiblity                            
    // -------------------------------

    apply() {
        this.#visible = true;
        this.update_render();
    }

    discard() {
        this.#visible = false;
        this.update_render();
    }
    
    // -------------------------------
    //  Range handeling                            
    // -------------------------------

    set_start(position: number) {
        this.#start = position;
        this.update_render();
    }

    set_end(position: number) {
        this.#end = position;
        this.update_render();
    }

    // -------------------------------
    //  Getters                            
    // -------------------------------

    // Lower and higher selection bounds
    get lo() {
        return Math.min(this.#start, this.#end);
    }

    get hi() {
        return Math.max(this.#start, this.#end);
    }

    get end() {
        return this.#end;
    }

    get start() {
        return this.#start;
    }

    get visible() {
        return this.#visible;
    }

    get length() {
        return Math.abs(this.#start - this.#end);
    }

    get is_mobile() {
        return this.#mobile_mode;
    }

    // -------------------------------
    //  Rendering                            
    // -------------------------------

    update_render() {
        for(const elem of this.#elems) {
            elem.remove();
        }
        if(this.#visible) {

            const start_node = this.#cursor_pos_to_node(Math.min(this.#start, this.#end));
            const end_node = this.#cursor_pos_to_node(Math.max(this.#start, this.#end));

            if(start_node === null || end_node === null) return;

            const range = document.createRange();
            console.log(start_node, end_node);

            range.setStart(start_node.node, start_node.offset);
            range.setEnd(end_node.node, end_node.offset);

            const parent_rect = this.#parent_element.getBoundingClientRect();

            const rects = range.getClientRects();

            for(const rect of rects) {
                const elem = document.createElement('div');
                elem.classList.add('infill-selection');

                // Calc the offset within the parent
                elem.style.left = `${rect.left - parent_rect.left}px`;
                elem.style.top = `${rect.top - parent_rect.top}px`;

                elem.style.width = `${rect.width}px`;
                elem.style.height = `${rect.height}px`;

                this.#selection_mask.appendChild(elem);

                this.#elems.push(elem);
            }

            if(this.#mobile_mode && rects.length > 0) {
                const start = rects[0];
                const end = rects[rects.length - 1];

                if(end === undefined || start === undefined) return;

                const select_start_thumb = document.createElement('div');
                select_start_thumb.classList.add('infill-editor-select-thumb', 'infill-start');
                select_start_thumb.style.left = `${start.left - parent_rect.left - start.height * 1.5}px`;
                select_start_thumb.style.top = `${start.top - parent_rect.top - 10}px`;
                select_start_thumb.style.height = `${start.height * 1.5}px`;
                select_start_thumb.style.width = `${start.height * 1.5}px`;
                select_start_thumb.addEventListener('pointerdown', (e) => this.#on_thumb_down(e, "start"));


                const select_end_thumb = document.createElement('div');
                select_end_thumb.classList.add('infill-editor-select-thumb', 'infill-end');
                select_end_thumb.style.left = `${end.right - parent_rect.left - 20}px`;
                select_end_thumb.style.top = `${end.top - parent_rect.top - 10}px`;
                select_end_thumb.style.height = `${end.height * 1.5}px`;
                select_end_thumb.style.width = `${end.height * 1.5}px`;
                select_end_thumb.addEventListener('pointerdown', (e) => this.#on_thumb_down(e, "end"));

                this.#selection_mask.appendChild(select_start_thumb);
                this.#selection_mask.appendChild(select_end_thumb);
                this.#elems.push(select_start_thumb);
                this.#elems.push(select_end_thumb);
            }
        }
    }

    // -------------------------------
    //  Utilities                            
    // -------------------------------

    // Get the node corresponding to the character position provided
    #cursor_pos_to_node(position: number) {
        if(!this.#parent_element) return null;

        const walker = document.createTreeWalker(this.#parent_element, NodeFilter.SHOW_TEXT);

        let offset = 0;

        // Go through all text nodes <p></p> <strong></strong> etc. and calculate the offset until we've found the correct node.
        while(true) { 
            let node = walker.nextNode();
            if(!node) return null;
            
            if(node.nodeType === Node.TEXT_NODE) {
                const len = node.nodeValue?.length;

                if(len === undefined) continue;

                if(offset + len >= position) {
                    return {
                        "node": node,
                        "offset": position - offset // Calc the local offset inside this node
                    }
                }
                offset += len;
            }
            
        }
    }

}