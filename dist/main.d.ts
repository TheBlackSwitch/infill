import { parsers } from '@theblackswitch/yamp';

declare global {
    interface Navigator {
        msSaveOrOpenBlob?: (blob: Blob, defaultName?: string) => boolean;
    }
}

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
        zoom?: boolean,
        export?: boolean,
        import?: boolean  
    },
    enabled_features?: parsers,
    keyboard_shortcuts_enabled?: boolean,

    [key: string]: any;
}

declare const default_options: options;
declare class Editor {
    #private;
    constructor(parent_element: HTMLElement, width?: string, height?: string, options?: options);
    set_cursor(position: number, no_focus?: boolean, no_update?: boolean): void;
    get markdown(): string;
    get html(): string;
    get_button_state(): {
        zoom_slider: string;
        markdown_enabled: boolean;
    };
    get_cursor_pos(): number;
    set_button_state(state: {
        zoom_slider: string;
        markdown_enabled: boolean;
    }): void;
    set markdown(value: string);
}

export { Editor, default_options };
