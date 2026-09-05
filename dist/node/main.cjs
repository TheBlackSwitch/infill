"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var main_exports = {};
__export(main_exports, {
  Editor: () => Editor,
  default_options: () => default_options
});
module.exports = __toCommonJS(main_exports);
var import_utils = require("./utils");
var YAMP = __toESM(require("@theblackswitch/yamp"), 1);
var import_mcfunction = require("./prismjs_highlight/mcfunction");
var import_dompurify = __toESM(require("dompurify"), 1);
var import_utils2 = require("./utils");
var import_selection = require("./selection");
var import_prismjs = __toESM(require("prismjs"), 1);
const default_options = {
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
};
class Editor {
  #parent_element;
  #options;
  #place_holder;
  #wrapper;
  #nav;
  #bott_nav;
  #bott_nav_left;
  #bott_nav_right;
  #editor;
  #input;
  #text_display;
  #selection_mask;
  #slider;
  #toggle_check;
  #history = {
    "undo_states": [],
    "redo_states": []
  };
  // ==========================================================================================================================================
  // ------------------------------------------------------------------------------------------------------------------------------------------
  //                                                         CONSTRUCTOR + HTML GEN                                                                 
  // ------------------------------------------------------------------------------------------------------------------------------------------
  // ==========================================================================================================================================
  constructor(parent_element, options = {}, width = "100%", height = "40vh", placeholder = "Enter text here, you can use markdown formatting.") {
    if (!parent_element) throw Error("[Infill]: Failed to instantiate new editor. No parent element provided!");
    this.#parent_element = parent_element;
    this.#place_holder = placeholder;
    this.#options = {};
    for (const [option, value] of Object.entries(default_options)) {
      if (options[option] !== void 0) {
        if (typeof options[option] === "object") {
          console.log("OBJECT");
          this.#options[option] = {};
          for (const [sub_option, value2] of Object.entries(default_options[option])) {
            if (options[option][sub_option] === void 0) {
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
    });
    this.#wrapper = document.createElement("div");
    this.#wrapper.classList.add("infill-editor-wrapper");
    this.#parent_element.appendChild(this.#wrapper);
    this.#wrapper.style.width = width;
    this.#wrapper.style.height = height;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (!entry.contentBoxSize) return;
        const contentBoxSize = entry.contentBoxSize[0];
        const width2 = entry.contentRect.width;
        if (width2 < 620) {
          this.#wrapper.style.height = `calc(${height} * 0.7)`;
        } else {
          this.#wrapper.style.height = height;
        }
      }
    });
    resizeObserver.observe(this.#wrapper);
    this.#nav = document.createElement("div");
    this.#nav.classList.add("infill-editor-nav");
    this.#wrapper.appendChild(this.#nav);
    let button_wrapper = document.createElement("div");
    button_wrapper.classList.add("infill-editor-nav-button-wrapper");
    this.#nav.appendChild(button_wrapper);
    let block_1 = document.createElement("div");
    block_1.classList.add("infill-editor-nav-block");
    button_wrapper.appendChild(block_1);
    if (this.#options.nav?.header) this.#gen_btn(block_1, () => this.#insert_text("# ", "", true), "H1", `Heading 1 ${this.#options.keyboard_shortcuts_enabled ? "| CTRL H" : ""}`, "infill-align-right");
    if (this.#options.nav?.header) this.#gen_btn(block_1, () => this.#insert_text("## ", "", true), "H2", "Heading 2", "infill-align-right");
    if (this.#options.nav?.header) this.#gen_btn(block_1, () => this.#insert_text("### ", "", true), "H3", "Heading 3");
    if (this.#options.nav?.blockquote) this.#gen_btn(block_1, () => this.#insert_text("> ", "", true), '<i class="infill-icon infill-icon-blockquote"></i>', `Blockquote ${this.#options.keyboard_shortcuts_enabled ? "| CTRL Q" : ""}`);
    if (this.#options.nav?.code_block) this.#gen_btn(block_1, () => this.#insert_text("```", "\n```", true), '<i class="infill-icon infill-icon-codeblock"></i>', `Codeblock  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL E" : ""}`);
    if (this.#options.nav?.code) this.#gen_btn(block_1, () => this.#insert_text("``", "``", false), '<i class="infill-icon infill-icon-code"></i>', `Code  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL T" : ""}`);
    let sep_1 = document.createElement("div");
    sep_1.classList.add("infill-editor-nav-separator");
    block_1.appendChild(sep_1);
    let block_2 = document.createElement("div");
    block_2.classList.add("infill-editor-nav-block");
    button_wrapper.appendChild(block_2);
    if (this.#options.nav?.list) this.#gen_btn(block_2, () => this.#insert_text("- ", "", true), '<i class="infill-icon infill-icon-unordered-list"></i>', `Unordered list ${this.#options.keyboard_shortcuts_enabled ? "| CTRL L" : ""}`);
    if (this.#options.nav?.link) this.#gen_btn(block_2, () => this.#insert_text("1. ", "", true), '<i class="infill-icon infill-icon-ordered-list"></i>', `Ordered list | ${this.#options.keyboard_shortcuts_enabled ? "| CTRL O" : ""}`);
    if (this.#options.nav?.link) this.#gen_btn(block_2, () => this.#insert_text("[", "]()", false), '<i class="infill-icon infill-icon-link"></i>', `Link ${this.#options.keyboard_shortcuts_enabled ? "| CTRL K" : ""}`);
    if (this.#options.nav?.image) this.#gen_btn(block_2, () => this.#insert_text("![]()", "", false), '<i class="infill-icon infill-icon-image"></i>', `Picture ${this.#options.keyboard_shortcuts_enabled ? "| CTRL P" : ""}`);
    let sep_2 = document.createElement("div");
    sep_2.classList.add("infill-editor-nav-separator");
    block_2.appendChild(sep_2);
    let block_3 = document.createElement("div");
    block_3.classList.add("infill-editor-nav-block");
    button_wrapper.appendChild(block_3);
    if (this.#options.nav?.bold) this.#gen_btn(block_3, () => this.#insert_text("**", "**", false), "<strong>B</strong>", `Bold Text  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL B" : ""}`);
    if (this.#options.nav?.italic) this.#gen_btn(block_3, () => this.#insert_text("_", "_", false), "<em>I</em>", `Italic Text  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL I" : ""}`);
    if (this.#options.nav?.strikethrough) this.#gen_btn(block_3, () => this.#insert_text("~~", "~~", false), "<s>S</s>", `Strikethrough Text  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL S" : ""}`);
    if (this.#options.nav?.underline) this.#gen_btn(block_3, () => this.#insert_text("==", "==", false), "<u>U</u>", `Underline Text  ${this.#options.keyboard_shortcuts_enabled ? "| CTRL U" : ""}`);
    if (this.#options.nav?.highlight) this.#gen_btn(block_3, () => this.#insert_text("^", "^", false), "<mark>H</mark>", `Marked Text ${this.#options.keyboard_shortcuts_enabled ? "| CTRL M" : ""}`);
    if (this.#options.nav?.coloured) this.#gen_btn(block_3, () => this.#insert_text("[|", "]", false), '<i class="infill-icon infill-icon-coloured"></i>', `Dyed Text ${this.#options.keyboard_shortcuts_enabled ? "| CTRL D" : ""}`);
    let sep_3 = document.createElement("div");
    sep_3.classList.add("infill-editor-nav-separator", "infill-end");
    block_3.appendChild(sep_3);
    let sizer = document.createElement("div");
    sizer.classList.add("infill-editor-sizer");
    this.#nav.appendChild(sizer);
    let slider_wrapper = document.createElement("div");
    slider_wrapper.classList.add("infill-slider-wrapper");
    this.#slider = document.createElement("input");
    this.#slider.setAttribute("type", "range");
    this.#slider.setAttribute("value", "50");
    this.#slider.setAttribute("value", "50");
    this.#slider.setAttribute("step", "5");
    this.#slider.setAttribute("min", "0");
    this.#slider.setAttribute("max", "100");
    this.#slider.classList.add("infill-slider");
    this.#slider.addEventListener("input", () => this.#slider_change());
    slider_wrapper.appendChild(this.#slider);
    this.#nav.appendChild(slider_wrapper);
    let toggle_wrapper = document.createElement("div");
    toggle_wrapper.classList.add("infill-toggle-wrapper");
    this.#nav.appendChild(toggle_wrapper);
    this.#toggle_check = document.createElement("input");
    this.#toggle_check.setAttribute("type", "checkbox");
    this.#toggle_check.setAttribute("checked", "");
    this.#toggle_check.classList.add("infill-toggle-check");
    this.#toggle_check.addEventListener("click", () => window.setTimeout(() => this.#click_toggle(), 100));
    this.#toggle_check.addEventListener("pointerdown", () => this.#register_focus());
    toggle_wrapper.appendChild(this.#toggle_check);
    let toggle_gutter = document.createElement("div");
    toggle_gutter.classList.add("infill-toggle-gutter");
    toggle_wrapper.appendChild(toggle_gutter);
    let toggle_gripper = document.createElement("div");
    toggle_gripper.classList.add("infill-toggle-gripper");
    toggle_wrapper.appendChild(toggle_gripper);
    this.#editor = document.createElement("div");
    this.#editor.classList.add("infill-editor");
    this.#wrapper.appendChild(this.#editor);
    this.#input = document.createElement("textarea");
    this.#input.classList.add("infill-editor-input");
    this.#input.setAttribute("name", "infill-editor-input");
    this.#input.addEventListener("beforeinput", (e) => this.#before_input(e));
    this.#input.addEventListener("input", () => this.#update_markdown_render());
    this.#input.addEventListener("blur", () => this.#update_markdown_render());
    this.#editor.appendChild(this.#input);
    this.#text_display = document.createElement("div");
    this.#text_display.classList.add("infill-editor-display");
    this.#text_display.addEventListener("pointermove", (e) => this.#editor_mouse_move(e));
    this.#text_display.addEventListener("scroll", (e) => this.#editor_scroll(e));
    this.#text_display.addEventListener("pointerdown", (e) => e.preventDefault());
    document.addEventListener("pointerdown", (e) => this.#editor_mouse_down(e));
    document.addEventListener("pointerup", (e) => this.#editor_mouse_up(e));
    document.addEventListener("pointermove", (e) => this.#selection_thumb_move(e));
    document.addEventListener("scroll", () => this.#cancel_hold());
    this.#editor.appendChild(this.#text_display);
    this.#selection_mask = document.createElement("div");
    this.#selection_mask.classList.add("infill-editor-selection-mask");
    this.#editor.appendChild(this.#selection_mask);
    document.addEventListener("keydown", (e) => this.#on_key_down(e));
    document.addEventListener("paste", (e) => this.#paste_selection(e));
    document.addEventListener("copy", (e) => this.#copy_selection(e));
    document.addEventListener("cut", (e) => this.#cut_selection(e));
    this.#bott_nav = document.createElement("div");
    this.#bott_nav.classList.add("infill-editor-bottom-nav");
    this.#wrapper.appendChild(this.#bott_nav);
    this.#bott_nav_left = document.createElement("div");
    this.#bott_nav_left.classList.add("infill-editor-bottom-nav-left");
    this.#bott_nav.appendChild(this.#bott_nav_left);
    this.#gen_btn(this.#bott_nav_left, (e) => this.#copy_selection(navigator.clipboard), '<i class="infill-icon infill-icon-copy"></i>', "Copy | CTRL + C");
    this.#gen_btn(this.#bott_nav_left, (e) => this.#paste_selection(navigator.clipboard), '<i class="infill-icon infill-icon-paste"></i>', "Paste | CTRL + V");
    this.#gen_btn(this.#bott_nav_left, (e) => this.#cut_selection(navigator.clipboard), '<i class="infill-icon infill-icon-cut"></i>', "Cut | CTRL + X");
    let sep_4 = document.createElement("div");
    sep_4.classList.add("infill-editor-nav-separator");
    this.#bott_nav_left.appendChild(sep_4);
    this.#gen_btn(this.#bott_nav_left, (e) => this.set_cursor(Math.max(0, this.#input.selectionStart - 1)), '<i class="infill-icon infill-icon-arrow-left"></i>', "Move cursor left | Left Arrow");
    this.#gen_btn(this.#bott_nav_left, (e) => this.set_cursor(Math.min(this.#input.value.length, this.#input.selectionStart + 1)), '<i class="infill-icon infill-icon-arrow-right"></i>', "Move cursor right | Right Arrow");
    this.#bott_nav_right = document.createElement("div");
    this.#bott_nav_right.classList.add("infill-editor-bottom-nav-right");
    this.#bott_nav.appendChild(this.#bott_nav_right);
    this.#gen_btn(this.#bott_nav_right, (e) => this.#undo(e, true), '<i class="infill-icon infill-icon-undo"></i>', "Undo");
    this.#gen_btn(this.#bott_nav_right, (e) => this.#redo(e, true), '<i class="infill-icon infill-icon-redo"></i>', "Redo");
    let sep_5 = document.createElement("div");
    sep_5.classList.add("infill-editor-nav-separator");
    this.#bott_nav_right.appendChild(sep_5);
    this.#gen_btn(this.#bott_nav_right, () => this.#export_file(), '<i class="infill-icon infill-icon-export"></i>', "Export File");
    this.#gen_btn(this.#bott_nav_right, () => this.#import_file(), '<i class="infill-icon infill-icon-import"></i>', "Open File");
    this.#register_history_state();
    this.#update_markdown_render();
  }
  // -------------------------------
  //  Generate the html for a btn                            
  // -------------------------------
  #gen_btn(parent_element, on_click, inner, tooltip, ...css_classes) {
    let btn = document.createElement("div");
    btn.innerHTML = inner;
    btn.setAttribute("data-infill-tooltip", tooltip);
    btn.classList.add("infill-nav-btn", "infill-tooltip", ...css_classes);
    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
    });
    parent_element.appendChild(btn);
    btn.addEventListener("click", (e) => {
      on_click(e);
    });
  }
  // ==========================================================================================================================================
  // ------------------------------------------------------------------------------------------------------------------------------------------
  //                                                            TOP NAVIGATION                                                           
  // ------------------------------------------------------------------------------------------------------------------------------------------
  // ==========================================================================================================================================
  #insert_text(before_cursor, after_cursor, force_linebreak = false) {
    let before = "";
    let after = "";
    let inside = "";
    console.log(this.#selection);
    let select_start = 0;
    let select_end = 0;
    if (this.#selection !== null && this.#selection.visible) {
      select_start = this.#map_cursor_pos(this.#selection.lo);
      select_end = this.#map_cursor_pos(this.#selection.hi);
      if (select_end === void 0 || select_start === void 0) return;
      before = this.#input.value.slice(0, select_start);
      inside = this.#input.value.slice(select_start, select_end);
      after = this.#input.value.slice(select_end);
    } else {
      const cursor_pos = this.#input.selectionStart;
      before = this.#input.value.slice(0, cursor_pos);
      after = this.#input.value.slice(cursor_pos);
    }
    console.log("TEST", before, after);
    const should_remove_start = before.endsWith(before_cursor) || inside.startsWith(before_cursor);
    const should_remove_end = after.startsWith(after_cursor) || inside.endsWith(after_cursor);
    if (should_remove_start) {
      if (before.endsWith(before_cursor)) {
        before = before.slice(0, before.length - before_cursor.length);
      } else {
        inside = inside.slice(before_cursor.length);
      }
    } else {
      if (force_linebreak && before[before.length - 1] !== "\n" && before.length > 0) {
        before += "\n";
      }
      before += before_cursor;
    }
    if (should_remove_end) {
      if (after.startsWith(after_cursor)) {
        after = after.slice(after_cursor.length);
      } else {
        inside = inside.slice(0, inside.length - after_cursor.length);
      }
    } else {
      after = after_cursor + after;
    }
    this.#input.value = before + inside + after;
    const end_offs = should_remove_end || this.#selection === null || !this.#selection.visible ? 0 : after_cursor.length;
    if (!this.#selection?.is_mobile) window.setTimeout(() => this.set_cursor(before.length + inside.length + end_offs), 1);
    if (force_linebreak) this.#selection?.discard();
    this.#update_markdown_render();
    if (this.#selection !== null && this.#selection.visible) {
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
    let scale = 1;
    const slider_value = Number(this.#slider.value);
    scale = 0.5 * Math.pow(4, slider_value / 100);
    this.#text_display.style.fontSize = `${scale * 16}px`;
    this.#input.style.fontSize = `${scale * 16}px`;
    this.#selection?.update_render();
  }
  // -------------------------------
  //  Toggle button                            
  // -------------------------------
  #editor_had_focus = false;
  // Register if the editor is focused just before it will lose focus due to clicking on the toggle
  #register_focus() {
    this.#editor_had_focus = document.activeElement === this.#input;
  }
  #click_toggle() {
    const enabled = this.#toggle_check.checked;
    console.log("CHECK");
    if (enabled) {
      this.#wrapper.classList.remove("infill-parsing-disabled");
      window.setTimeout(() => this.set_cursor(this.#input.selectionStart, !this.#editor_had_focus), 10);
      this.#update_markdown_render();
    } else {
      this.#wrapper.classList.add("infill-parsing-disabled");
      if (this.#editor_had_focus) this.#input.focus();
      if (this.#selection !== null) this.#selection.discard();
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
  #last_parse = {
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
    if (!this.#toggle_check.checked) return;
    if (markdown_input.length === 0 && document.activeElement !== this.#input) {
      markdown_input = `<span class="infill-placeholder">${this.#place_holder}</span>`;
    }
    const cursor_pos = this.#input.selectionStart;
    markdown_input = markdown_input.slice(0, cursor_pos) + "\uE003" + markdown_input.slice(cursor_pos);
    console.log(markdown_input);
    this.#last_parse = YAMP.parse(markdown_input);
    if (this.#last_parse.html === void 0) throw Error("[Infill]: whoops something went horribly wrong whilst parsing markdown. Please make an issue on github immediately.");
    console.log(this.#last_parse.html);
    let text = import_dompurify.default.sanitize(this.#last_parse.html);
    console.log(this.#last_parse.html);
    this.#text_display.innerHTML = text;
    import_prismjs.default.highlightAllUnder(this.#wrapper);
    this.#text_display.innerHTML = this.#text_display.innerHTML.replaceAll("\uE003", '<i class="infill-editor-cursor"></i>');
    document.getElementsByClassName("infill-editor-cursor")[0]?.scrollIntoView({
      "behavior": "instant",
      "block": "nearest",
      "inline": "center"
    });
  }
  #editor_scroll(e) {
    if (this.#selection !== null && this.#selection.visible) this.#selection.update_render();
    console.log("HELLO");
  }
  // ==========================================================================================================================================
  // ------------------------------------------------------------------------------------------------------------------------------------------
  //                                                           KEYBOARD
  // ------------------------------------------------------------------------------------------------------------------------------------------
  // ==========================================================================================================================================
  #on_key_down(e) {
    const key = e.key.toLowerCase();
    const is_shortcut = document.activeElement === this.#input && this.#options.keyboard_shortcuts_enabled && e.getModifierState("Control") && !(e.getModifierState("Alt") || e.getModifierState("Shift"));
    if ((key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") && !(e.getModifierState("Shift") || e.getModifierState("Ctrl"))) {
      window.setTimeout(() => this.#update_markdown_render(), 1);
    }
    if (key === "h" && is_shortcut) {
      this.#insert_text("# ", "", true);
    } else if (key === "q" && is_shortcut) {
      this.#insert_text("> ", "", true);
    } else if (key === "e" && is_shortcut) {
      this.#insert_text("```", "\n```", true);
    } else if (key === "t" && is_shortcut) {
      this.#insert_text("``", "``", false);
    } else if (key === "b" && is_shortcut) {
      this.#insert_text("**", "**", false);
    } else if (key === "i" && is_shortcut) {
      this.#insert_text("*", "*", false);
    } else if (key === "s" && is_shortcut) {
      this.#insert_text("~~", "~~", false);
    } else if (key === "u" && is_shortcut) {
      this.#insert_text("==", "==", false);
    } else if (key === "m" && is_shortcut) {
      this.#insert_text("^", "^", false);
    } else if (key === "d" && is_shortcut) {
      this.#insert_text("[|", "]", false);
    } else if (key === "l" && is_shortcut) {
      this.#insert_text("- ", "", true);
    } else if (key === "o" && is_shortcut) {
      this.#insert_text("1. ", "", true);
    } else if (key === "k" && is_shortcut) {
      this.#insert_text("[", "]()", false);
    } else if (key === "p" && is_shortcut) {
      this.#insert_text("![]()", "", false);
    }
    if (is_shortcut && "hqetbisumdlokp".includes(key)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (e.key.length === 1 && !e.getModifierState("Control") && !e.getModifierState("Alt") && this.#selection !== null && this.#selection.visible) {
      e.preventDefault();
      e.stopPropagation();
      this.#replace_selection(e.key);
      this.#register_history_state();
      return;
    }
    if ((e.key === "Delete" || e.key === "Backspace") && this.#selection !== null && this.#selection.visible) {
      e.preventDefault();
      e.stopPropagation();
      this.#replace_selection("");
      this.#register_history_state();
      return;
    }
    if (e.key === "a" && e.getModifierState("Control") && !(e.getModifierState("Alt") || e.getModifierState("Shift")) && this.#wrapper.contains(document.activeElement)) {
      this.#select_all(e);
      return;
    }
    if (e.key === "ArrowLeft" && e.getModifierState("Shift")) this.#select_left(e, e.getModifierState("Control"));
    if (e.key === "ArrowRight" && e.getModifierState("Shift")) this.#select_right(e, e.getModifierState("Control"));
    if (e.key === "ArrowUp" && e.getModifierState("Shift")) this.#select_up(e);
    if (e.key === "ArrowDown" && e.getModifierState("Shift")) this.#select_down(e);
    if (e.key === "ArrowLeft" && !e.getModifierState("Shift")) this.#escape_selection(e, this.#selection?.lo, true);
    if (e.key === "ArrowRight" && !e.getModifierState("Shift")) this.#escape_selection(e, this.#selection?.hi, true);
    if (e.key === "ArrowUp" && !e.getModifierState("Shift")) this.#escape_selection_up(e);
    if (e.key === "ArrowDown" && !e.getModifierState("Shift")) this.#escape_selection_down(e);
    if (e.key == "Escape") this.#escape_selection(e);
    if (e.key === "z" && e.getModifierState("Control") && !e.getModifierState("Alt")) this.#undo(e);
    if (e.key === "y" && e.getModifierState("Control") && !e.getModifierState("Alt")) this.#redo(e);
    if (e.key === "Delete" || e.key === "Backspace") {
      this.#register_history_state();
    }
  }
  #before_input(e) {
    const key = e.data;
    if (key?.length === 1) {
      if (" -\n".includes(key)) {
        window.setTimeout(() => this.#register_history_state(true, true), 10);
      } else {
        window.setTimeout(() => this.#register_history_state(true), 10);
      }
    }
    if (key === null) {
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
  #selection = null;
  #anchor_pos = [0, 0];
  #mouse_down = false;
  #mouse_hold = false;
  #hold_timeout = null;
  #last_click = 0;
  #last_click_pos = 0;
  // -------------------------------
  //  Mouse down                            
  // -------------------------------
  #editor_mouse_down(e) {
    if (e.target === null || !(e.target instanceof Node)) return;
    if (!this.#toggle_check.checked) return;
    const cursor = (0, import_utils2.cursor_pos_from_point)(this.#text_display, e.clientX, e.clientY)?.global;
    if (this.#last_click + 300 > Date.now() && this.#last_click_pos !== void 0 && cursor === this.#last_click_pos) {
      if (e.pointerType === "mouse") this.#select_word();
      this.#last_click = Date.now();
      return;
    }
    this.#last_click = Date.now();
    this.#last_click_pos = cursor;
    this.#mouse_hold = false;
    if (this.#selection_mask.contains(e.target)) {
      return;
    } else if (this.#editor.contains(e.target)) {
      this.#mouse_down = true;
      this.#anchor_pos = [e.clientX, e.clientY];
      this.#selection?.discard();
      if (cursor === void 0) return this.#selection = null;
      this.#target_line_offs = null;
      const mapped_pos = this.#map_cursor_pos(cursor);
      if (mapped_pos === void 0) return;
      this.#selection_anchor = mapped_pos;
      this.#selection = new import_selection.EditorSelection(this.#text_display, this.#selection_mask, cursor, cursor);
      if (e.pointerType !== "mouse") this.#hold_timeout = window.setTimeout(() => {
        if (!this.#mouse_down) return;
        this.#mouse_hold = true;
        this.#mobile_selection(mapped_pos);
        e.preventDefault();
      }, 800);
    } else if (!this.#nav.contains(e.target) && !this.#bott_nav.contains(e.target)) {
      this.#selection?.discard();
    }
  }
  #cancel_hold() {
    if (this.#hold_timeout === null) return;
    window.clearTimeout(this.#hold_timeout);
    this.#hold_timeout = null;
  }
  // -------------------------------
  //  Mouse move                            
  // -------------------------------
  #editor_mouse_move(e) {
    if (!this.#toggle_check.checked) return;
    if (this.#mouse_down && e.pointerType === "mouse" && this.#input.value.length > 0) {
      const cursor = (0, import_utils2.cursor_pos_from_point)(this.#text_display, e.clientX, e.clientY)?.global;
      if (cursor !== void 0) {
        const mapped = this.#map_cursor_pos(cursor);
        if (mapped !== void 0) this.set_cursor(mapped);
        this.#selection?.set_end(cursor);
      }
    }
    if (this.#mouse_down && (this.#selection === null || !this.#selection.visible)) {
      let start_x = this.#anchor_pos[0];
      let start_y = this.#anchor_pos[1];
      if (start_x === void 0 || start_y === void 0) return;
      let dist = (start_x - e.clientX) ** 2 + (start_y - e.clientY) ** 2;
      if (dist >= 64) {
        if (e.pointerType === "mouse" && this.#input.value.length > 0) {
          this.#selection?.apply();
          this.#target_line_offs = null;
        }
        if (this.#hold_timeout !== null) {
          window.clearInterval(this.#hold_timeout);
          this.#hold_timeout = null;
        }
      }
    }
  }
  // -------------------------------
  //  Mouse Up                            
  // -------------------------------
  #editor_mouse_up(e) {
    if (!this.#toggle_check.checked) return;
    this.#selection_thumb_up(e);
    if (this.#hold_timeout !== null) {
      window.clearInterval(this.#hold_timeout);
      this.#hold_timeout = null;
    }
    if (this.#mouse_hold) {
      e.preventDefault();
      this.#mouse_down = false;
      return;
    }
    if (this.#mouse_down) {
      const cursor = (0, import_utils2.cursor_pos_from_point)(this.#text_display, e.clientX, e.clientY)?.global;
      if (cursor !== void 0 && this.#input.value.length > 0) this.#selection?.set_end(cursor);
      if (cursor !== void 0) {
        const mapped_pos = this.#map_cursor_pos(cursor);
        if (mapped_pos !== void 0) window.setTimeout(() => this.set_cursor(mapped_pos), 10);
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
  #mobile_selection(cursor) {
    this.#input.blur();
    const word_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let start = cursor;
    while (word_chars.includes(this.#input.value.charAt(start - 1)) && start > 0) {
      start--;
    }
    let end = cursor;
    while (word_chars.includes(this.#input.value.charAt(end)) && end < this.#input.value.length) {
      end++;
    }
    const mapped_start = this.#inverse_map_cursor_pos(start);
    const mapped_end = this.#inverse_map_cursor_pos(end);
    this.#selection?.discard();
    this.#selection = new import_selection.EditorSelection(
      this.#text_display,
      this.#selection_mask,
      mapped_start,
      mapped_end,
      true,
      (e, type) => this.#selection_thumb_down(e, type)
    );
    this.#selection.apply();
    window.setTimeout(() => document.getSelection()?.removeAllRanges(), 10);
  }
  // -------------------------------
  //  Adjust mobile selection                            
  // -------------------------------
  #thumb_down = false;
  #selected_thumb = "end";
  #selection_thumb_down(e, type) {
    this.#selected_thumb = type;
    this.#thumb_down = true;
    this.#mouse_hold = true;
    this.#editor.classList.add("infill-selection-busy");
  }
  #selection_thumb_up(e) {
    this.#thumb_down = false;
    this.#editor.classList.remove("infill-selection-busy");
  }
  // Adjust selection
  #selection_thumb_move(e) {
    if (this.#thumb_down) {
      const cursor = (0, import_utils2.cursor_pos_from_point)(this.#text_display, e.clientX, e.clientY)?.global;
      if (cursor !== void 0) {
        if (this.#selected_thumb === "start") {
          this.#selection?.set_start(cursor);
        } else {
          this.#selection?.set_end(cursor);
        }
      } else {
        if (this.#selected_thumb === "start") {
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
  set_cursor(position, no_focus = false, no_update = false) {
    this.#text_display.querySelector(".infill-editor-cursor")?.classList.add("infill-cursor-force-mark");
    window.setTimeout(() => this.#text_display.querySelector(".infill-editor-cursor")?.classList.remove("infill-cursor-force-mark"), 500);
    if (!no_focus) this.#input.focus();
    this.#input.selectionStart = position;
    this.#input.selectionEnd = position;
    if (!no_update) this.#update_markdown_render();
  }
  // Map a cursor pos from html to markdown
  #map_cursor_pos(position) {
    return this.#last_parse.char_map.absolute_map[position];
  }
  // Map a cusor pos from markdown to html
  #inverse_map_cursor_pos(position, map = this.#last_parse.char_map.absolute_map) {
    const last_item = map[map.length - 1];
    const first_item = map[0];
    let mapped = map.indexOf(position);
    if (last_item !== void 0 && position > last_item) return -1;
    if (first_item !== void 0 && position < first_item) return -1;
    while (mapped === -1 && position > 0) {
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
  #replace_selection(value) {
    if (this.#selection === null || value === void 0) return null;
    const start = this.#map_cursor_pos(this.#selection.lo);
    const end = this.#map_cursor_pos(this.#selection.hi);
    if (start === void 0) return null;
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
  #get_line_idx(offs) {
    const result = this.#last_parse.char_map.line_idx_map[offs];
    if (result === void 0) return -1;
    return result;
  }
  // Create a new selection when there isn't one yet
  #init_selection(cursor_md_pos, cursor_html_pos) {
    if (this.#selection === null || !this.#selection.visible) {
      this.#target_line_offs === null;
      this.#selection_anchor = cursor_md_pos;
      this.#input.blur();
      let sel = new import_selection.EditorSelection(this.#text_display, this.#selection_mask, cursor_html_pos, cursor_html_pos);
      sel.apply();
      return sel;
    }
    return this.#selection;
  }
  // Calculate the target offset when selecting up or down
  #init_target_offs(selection_pos, curr_line_map) {
    if (this.#target_line_offs === null) {
      let line_start_idx_markdown = curr_line_map[0];
      if (line_start_idx_markdown === void 0) line_start_idx_markdown = 0;
      const line_start_idx = this.#inverse_map_cursor_pos(line_start_idx_markdown);
      return selection_pos - line_start_idx;
    }
    return this.#target_line_offs;
  }
  // -------------------------------
  //  Copy                            
  // -------------------------------
  #copy_selection(e) {
    if (!this.#toggle_check.checked) return;
    if (this.#selection !== null && this.#selection.visible) {
      if (e instanceof ClipboardEvent) {
        e.preventDefault();
        e.stopPropagation();
      }
      const start = this.#map_cursor_pos(this.#selection.lo);
      const end = this.#map_cursor_pos(this.#selection.hi);
      const selected = this.#input.value.slice(start, end);
      if (e instanceof ClipboardEvent) e.clipboardData?.setData("text", selected);
      if (e instanceof Clipboard) e.writeText(selected);
    }
  }
  // -------------------------------
  //  Paste                            
  // -------------------------------
  async #paste_selection(e) {
    window.setTimeout(() => this.#register_history_state(), 10);
    if (!this.#toggle_check.checked) return;
    if (this.#selection !== null && this.#selection.visible) {
      if (e instanceof ClipboardEvent) {
        e.preventDefault();
        e.stopPropagation();
      }
      const replacement = e instanceof ClipboardEvent ? e.clipboardData?.getData("text") : await e.readText();
      if (replacement === void 0) return;
      this.#replace_selection(replacement);
    } else if (e instanceof Clipboard) {
      this.#insert_text(await e.readText(), "");
    }
  }
  // -------------------------------
  //  Cut                            
  // -------------------------------
  #cut_selection(e) {
    window.setTimeout(() => this.#register_history_state(), 10);
    if (!this.#toggle_check.checked) return;
    if (this.#selection !== null && this.#selection.visible) {
      if (e instanceof ClipboardEvent) {
        e.preventDefault();
        e.stopPropagation();
      }
      const inside = this.#replace_selection("");
      if (inside === null) return;
      if (e instanceof ClipboardEvent) e.clipboardData?.setData("text", inside);
      if (e instanceof Clipboard) e.writeText(inside);
    }
  }
  // -------------------------------
  //  Select All                            
  // -------------------------------
  #select_all(e) {
    if (!this.#toggle_check.checked) return;
    const abs_map = this.#last_parse.char_map.absolute_map;
    if (this.#selection === null || !this.#selection.visible) {
      this.#selection = new import_selection.EditorSelection(this.#text_display, this.#selection_mask, 0, abs_map.length - 1);
      this.#selection.apply();
    } else {
      this.#selection.set_start(0);
      this.#selection.set_end(abs_map.length - 1);
    }
    const targ_cursor_pos = abs_map[abs_map.length - 1];
    if (targ_cursor_pos !== void 0) this.set_cursor(targ_cursor_pos);
    e.preventDefault();
    e.stopPropagation();
  }
  // -------------------------------
  //  Select with shift                            
  // -------------------------------
  // Main helper
  #select_distance(dist) {
    if (!this.#toggle_check.checked) return;
    const cursor_md_pos = this.#input.selectionStart;
    const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);
    if (cursor_html_pos === void 0) return;
    this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);
    let sel_end_md = this.#map_cursor_pos(this.#selection.end + dist);
    const abs_char_map = this.#last_parse.char_map.absolute_map;
    const max_len = abs_char_map[abs_char_map.length - 1];
    if (max_len === void 0 || sel_end_md === void 0) return;
    if (sel_end_md < 0) sel_end_md = 0;
    if (sel_end_md > max_len) sel_end_md = max_len;
    this.set_cursor(sel_end_md);
    const sel_end = this.#inverse_map_cursor_pos(sel_end_md);
    const sel_start = this.#inverse_map_cursor_pos(this.#selection_anchor);
    this.#selection.set_end(sel_end);
    this.#selection.set_start(sel_start);
  }
  #target_line_offs = 0;
  #selection_anchor = 0;
  #select_left(e, ctrl) {
    if (!this.#toggle_check.checked) return;
    if ((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
    e.preventDefault();
    e.stopPropagation();
    console.log("SELECT");
    if (ctrl) {
      if (this.#selection !== null && this.#selection.visible && this.#selection.end > this.#selection.start) {
        const start_line_idx = this.#get_line_idx(this.#selection.start);
        const end_line_idx = this.#get_line_idx(this.#selection.end);
        if (start_line_idx === end_line_idx || end_line_idx === start_line_idx + 1) {
          this.#escape_selection(null, this.#selection.lo, true);
          return;
        }
      }
      const cursor_md_pos = this.#input.selectionStart;
      const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);
      this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);
      let line_idx = this.#get_line_idx(this.#selection.end);
      let prev_line_map = this.#last_parse.char_map.line_map[line_idx - 1];
      let targ_md_pos;
      if (prev_line_map === void 0) {
        targ_md_pos = this.#last_parse.char_map.absolute_map[0];
      } else {
        targ_md_pos = prev_line_map[prev_line_map.length - 1];
      }
      if (targ_md_pos === void 0) return;
      this.set_cursor(targ_md_pos);
      const targ_html_pos = this.#inverse_map_cursor_pos(targ_md_pos);
      const targ_html_start_pos = this.#inverse_map_cursor_pos(this.#selection_anchor);
      this.#selection.set_start(targ_html_start_pos);
      this.#selection.set_end(targ_html_pos);
    } else {
      this.#select_distance(-1);
    }
    this.#target_line_offs = null;
  }
  #select_right(e, ctrl) {
    if (!this.#toggle_check.checked) return;
    if ((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
    e.preventDefault();
    e.stopPropagation();
    this.#target_line_offs = null;
    if (ctrl) {
      if (this.#selection !== null && this.#selection.visible && this.#selection.end < this.#selection.start) {
        const start_line_idx = this.#get_line_idx(this.#selection.start);
        const end_line_idx = this.#get_line_idx(this.#selection.end);
        if (start_line_idx === end_line_idx || end_line_idx === start_line_idx - 1) {
          this.#escape_selection(null, this.#selection.hi, true);
          return;
        }
      }
      const cursor_md_pos = this.#input.selectionStart;
      const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);
      this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);
      let line_idx = this.#get_line_idx(this.#selection.end);
      let next_line_map = this.#last_parse.char_map.line_map[line_idx + 1];
      let targ_md_pos;
      if (next_line_map === void 0) {
        const abs_map = this.#last_parse.char_map.absolute_map;
        targ_md_pos = abs_map[abs_map.length - 1];
      } else {
        targ_md_pos = next_line_map[0];
      }
      if (targ_md_pos === void 0) return;
      targ_md_pos--;
      this.set_cursor(targ_md_pos);
      const targ_html_pos = this.#inverse_map_cursor_pos(targ_md_pos);
      const targ_html_start_pos = this.#inverse_map_cursor_pos(this.#selection_anchor);
      this.#selection.set_start(targ_html_start_pos);
      this.#selection.set_end(targ_html_pos);
    } else {
      this.#select_distance(1);
    }
  }
  #select_up(e) {
    if (!this.#toggle_check.checked) return;
    if ((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
    e.preventDefault();
    e.stopPropagation();
    const cursor_md_pos = this.#input.selectionStart;
    const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);
    let line_idx = this.#get_line_idx(cursor_html_pos);
    this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);
    const selection_pos = this.#selection.end;
    const curr_line_map = this.#last_parse.char_map.line_map[line_idx];
    if (curr_line_map === void 0) return;
    this.#target_line_offs = this.#init_target_offs(selection_pos, curr_line_map);
    line_idx = this.#get_line_idx(this.#selection.end);
    const prev_line = this.#last_parse.char_map.line_map[line_idx - 1];
    if (prev_line === void 0) {
      var target_md_char = curr_line_map[0];
    } else {
      var target_md_char = prev_line[this.#target_line_offs];
      if (target_md_char === void 0) target_md_char = prev_line[prev_line.length - 1];
    }
    if (target_md_char === void 0) return;
    this.set_cursor(target_md_char);
    const target_end_char = this.#inverse_map_cursor_pos(target_md_char);
    const target_start_char = this.#inverse_map_cursor_pos(this.#selection_anchor);
    this.#selection.set_end(target_end_char);
    this.#selection.set_start(target_start_char);
    if (this.#selection.length === 0) {
      this.#selection.discard();
    }
  }
  #select_down(e) {
    if (!this.#toggle_check.checked) return;
    if ((this.#selection === null || !this.#selection.visible) && !this.#editor.contains(document.activeElement)) return;
    e.preventDefault();
    e.stopPropagation();
    const cursor_md_pos = this.#input.selectionStart;
    const cursor_html_pos = this.#inverse_map_cursor_pos(cursor_md_pos);
    let line_idx = this.#get_line_idx(cursor_html_pos);
    this.#selection = this.#init_selection(cursor_md_pos, cursor_html_pos);
    const selection_pos = this.#selection.end;
    const curr_line_map = this.#last_parse.char_map.line_map[line_idx];
    if (curr_line_map === void 0) return;
    this.#target_line_offs = this.#init_target_offs(selection_pos, curr_line_map);
    line_idx = this.#get_line_idx(this.#selection.end);
    const next_line = this.#last_parse.char_map.line_map[line_idx + 1];
    if (next_line === void 0) {
      var target_md_char = curr_line_map[curr_line_map.length - 1];
      if (target_md_char === void 0) return;
    } else {
      var target_md_char = next_line[this.#target_line_offs];
      if (target_md_char === void 0) target_md_char = next_line[next_line.length - 1];
      if (target_md_char === void 0) return;
      target_md_char--;
    }
    this.set_cursor(target_md_char);
    const target_end_char = this.#inverse_map_cursor_pos(target_md_char);
    const target_start_char = this.#inverse_map_cursor_pos(this.#selection_anchor);
    this.#selection.set_end(target_end_char);
    this.#selection.set_start(target_start_char);
    if (this.#selection.length === 0) {
      this.#selection.discard();
    }
  }
  // -------------------------------
  //  Select word                            
  // -------------------------------
  #select_word() {
    if (this.#selection !== null && this.#selection?.visible) return;
    const word_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const cursor = this.#input.selectionStart;
    let start = cursor;
    while (word_chars.includes(this.#input.value.charAt(start - 1)) && start > 0) {
      start--;
    }
    let end = cursor;
    while (word_chars.includes(this.#input.value.charAt(end)) && end < this.#input.value.length) {
      end++;
    }
    const mapped_start = this.#inverse_map_cursor_pos(start);
    const mapped_end = this.#inverse_map_cursor_pos(end);
    this.#selection?.discard();
    this.#selection = new import_selection.EditorSelection(this.#text_display, this.#selection_mask, mapped_start, mapped_end);
    this.#selection_anchor = Math.min(start, end);
    this.set_cursor(Math.max(start, end));
    this.#selection.apply();
  }
  // -------------------------------
  //  Escape selection                            
  // -------------------------------
  // Escape the selection whilst leaving the cursor position at the end of the selection
  #escape_selection(e = null, cursor_pos = void 0, unit_html = true) {
    if (this.#selection === null || !this.#selection.visible) return;
    if (!this.#toggle_check.checked) return;
    if (cursor_pos !== void 0) {
      let target_pos;
      if (unit_html) {
        target_pos = this.#last_parse.char_map.absolute_map[cursor_pos];
      } else {
        target_pos = cursor_pos;
      }
      if (target_pos === void 0) return;
      this.set_cursor(target_pos);
    }
    if (e !== null) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.#target_line_offs = null;
    this.#selection?.discard();
  }
  // Escape a selection on the left
  #escape_selection_up(e) {
    if (this.#selection === null || !this.#selection.visible) return;
    if (!this.#toggle_check.checked) return;
    e.preventDefault();
    e.stopPropagation();
    let line_idx = this.#get_line_idx(this.#selection.lo);
    const curr_line_map = this.#last_parse.char_map.line_map[line_idx];
    const prev_line_map = this.#last_parse.char_map.line_map[line_idx - 1];
    let targ_md_pos = this.#map_cursor_pos(this.#selection.lo);
    if (curr_line_map !== void 0 && prev_line_map !== void 0) {
      const target = this.#init_target_offs(this.#selection.lo, curr_line_map);
      targ_md_pos = prev_line_map[target];
    }
    this.#escape_selection(null, targ_md_pos, false);
  }
  // Escape a selection on the left
  #escape_selection_down(e) {
    if (this.#selection === null || !this.#selection.visible) return;
    if (!this.#toggle_check.checked) return;
    e.preventDefault();
    e.stopPropagation();
    let line_idx = this.#get_line_idx(this.#selection.hi);
    const curr_line_map = this.#last_parse.char_map.line_map[line_idx];
    const next_line_map = this.#last_parse.char_map.line_map[line_idx + 1];
    let targ_md_pos = this.#map_cursor_pos(this.#selection.hi);
    if (curr_line_map !== void 0 && next_line_map !== void 0) {
      const target = this.#init_target_offs(this.#selection.hi, curr_line_map);
      targ_md_pos = next_line_map[target];
    }
    if (targ_md_pos !== void 0) targ_md_pos--;
    this.#escape_selection(null, targ_md_pos, false);
  }
  // ==========================================================================================================================================
  // ------------------------------------------------------------------------------------------------------------------------------------------
  //                                                       IMPORT / EXPORT FILES                                                                       
  // ------------------------------------------------------------------------------------------------------------------------------------------
  // ==========================================================================================================================================
  #import_file() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".txt,.md");
    input.click();
    input.addEventListener("change", (e) => {
      let file = input.files?.[0];
      let reader = new FileReader();
      input.value = "";
      if (!file) return;
      reader.readAsText(file, "UTF-8");
      reader.addEventListener("load", (e2) => {
        const result = reader.result;
        if (typeof result === "string") this.#input.value = result;
        this.#update_markdown_render();
      });
    });
  }
  #export_file() {
    const curr_date = /* @__PURE__ */ new Date();
    let default_file_name = `infill_export_${curr_date.getDate()}-${curr_date.getMonth() + 1}_${curr_date.getHours()}-${curr_date.getMinutes()}.md`;
    (0, import_utils2.download_file)(this.#input.value, default_file_name, "text/plain");
  }
  // ==========================================================================================================================================
  // ------------------------------------------------------------------------------------------------------------------------------------------
  //                                                         UNDO / REDO HISTORY                                                                       
  // ------------------------------------------------------------------------------------------------------------------------------------------
  // ==========================================================================================================================================
  #register_history_state(is_character_change = false, force_new_state = false) {
    (0, import_utils2.log_string)("Register history state");
    const item = {
      "input_value": this.#input.value,
      "cursor_pos": this.#input.selectionStart,
      "is_character_change": is_character_change
    };
    if (item.input_value === this.#history.undo_states[this.#history.undo_states.length - 1]?.input_value) {
      (0, import_utils2.log_string)("return history state :(");
      return;
    }
    if (is_character_change && !force_new_state && this.#history.undo_states[this.#history.undo_states.length - 1]?.is_character_change) {
      this.#history.undo_states[this.#history.undo_states.length - 1] = item;
    } else {
      this.#history.undo_states.push(item);
      if (this.#history.undo_states.length > 100) this.#history.undo_states.splice(0, 1);
    }
    this.#history.redo_states = [];
  }
  #undo(e, force_enabled = false) {
    (0, import_utils2.log_string)(this.#history.undo_states);
    if (!this.#toggle_check.checked && !force_enabled) return;
    e.preventDefault();
    e.stopPropagation();
    if (this.#selection !== null) this.#selection.discard();
    if (this.#history.undo_states.length < 2) return;
    const states = this.#history.undo_states;
    const prev_state = this.#history.undo_states.pop();
    if (prev_state !== void 0) this.#history.redo_states.push(prev_state);
    const new_state = states[states.length - 1];
    if (new_state !== void 0) this.#input.value = new_state.input_value;
    if (new_state !== void 0) this.set_cursor(new_state.cursor_pos);
  }
  #redo(e, force_enabled = false) {
    if (!this.#toggle_check.checked && !force_enabled) return;
    e.preventDefault();
    e.stopPropagation();
    if (this.#history.redo_states.length < 1) return;
    const states = this.#history.redo_states;
    const last_state = this.#history.redo_states.pop();
    if (last_state === void 0) return;
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
  get markdown() {
    return this.#input.value;
  }
  get html() {
    return this.#last_parse.html;
  }
  get_button_state() {
    return {
      "zoom_slider": this.#slider.value,
      "markdown_enabled": this.#toggle_check.checked
    };
  }
  get_cursor_pos() {
    return this.#input.selectionStart;
  }
  // -------------------------------
  //  Setters                            
  // -------------------------------
  set_button_state(state) {
    this.#slider.value = state.zoom_slider;
    this.#slider_change();
    this.#toggle_check.checked = state.markdown_enabled;
    this.#click_toggle();
  }
  set markdown(value) {
    this.#input.value = value;
    this.#update_markdown_render();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Editor,
  default_options
});
