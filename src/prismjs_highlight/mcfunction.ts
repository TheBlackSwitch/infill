// ==========================================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------------------
//                                                             IMPORTS                                                                       
// ------------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================================================================================================

import Prism from 'prismjs';

// ==========================================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------------------
//                                                               Highlights                                                                       
// ------------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================================================================================================

Prism.languages.mcfunction = {
    'comment': /^#.*/gm,
    'keyword': {
        'pattern': /(?<=run\s|^\s*?)(?:advancement|attribute|ban|ban-ip|banlist|bossbar|clear|clone|damage|data|datapack|debug|defaultgamemode|deop|difficulty|effect|enchant|execute|experience|fill|fillbiome|forceload|function|gamemode|gamerule|give|help|item|jfr|kick|kill|list|locate|loot|me|msg|op|pardon|pardon-ip|particle|perf|place|playsound|publish|random|recipe|reload|return|ride|rotate|save-all|save-off|save-on|say|schedule|scoreboard|seed|setblock|setidletimeout|setworldspawn|spawnpoint|spectate|spreadplayers|stop|stopsound|summon|tag|team|teammsg|teleport|tell|tellraw|tick|time|title|tm|tp|transfer|trigger|warden_spawn_tracker|weather|whitelist|worldborder|xp)\b/gm,
        'lookbehind': true
    },
    'selector': /@[anspre]/gm,
    'namespace': /\b\w+?:[\w\/\.]+/gm,
    'number': /\b\d+[bfdBFD]?\b/gm,
    'punctuation': /[~^\\]|\$\(|(?:\)(?<=$([^)]*)))/gm,
    'operator': /:|=|\+=|-=|\*=|%=|\/|<|>|><|entity|storage|block/gm,
    'boolean': /\b(?:false|true|1b|0b)\b/gm,
    'string': {
        'pattern': /(?:(^|[^\\])"(?:\\.|[^\\"\r\n:])*"(?!\s*:))|(?<=say).*|(?<=tag=)\w*/gm,
        'lookbehind': true,
        'greedy': true
    },
    'property': {
        'pattern': /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/gm,
        'lookbehind': true,
        'greedy': true
    },
    'variable': /\b(?:align|anchored|as|at|facing|in|on|positioned|rotated|store|summon|run|(?:if|unless)|modify|from|value)\b/gm,
    'function': {
        'pattern': /(?<=if|unless|result|success)\s(?:biome|block|blocks|data|dimension|entity|function|items|loaded|predicate|score)\b/gm,
        'lookbehind': true,
        'greedy': true
    },
    'symbol':{
        'pattern': /(?:#.+?\b)|(?<=@[anspre]\[(?:.*,)?).*?(?==)/gm,
        'lookbehind': true,
        'greedy': true
    } 
};

Prism.languages.mcf = {
    'comment': /^#.*/gm,
    'keyword': {
        'pattern': /(?<=run\s|^\s*?)(?:advancement|attribute|ban|ban-ip|banlist|bossbar|clear|clone|damage|data|datapack|debug|defaultgamemode|deop|difficulty|effect|enchant|execute|experience|fill|fillbiome|forceload|function|gamemode|gamerule|give|help|item|jfr|kick|kill|list|locate|loot|me|msg|op|pardon|pardon-ip|particle|perf|place|playsound|publish|random|recipe|reload|return|ride|rotate|save-all|save-off|save-on|say|schedule|scoreboard|seed|setblock|setidletimeout|setworldspawn|spawnpoint|spectate|spreadplayers|stop|stopsound|summon|tag|team|teammsg|teleport|tell|tellraw|tick|time|title|tm|tp|transfer|trigger|warden_spawn_tracker|weather|whitelist|worldborder|xp)\b/gm,
        'lookbehind': true
    },
    'selector': /@[anspre]/gm,
    'namespace': /\b\w+?:[\w\/\.]+/gm,
    'number': /\b\d+[bfdBFD]?\b/gm,
    'punctuation': /[~^\\]|\$\(|(?:\)(?<=$([^)]*)))/gm,
    'operator': /:|=|\+=|-=|\*=|%=|\/|<|>|><|entity|storage|block/gm,
    'boolean': /\b(?:false|true|1b|0b)\b/gm,
    'string': {
        'pattern': /(?:(^|[^\\])"(?:\\.|[^\\"\r\n:])*"(?!\s*:))|(?<=say).*|(?<=tag=)\w*/gm,
        'lookbehind': true,
        'greedy': true
    },
    'property': {
        'pattern': /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/gm,
        'lookbehind': true,
        'greedy': true
    },
    'variable': /\b(?:align|anchored|as|at|facing|in|on|positioned|rotated|store|summon|run|(?:if|unless)|modify|from|value)\b/gm,
    'function': {
        'pattern': /(?<=if|unless|result|success)\s(?:biome|block|blocks|data|dimension|entity|function|items|loaded|predicate|score)\b/gm,
        'lookbehind': true,
        'greedy': true
    },
    'symbol':{
        'pattern': /(?:#.+?\b)|(?<=@[anspre]\[(?:.*,)?).*?(?==)/gm,
        'lookbehind': true,
        'greedy': true
    } 
};