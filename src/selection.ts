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
    
    #elems: Array<HTMLDivElement> = [];

    constructor(parent: HTMLElement, selection_mask: HTMLElement, start: number, end: number) {
        this.#start = start;
        this.#end = end;
        this.#parent_element = parent;
        this.#selection_mask = selection_mask;
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

            for(const rect of range.getClientRects()) {
                const elem = document.createElement('div');

                // Calc the offset within the parent
                elem.style.left = `${rect.left - parent_rect.left}px`;
                elem.style.top = `${rect.top - parent_rect.top}px`;

                elem.style.width = `${rect.width}px`;
                elem.style.height = `${rect.height}px`;

                this.#selection_mask.appendChild(elem);

                this.#elems.push(elem);
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