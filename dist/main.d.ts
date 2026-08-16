import { parsers } from '@theblackswitch/yamp';

// -------------------------------
//  Options                            
// -------------------------------

interface options {
    nav?: {
        header?: boolean,
        bold?: boolean,
        italic?: boolean,
        strikethrough?: boolean,
        highlight?: boolean,
        underline?: boolean,
        code?: boolean,
        code_block?: boolean,
        list?: boolean,
        blockquote?: boolean,
        link?: boolean,
        image?: boolean,
        coloured?: boolean,
        toggle_markdown_parsing?: boolean,
        zoom?: boolean        
    },
    enabled_features?: parsers,
    keyboard_shortcuts_enabled?: boolean,

    [key: string]: any;
}

declare const default_options: options;
declare class Editor {
    #private;
    constructor(parent_element: HTMLElement, width?: string, height?: string, options?: options);
    set_cursor(position: number, no_focus?: boolean): void;
}

export { Editor, default_options };
