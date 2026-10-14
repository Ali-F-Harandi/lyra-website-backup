import pokemon_settings from "/lyra-website-backup/scripts/pokemon/pokemon_settings.js";
import gen4_pokedex from "/lyra-website-backup/scripts/pokemon/gen4/gen4_pokedex.js";

export default class gen4_settings extends pokemon_settings {
    constructor() {
        super(4, "pokemon/colors/colors_pokemon_diamond");
    }

    get pokedex() {
        return new gen4_pokedex();
    }

    js_pokedex_selection() {
        this.abstract_pokedex_selection(["diamond_pearl_dex", "platinum_dex", "heartgold_soulsilver_dex"]);
    }

    js_version_filter() {
        this.abstract_version_filter(["pref_diamond", "pref_pearl", "pref_platinum", "pref_heartgold", "pref_soulsilver"]);
    }

    js_pokemon_sprites() {
        this.abstract_pokemon_sprites(["hgss_sprites", "dp_sprites", "plat_sprites"]);
    }
}