import type { parsers } from "@theblackswitch/yamp"

// -------------------------------
//  Options                            
// -------------------------------

export interface options {
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


// -------------------------------
//  YAMP problems                            
// -------------------------------

export interface absolute_map {
    html: string,
    char_map: {
        width_map: Array<Array<number>>,
        absolute_map: Array<number>,
        line_map: Array<Array<number>>,
        line_idx_map: Array<number>
    }
}