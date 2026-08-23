// Some small helper functions
// ==========================================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------------------
//                                                         IMPORTS                                                                       
// ------------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================================================================================================

// ==========================================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------------------
//                                                         MAIN STUFF                                                                       
// ------------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================================================================================================

// -------------------------------
//  Strings                            
// -------------------------------

// escapes ALL special characters in a string
export function escape_string(input: string) {
    // Using a neat little js trick I found
    return [...input].map(char => {
        const code = char.codePointAt(0);

        if(code === undefined) return char;

        if (
            (code >= 48 && code <= 57) ||   // 0-9
            (code >= 65 && code <= 90) ||   // A-Z
            (code >= 97 && code <= 122)     // a-z
        ) {
            return char;
        }

        return `&#${code};`;
    }).join("");
}

// -------------------------------
//  Save a file                            
// -------------------------------

// More typescript bullshit
declare global {
    interface Navigator {
        msSaveOrOpenBlob?: (
            blob: Blob,
            defaultName?: string
        ) => boolean;
    }
}

// Download a file and ask the user to save it somewhere
// Credit: 
export function download_file(data: string, filename: string, type: string) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

// -------------------------------
//  Cursor positions                      
// -------------------------------

// Get the cursor position inside an element depending on the location at which we clicked
export function cursor_pos_from_point(root_element: HTMLElement, x: number, y: number) {
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

    // Create a walker to go through all text nodes
    const walker = document.createTreeWalker(root_element, NodeFilter.SHOW_ALL); 

    let offset = 0;

    // Go through all text nodes <p></p> <strong></strong> etc. and calculate the global offset until we've found the correct node.
    while(true) { 
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