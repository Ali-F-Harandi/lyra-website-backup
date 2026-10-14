import pokedex from "/lyra-website-backup/scripts/pokemon/pokedex.js";
import gen1_settings from "/lyra-website-backup/scripts/pokemon/gen1/gen1_settings.js";

//Gen 1 Pokédex
export default class gen1_pokedex extends pokedex {
    constructor() {
        super(1, 151);
    }

    get nb_dex_states() {
        return new gen1_settings().nb_dex_states;
    }
}