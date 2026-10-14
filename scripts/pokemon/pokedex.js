import storage from "/lyra-website-backup/scripts/storage.js";
import pokemon_guide from "/lyra-website-backup/scripts/pokemon/pokemon_guide.js";
import num_from_id from "/lyra-website-backup/scripts/functions/num_from_id.js";

//Pokédex methods
export default class pokedex {
    generation;
    nb_pokemon;
    #pokedex_array;
    #storage_name;
    #_mid_caught = "mid_caught";
    #_caught = "caught";

    constructor(generation, nb_pokemon, unique_storage_name = "") {
        this.generation = generation;
        this.nb_pokemon = nb_pokemon;
        this.#storage_name = unique_storage_name === "" ?
            "pokemon_gen" + this.generation + "_pokedex" : unique_storage_name;

        //get the Pokédex from storage
        this.#load();

        //there is no Pokédex
        if (this.#pokedex_array === null) {
            //create the Pokédex and fill it with uncaught Pokémon
            this.#pokedex_array = Array(nb_pokemon).fill(0);

            //save the Pokédex
            this.#save();
        }
    }

    //number of Pokédex states
    get nb_dex_states() {
        throw "get nb_dex_states() - Abstract, must be implemented.";
    }

    //guide text for export
    get guide_export() {
        return new pokemon_guide(this).export;
    }

    //import into guide
    guide_import(import_data) {
        return new pokemon_guide(this).import(import_data);
    }

    //contents for export
    get export() {
        return storage.export(this.#storage_name);
    }

    //import the Pokédex
    import(import_data) {
        //check if data contains Pokédex data
        if (Array.isArray(import_data[this.#storage_name])) {
            //get the given Pokédex
            let import_pokedex = import_data[this.#storage_name];

            //the Pokédex given does not contain enough Pokémon
            if (import_pokedex.length < this.nb_pokemon) {
                //add extra Pokémon
                for (let i = import_pokedex.length; i < this.nb_pokemon; i++) {
                    import_pokedex.push(0);
                }
            }
            //the Pokédex given contains too many Pokémon
            if (import_pokedex.length > this.nb_pokemon) {
                //remove the surplus
                import_pokedex = import_pokedex.slice(0, this.nb_pokemon-1);
            }
            //the Pokédex given contains too little Pokémon
            else if (import_pokedex.length < this.nb_pokemon) {
                //add Pokémon until it is full
                while (import_pokedex.length < this.nb_pokemon) {
                    import_pokedex.push(0);
                }
            }

            //replace the current Pokédex with the imported one
            this.#pokedex_array = import_pokedex;

            //save the new Pokédex in local storage
            this.#save();
        }
    }

    //load the Pokédex from local storage
    #load() {
        this.#pokedex_array = storage.read(this.#storage_name);
    }

    //save the Pokédex into local storage
    #save() {
        storage.save(this.#storage_name, this.#pokedex_array);
    }

    //add events and show the correct catch state on the Pokédex tracker
    initialize_tracker() {
        //function to update the graphical appearance of the given Pokémon element
        const update_class = (element, state) => {
            //the pokémon is not caught
            if (state === 0) {
                element.classList.remove(this.#_mid_caught, this.#_caught);
            }
            //the Pokémon is caught
            else if (state >= (this.nb_dex_states - 1)) {
                element.classList.add(this.#_caught);
                element.classList.remove(this.#_mid_caught);
            }
            //the Pokémon is in a middle state
            else {
                element.classList.add(this.#_mid_caught);
                element.classList.remove(this.#_caught);
            }
        }

        //callback function to change a Pokémon's caught state in the Pokédex tracker
        const interact_change_state = (event) => {
            //get the Pokémon element
            const target = event.target;

            //get the pokémon number to change
            const pokemon_number = num_from_id(target.id);

            //update the state in the Pokédex
            this.update_state(pokemon_number);

            //update the graphical appearance
            update_class(target, this.#pokedex_array[pokemon_number - 1])

            //update the progress counter
            this.#update_progress();
        }

        //go through all the Pokémon in the Pokédex tracker
        document.querySelectorAll(".pokemon_card").forEach((element) => {
            //add selection event to Pokédex entry
            element.addEventListener("pointerdown", interact_change_state.bind(this));

            //initialize the graphical appearance of the Pokémon
            update_class(element, this.#pokedex_array[num_from_id(element.id) - 1]);

            //initialize the progress counter
            this.#update_progress();
        });
    }

    //update the state of a given Pokémon
    update_state(pokemon_number, to_caught = false) {
        //load the Pokédex
        this.#load();

        //the Pokémon is not caught yet and needs to be
        if (this.#pokedex_array[pokemon_number - 1] === 0 && to_caught) {
            //Pokémon caught
            this.#pokedex_array[pokemon_number - 1] = this.nb_dex_states - 1;
        } else {
            //update the caught state in the Pokédex
            this.#pokedex_array[pokemon_number - 1]++;

            //reset to the lowest state number if necessary
            if (this.#pokedex_array[pokemon_number - 1] >= this.nb_dex_states) {
                this.#pokedex_array[pokemon_number - 1] = 0;
            }
        }

        //save the Pokédex
        this.#save();
    }

    //update the Pokédex progress text
    #update_progress() {
        //get the progress counter
        const counter = document.querySelector("#nb_progress");

        //the counter is present in the page
        if (counter) {
            //count the number of caught and mid caught Pokémon
            const caught = document.querySelectorAll("."+this.#_caught).length;
            const mid_caught = document.querySelectorAll("."+this.#_mid_caught).length;

            //write the new progress text
            counter.innerText = mid_caught > 0 ? `${caught} (+  ${mid_caught})` : caught;
        }
    }

    //return the status of the given Pokémon
    is_caught(pokemon_number) {
        return this.#pokedex_array[pokemon_number - 1] > 0;
    }

    //return the completion state of the Pokédex
    get completed() {
        //every state is the maximum number of states or not
        return this.#pokedex_array.every(state => state >= (this.nb_dex_states-1));
    }

    //toggle the pokédex between two and three states
    toggle_states() {
        //load the Pokédex
        this.#load();

        //from 2 to 3 states
        if (this.nb_dex_states === 3) {
            //every Pokémon caught is updated
            this.#pokedex_array.forEach((state, index) => {
                if (state === 1) { this.#pokedex_array[index] = 2; }
            })
        }
        //from 3 to 2 states
        else {
            //every mid Pokémon is considered caught, update the caught
            this.#pokedex_array.forEach((state, index) => {
                if (state === 2) {
                    this.#pokedex_array[index] = 1;
                }
            })

            //the Pokédex is currently displayed
            if (document.querySelector("#pokedex")) {
                //get all the Pokémon previously mid caught
                document.querySelectorAll("."+this.#_mid_caught).forEach(elem => {
                    //update their display to fully caught
                    elem.classList.add(this.#_caught);
                    elem.classList.remove(this.#_mid_caught);
                })

                //update the progress counter
                this.#update_progress();
            }
        }

        //save the Pokédex
        this.#save();
    }
}