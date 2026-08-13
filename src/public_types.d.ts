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

    [key: string]: any;
}