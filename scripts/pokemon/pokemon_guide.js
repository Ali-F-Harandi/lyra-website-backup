import storage from "/lyra-website-backup/scripts/storage.js";
import num_from_id from "/lyra-website-backup/scripts/functions/num_from_id.js";

//guide methods
export default class pokemon_guide {
    #storage_name;
    #pokedex;
    #guide_progress;

    constructor(pokedex) {
        this.#pokedex = pokedex;
        this.#storage_name = "pokemon_gen" + this.#pokedex.generation + "_guide";

        //get the current guide progression
        this.#guide_progress = storage.read(this.#storage_name);

        //there is no current guide progression
        if (this.#guide_progress == null) {
            //create it
            this.#guide_progress = [];
        }
    }

    //contents for export
    get export() {
        return storage.export(this.#storage_name);
    }

    //import data into guide
    import(import_data) {
        //there is guide data
        if (this.#storage_name in import_data) {
            //check if the data contains guide data
            if (Array.isArray(import_data[this.#storage_name])) {
                //import the data in local storage
                storage.save(this.#storage_name, import_data[this.#storage_name]);
            }
        }
        //no guide data
        else {
            //erase the current guide data
            storage.remove(this.#storage_name);
        }
    }

    //initialize checkboxes events, guide progress and set up the list elements widths
    initialize_guide() {
        //go through all checkboxes
        document.querySelectorAll("input[type='checkbox']").forEach((element) => {
            //checkbox of a Pokémon capture
            if (element.id.startsWith("pkmn_")) {
                //event to update the Pokédex when checked
                element.addEventListener("change", this.#interact_update_pokedex.bind(this));

                //the Pokémon is caught
                if (this.#pokedex.is_caught(num_from_id(element.id))) {
                    //pre-check the box
                    element.checked = true;
                }
            }
            //checkbox of guide progress
            else {
                //event to update the progress when checked
                element.addEventListener("change", this.#interact_update_step.bind(this));

                //the step is completed
                if (this.#guide_progress.includes(element.id)) {
                    //pre-check the box
                    element.checked = true;
                }
            }
        })

        //display the hidden step if needed
        this.#hidden_step_check();

        /* TODO
        In order to make text better and more compact
        //go through all the list elements
        document.querySelectorAll("#guide_full li").forEach(elem => {
            //get the number of segments necessary for the element
            let nb_segments = Math.floor(elem.offsetWidth / 368) + 1;

            //get the element the corresponding class
            elem.classList.add("size" + nb_segments);
        });
        */
    }

    //update the Pokédex when clicking on the checkbox
    #interact_update_pokedex(event) {
        //update the Pokémon's state in the Pokédex
        this.#pokedex.update_state(num_from_id(event.target.id), true);

        //display the hidden step if needed
        this.#hidden_step_check();
    }

    //update the guide progression when clicking on the checkbox
    #interact_update_step(event) {
        //update the current progression
        storage.update_array(this.#storage_name, event.target.id);

        //display the hidden step if needed
        this.#hidden_step_check();
    }

    //toggle the hidden step
    #hidden_step_check() {
        //the hidden step exists in the guide
        if (document.querySelector("#completion")) {
            //the Pokédex is complete
            if (this.#pokedex.completed) {
                //display the hidden step
                document.querySelector("#completion").classList.remove("hidden");
            } else {
                //hide the hidden step
                document.querySelector("#completion").classList.add("hidden");
            }
        }
    }
}