import pokedex from "/lyra-website-backup/scripts/pokemon/pokedex.js";
import gen4_settings from "/lyra-website-backup/scripts/pokemon/gen4/gen4_settings.js";

//Gen 3 Pokédex
export default class gen4_pokedex extends pokedex {
    constructor() {
        super(4, 493);
    }

    get nb_dex_states() {
        return new gen4_settings().nb_dex_states;
    }
}