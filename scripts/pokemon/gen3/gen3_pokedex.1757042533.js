import pokedex from "/lyra-website-backup/scripts/pokemon/pokedex.js";
import gen3_settings from "/lyra-website-backup/scripts/pokemon/gen3/gen3_settings.js";

//Gen 3 Pokédex
export default class gen3_pokedex extends pokedex {
    constructor() {
        super(3, 386);
    }

    get nb_dex_states() {
        return new gen3_settings().nb_dex_states;
    }
}