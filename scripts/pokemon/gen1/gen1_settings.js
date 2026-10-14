import pokemon_settings from "/lyra-website-backup/scripts/pokemon/pokemon_settings.js";
import gen1_pokedex from "/lyra-website-backup/scripts/pokemon/gen1/gen1_pokedex.js";

export default class gen1_settings extends pokemon_settings {
    constructor() {
        super(1, "pokemon/colors/colors_pokemon_red");
    }

    get pokedex() {
        return new gen1_pokedex();
    }

    js_version_filter() {
        this.abstract_version_filter(["pref_red", "pref_blue", "pref_yellow"]);
    }

    js_guide_version() {
        this.abstract_guide_version(["red_guide", "blue_guide", "yellow_guide"]);
    }

    js_pokemon_sprites() {
        this.abstract_pokemon_sprites(["rb_sprites", "y_sprites", "rg_sprites"]);
    }
}