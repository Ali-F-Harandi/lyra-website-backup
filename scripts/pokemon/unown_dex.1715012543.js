import pokedex from "/lyra-website-backup/scripts/pokemon/pokedex.js";

//Unown Dex methods
export default class unown_dex extends pokedex {
    constructor(generation) {
        //number of Unown is 26 in Gen 2 only
        const nb_unown = generation === 2 ? 26 : 28;

        super(generation, nb_unown, "unown_dex_gen" + generation)
    }

    get nb_dex_states() {
        return 2;
    }
}