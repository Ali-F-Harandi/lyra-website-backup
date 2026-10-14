import pokemon_settings from "/lyra-website-backup/scripts/pokemon/pokemon_settings.js";
import gen2_pokedex from "/lyra-website-backup/scripts/pokemon/gen2/gen2_pokedex.js";

export default class gen2_settings extends pokemon_settings {
    constructor() {
        super(2, "pokemon/colors/colors_pokemon_gold");
    }

    get pokedex() {
        return new gen2_pokedex();
    }

    js_pokedex_selection() {
        this.abstract_pokedex_selection(["regional_dex"])
    }

    js_version_filter() {
        this.abstract_version_filter(["pref_gold", "pref_silver", "pref_crystal"]);
    }

    js_pokemon_sprites() {
        this.abstract_pokemon_sprites(["crystal_sprites", "crystal_anim_sprites", "gold_sprites", "silver_sprites"]);
    }
}