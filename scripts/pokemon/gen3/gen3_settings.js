import pokemon_settings from "/lyra-website-backup/scripts/pokemon/pokemon_settings.js";
import gen3_pokedex from "/lyra-website-backup/scripts/pokemon/gen3/gen3_pokedex.js";

export default class gen3_settings extends pokemon_settings {
    constructor() {
        super(3, "pokemon/colors/colors_pokemon_emerald");
    }

    get pokedex() {
        return new gen3_pokedex();
    }

    js_pokedex_selection() {
        this.abstract_pokedex_selection(["ruby_sapphire_emerald_dex", "firered_leafgreen_dex"]);
    }

    js_version_filter() {
        this.abstract_version_filter(["pref_ruby", "pref_sapphire", "pref_emerald", "pref_firered", "pref_leafgreen"]);
    }

    js_pokemon_sprites() {
        this.abstract_pokemon_sprites(["emerald_sprites", "rs_sprites", "frlg_sprites"]);
    }
}