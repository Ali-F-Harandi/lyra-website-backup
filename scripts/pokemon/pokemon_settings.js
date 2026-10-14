import settings from "/lyra-website-backup/scripts/settings.js";
import num_from_id from "/lyra-website-backup/scripts/functions/num_from_id.js";

//Pokémon gen1 settings methods
export default class pokemon_settings extends settings {
    #gen;

    constructor(gen, default_color) {
        super("pokemon_gen" + gen + "_settings", "gen" + gen, default_color);

        this.#gen = gen;
    }

    //corresponding Pokédex
    get pokedex() {
        throw "get pokedex() - Abstract, must be implemented.";
    }

    //number of Pokédex states
    get nb_dex_states() {
        //the 3 state dex is enabled
        if(this.setting_on("three_state_dex")) {
            return 3;
        }
        //normal dex
        else {
            return 2;
        }
    }

    //guide selection setting
    abstract_guide_version(guide_options) {
        this.select_setting_with_refresh("guide_version", `pokemon_gen${this.#gen}/full_guide`, "_guide", guide_options);
    }

    //display selected Pokédex
    abstract_pokedex_selection(pokedex_options) {
        //add the default 2 Pokédexes
        const final_options = ["national_dex", ...pokedex_options, "only_new_dex"];

        this.select_setting_with_refresh("pokedex_selection", "pokedex_tracker", "_dex", final_options);
    }

    //filter catch location version tables
    abstract_version_filter(filter_options) {
        //add the default option
        const final_options = ["pref_none", ...filter_options];

        //function to display only the preferred version's table if it is displayed
        const display_only_preferred = (preferred_version) => {
            //get the catch location tables elements
            const tables_elems = document.querySelectorAll("#location_detail > div")

            //the catch location tables are currently displayed
            if (tables_elems.length > 0) {
                //show all the tables
                for (let table_elem of tables_elems) {
                    table_elem.classList.remove("hidden");
                }

                //a preferred version has been set
                if (preferred_version !== "pref_none") {
                    //save the current preferred version
                    const version_to_show = preferred_version.slice(5);

                    //the preferred version is currently being displayed
                    if (document.querySelector("#location_detail h2."+version_to_show)) {
                        //go through all the displayed catch tables
                        for (let table_elem of tables_elems) {
                            //show the preferred table
                            if (table_elem.querySelector("h2."+version_to_show)) {
                                table_elem.classList.remove("hidden");
                            }
                            //hide the other tables
                            else {
                                table_elem.classList.add("hidden");
                            }
                        }
                    }
                }
            }
        }

        //get the current selection
        const preselection = this.setting_array_on(final_options);

        //toggle catch location table on selection
        this.initialize_select_setting("version_filter", (preferred_version) => display_only_preferred(preferred_version), final_options, preselection);
    }

    //Pokémon sprites selection setting
    abstract_pokemon_sprites(sprites_options) {
        //function to change the currently displayed sprites
        const update_sprites = (sprites_selected) => {
            //clean the selection given
            const selection = sprites_selected.replace("_sprites", "");

            //Regex that looks for the "pokedex_" folder
            const folder_regex = /pokedex_[^\/]+/;

            //get the sprites currently displayed
            document.querySelectorAll(".pokemon_card img")
                .forEach(img => {
                    //replace the image folder by the one selected
                    img.src = img.src.replace(folder_regex, "pokedex_" + selection);
                })
        }

        //get the current selection
        const preselection = this.setting_array_on(sprites_options);

        //change the currently displayed sprites on selection
        this.initialize_select_setting("pokemon_sprites", update_sprites, sprites_options, preselection)
    }

    //three state Pokédex setting
    js_three_state_dex() {
        //toggle the state of the Pokédex on button press
        this.initialize_button_setting("three_state_dex", () => this.pokedex.toggle_states(), false);
    }

    //Pokédex progress setting
    js_pokedex_progress_numbers() {
        //toggle progress display on button press
        this.initialize_button_setting("pokedex_progress_numbers", () => this.toggle_display(document.querySelectorAll("#pokedex #pokedex_progress")));
    }

    //Pokédex tracker box names
    js_box_names() {
        //function to display the selected box names
        const change_boxes_display = (selected_option) => {
            //select the Pokédex element
            const dex_elem = document.querySelector("#pokedex");

            //the Pokédex tracker is currently displayed
            if (dex_elem) {
                //we need to hide the box names
                if (selected_option === "boxes_hidden") {
                    //boxes are shown
                    if (!dex_elem.classList.contains("no_boxes")) {
                        //get the hidden box container
                        const contain_elem = document.querySelector("#hidden_boxes");
                        //get all the box elements
                        const box_elems = dex_elem.querySelectorAll(".pokedex_box");

                        //go through all the boxes
                        for (let i = 0; i < box_elems.length; i++) {
                            //get the Pokémon inside the box
                            const pkmn_elems = box_elems[i].querySelectorAll(".pokemon_card");

                            //go through all the elements in the box
                            for (let j = 0; j < pkmn_elems.length; j++) {
                                //move the Pokémon into the Pokédex element
                                dex_elem.appendChild(pkmn_elems[j]);
                            }
                            //hide the current box
                            contain_elem.append(box_elems[i]);

                        }
                        //indicate boxes are now hidden
                        dex_elem.classList.add("no_boxes");
                    }
                }
                //we need to show the box names
                else if (selected_option === "boxes_order" || selected_option === "boxes_firstlast") {
                    //boxes are hidden
                    if (dex_elem.classList.contains("no_boxes")) {
                        //get all the Pokémon
                        const pkmn_elems = dex_elem.querySelectorAll(".pokemon_card");
                        //get all the hidden boxes
                        const box_elems = dex_elem
                            .querySelector("#hidden_boxes")
                            .querySelectorAll(".pokedex_box");

                        //calculate the number of Pokémon per box
                        const box_size = Math.ceil(pkmn_elems.length / box_elems.length / 10) * 10;

                        //while there are boxes to fill
                        for (let i = 0; i < box_elems.length; i++) {
                            //display the box
                            dex_elem.append(box_elems[i]);

                            //while there are Pokémon to add
                            for (let j = i * box_size;
                                 j < (i+1) * box_size && j < pkmn_elems.length;
                                 j++) {
                                //add the Pokémon to the box
                                box_elems[i].append(pkmn_elems[j]);
                            }
                        }

                        //indicate the boxes are now displayed
                        dex_elem.classList.remove("no_boxes");
                    }

                    //get the box names
                    const box_names_order = dex_elem.querySelectorAll(".box_name_order");
                    const box_names_firstlast = dex_elem.querySelectorAll(".box_name_firstlast");

                    //show the box order names
                    if (selected_option === "boxes_order") {
                        //the box order names are not already displayed
                        if (box_names_order[0].classList.contains("hidden")) {
                            //display the box order names
                            this.toggle_display(box_names_order);
                            //hide the box first last names
                            this.toggle_display(box_names_firstlast);
                        }
                    }
                    else {
                        //the box first last names are not already displayed
                        if (box_names_firstlast[0].classList.contains("hidden")) {
                            //display the box first last names
                            this.toggle_display(box_names_firstlast);
                            //hide the box order names
                            this.toggle_display(box_names_order);
                        }
                    }
                }
            }
        }

        //box names selection options
        const selection_options = ["boxes_order", "boxes_firstlast", "boxes_hidden"];

        //get the current box name selected
        const preselection = this.setting_array_on(selection_options);

        //toggle box names display or change on selection
        this.initialize_select_setting("box_names", (selected_option) => change_boxes_display(selected_option), selection_options, preselection);
    }

    //small Pokédex tracker setting
    js_small_pokedex() {
        //toggle Pokédex size on button press
        this.initialize_button_setting("small_pokedex", () => this.toggle_class(document.querySelectorAll("#pokedex"), "small"));
    }

    //use regional Pokédex setting
    js_regional_pokedex() {
        //function to update a link to regional or remove it
        const update_link = (link, to_regional) => {
            //check if the link is already sending to regional
            const link_regional = link.endsWith("/regional");

            //add regional
            if (to_regional && !link_regional) {
                return link + "/regional";
            }
            //remove regional
            else if (!to_regional && link_regional) {
                return link.slice(0, -9);
            }
            //no changes
            else {
                return link;
            }
        }

        //the regional dex is enabled
        if (this.setting_on("regional_pokedex")) {
            //update the page links
            document.querySelectorAll("a[href*='pokedex_tracker']").forEach(elem => elem.href = update_link(elem.href, true));
        }

        //save the original path name
        const original_location = window.location;

        //function to toggle the regional Pokédex links and changes pages if necessary
        const toggle_regional = () => {
            //get the Pokédex tracker links
            const link_elems = document.querySelectorAll("a[href*='pokedex_tracker']");
            //save the current Pokédex tracker link
            const tracker_link = link_elems[link_elems.length-1].href;

            //the regional dex is enabled
            if (tracker_link.endsWith("/regional")) {
                //we are currently in the regional Pokédex tracker
                if (original_location.pathname.includes("pokedex_tracker/regional")) {
                    //send to national Pokédex
                    window.location.assign(update_link(tracker_link, false));
                }

                //disable it
                link_elems.forEach(elem => elem.href = update_link(elem.href, false));
            }
            //the regional dex is disabled
            else {
                //we are currently in the national Pokédex tracker
                if (original_location.pathname.includes("pokedex_tracker") && !original_location.pathname.includes("/regional")) {
                    //send to regional Pokédex
                    window.location.assign(update_link(tracker_link, true));
                }

                //enable it
                link_elems.forEach(elem => elem.href = update_link(elem.href, true));
            }
        }

        //toggle Pokédex types on button press
        this.initialize_button_setting("regional_pokedex", () => toggle_regional(), false);
    }

    //ignore Old and Good Rod catch data setting
    js_ignore_lowlevel_rods() {
        //toggle display function
        const toggle_lowlevel_rods_function = () => {
            //hide all the empty error messages
            document.querySelectorAll("#location_detail tr:has(td.empty):not(.hidden)").forEach(element => element.classList.add("hidden"));

            //toggle the low level rods
            this.toggle_display(document.querySelectorAll(".fishing_old, .fishing_good"));

            //go through all the tables
            document.querySelectorAll("#location_detail div table").forEach(table_element => {
                //get the number of displayed rows (not counting the error one)
                const displayed_rows = table_element.querySelectorAll("tbody tr:not(.hidden):not(:has(td.empty))");

                //not rows are displayed
                if (displayed_rows.length === 0) {
                    //show the error message
                    table_element.querySelector("tr:has(td.empty)").classList.remove("hidden");
                }
            })
        }

        //toggle Old and Good Rod data on button press
        this.initialize_button_setting("ignore_lowlevel_rods", toggle_lowlevel_rods_function);
    }

    //hide caught Pokémon info setting
    js_hide_caught_info() {
        //function to toggle the Pokémon info of currently caught Pokémon
        const toggle_caught_info = () => {
            //the Pokémon info is currently displayed
            if (document.querySelector("#pokemon_info")) {
                //toggle all the elements when all the Pokémon are caught
                const toggle_all_caught = () => {
                    this.toggle_display(document.querySelector("#pokemon_info_extra"));
                    this.toggle_display(document.querySelector("#empty_caught_message"));
                    this.toggle_class(document.querySelector("#empty_search_message"), "all_caught");
                }

                //there are Pokémon currently caught
                if(document.querySelector("#pokemon_info > div.caught")) {
                    //all the Pokémon were caught
                    if(!document.querySelector("#empty_caught_message.hidden")) {
                        //display the quick search function and hide the error message
                        toggle_all_caught();
                    }

                    //show all the hidden Pokémon
                    this.toggle_class(document.querySelectorAll("#pokemon_info > div.caught"), "caught");
                }
                //there are Pokémon to hide
                else {
                    //go through all the Pokémon info
                    document.querySelectorAll("#pokemon_info > div").forEach(elem => {
                        //the Pokémon is caught
                        if (this.pokedex.is_caught(num_from_id(elem.id))) {
                            //hide the Pokémon info
                            this.toggle_class(elem, "caught");
                        }
                    });

                    //all the Pokémon are caught
                    if(!document.querySelector("#pokemon_info > div:not(.caught)")) {
                        //hide the quick search function and show the error message
                        toggle_all_caught();
                    }
                }
            }
        }

        //toggle caught info data on button press
        this.initialize_button_setting("hide_caught_info", () => toggle_caught_info());
    }

    //import and export buttons
    js_import_export(language) {
        //select the textarea used for import/export
        const textarea_elem = document.querySelector("#import_export textarea");

        //function to export data
        const export_data = () => {
            //display export text in the text area
            textarea_elem.value = JSON.stringify({...this.export, ...this.pokedex.guide_export, ...this.pokedex.export});
        }

        //function to import data
        const import_data = () => {
            //there is text to import
            if (textarea_elem.value) {
                //get the text written in text area
                const import_text = JSON.parse(textarea_elem.value);

                //confirmation text depending on language
                const confirm_text = language === "fr" ?
                    "Importer des données écrase les données précédentes de manière irréversible. Continuer ?" :
                    "Importing will overwrite the previous data. This process is irreversible. Continue?";

                //ask for confirmation
                if (confirm(confirm_text)) {
                    //import the settings
                    this.import(import_text);

                    //import the guide
                    this.pokedex.guide_import(import_text);

                    //import the Pokédex
                    this.pokedex.import(import_text);

                    //refresh the page
                    window.location.reload();
                }
            }
        }

        //add the functions to their buttons
        document.querySelector("#import_export #btn_export").addEventListener("pointerdown", export_data);
        document.querySelector("#import_export #btn_import").addEventListener("pointerdown", import_data);

        //select the export text
        document.querySelector("#import_export #btn_export").addEventListener("pointerup", () => textarea_elem.select());
    }
}