import pokedex from "/lyra-website-backup/scripts/pokemon/pokedex.js";
import gen2_settings from "/lyra-website-backup/scripts/pokemon/gen2/gen2_settings.js";

//Gen 2 Pokédex
export default class gen2_pokedex extends pokedex {
    constructor() {
        super(2, 251);
    }

    get nb_dex_states() {
        return new gen2_settings().nb_dex_states;
    }
}