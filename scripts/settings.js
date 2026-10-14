import storage from "/lyra-website-backup/scripts/storage.js";
import color_theme from "/lyra-website-backup/scripts/color_theme.js";

//settings methods
export default class settings {
    #storage_name;
    colors_id;
    default_color;

    #on = "btn_on";
    #off = "btn_off";

    constructor(storage_name, colors_id, default_color) {
        this.#storage_name = storage_name;
        this.colors_id = colors_id;
        this.default_color = default_color;
    }

    //contents for export
    get export() {
        return storage.export(this.#storage_name);
    }

    //import data
    import(import_data) {
        //check if the data contains settings data
        if (Array.isArray(import_data[this.#storage_name])) {
            //import the data in local storage
            storage.save(this.#storage_name, import_data[this.#storage_name]);
        }
    }

    //check if given setting is on
    setting_on(setting_name) {
        //get the list of current settings in local storage
        const current_settings = storage.read(this.#storage_name);

        //there are no settings currently saved
        if (current_settings === null) {
            //the setting is off
            return false;
        }
        else {
            //the setting is on or off
            return current_settings.includes(setting_name);
        }
    }

    //check if any of the settings given are on
    setting_array_on(settings_array_to_check) {
        //save the given array
        let array_to_check = [...settings_array_to_check];

        //save the default setting from the array
        const array_default = array_to_check.shift();

        //get the list of the current settings in local storage
        const current_settings = storage.read(this.#storage_name);

        //there are no settings currently saved
        if (current_settings === null) {
            //return the default setting
            return array_default;
        }
        else {
            //go through the array
            for (let setting_to_check of array_to_check) {
                //the setting is currently on
                if (current_settings.includes(setting_to_check)) {
                    //return the setting currently on
                    return setting_to_check;
                }
            }

            //return the default setting if none of the settings are on
            return array_default;
        }
    }

    //initialize the button that toggles the settings menu
    initialize_link() {
        //function to toggle the display of the settings menu
        const settings_toggle = () => {
            //toggle the menu
            this.toggle_display(document.querySelector("#settings_menu"))
            //toggle the appearance of the settings button
            this.toggle_class(document.querySelector("#settings_link"), "active");
        }

        //add an event to the settings link that toggles it
        document.querySelector("#settings_link").addEventListener("pointerdown", () => settings_toggle());
    }

    //color theme setting
    js_color_theme() {
        //default selected color theme
        let selected_color = this.default_color;

        //get the list of website colors
        const current_colors = color_theme.saved_color_themes;
        //there is a color theme for the current website
        if (this.colors_id in current_colors) {
            //preselect the corresponding option
            selected_color = current_colors[this.colors_id];
        }

        //get the select element
        const select_elem = document.querySelector("#select_color_theme");

        //preselect the currently displayed option
        select_elem.value = selected_color;

        //add an event to the select to modify color theme on option change
        select_elem.addEventListener("change", (event) => color_theme.change_color_theme(this.colors_id, event.target.value));
    }

    //initialize select setting display and function
    initialize_select_setting(id, setting_function, options_array, selected, init_call = true) {
        //get the select element
        const select_elem = document.querySelector("#select_"+id);

        //the element exists
        if (select_elem !== null) {
            //preselection
            select_elem.value = selected;

            //call the setting function if needed
            if (init_call) {
                setting_function(selected);
            }

            //callback function when the selection changes
            const callback = (event) => {
                //only set the new storage value if it is not the default
                const new_storage_value = event.target.value !== options_array[0] ?
                    event.target.value : "";

                //update setting in local storage
                storage.replace_array(this.#storage_name, options_array, new_storage_value);

                //call the function with the new selection
                setting_function(event.target.value);
            }

            //bind this in the function
            const select_function = callback.bind(this);

            //add an event to the select
            select_elem.addEventListener("change", select_function);
        }
    }

    //create select setting with page refresh
    select_setting_with_refresh(setting_id, url_text, suffix, selection_options) {
        //generate a new url based on the current one and the selection
        const get_updated_url = (old_url, selection) => {
            //get the clean selection by removing the suffix
            const clean_selection = selection.replace(suffix, "");

            //get the original url
            const base_regex = new RegExp(`.*${url_text}`);
            const base_url = old_url.match(base_regex);

            //return the updated url (or old one if none is found)
            return base_url ? (base_url[0] + "/" + clean_selection) : old_url;
        }

        //update all the links in the DOM
        const update_dom_links = (current_selection) => {
            document
                .querySelectorAll(`a[href*='${url_text}']`)
                .forEach(elem => elem.href = get_updated_url(elem.href, current_selection));
        }

        //get the initial selection
        const preselection = this.setting_array_on(selection_options);

        //update the links
        update_dom_links(preselection);

        //function to use when the setting is changed
        const select_function = (selected_index) => {
            //get the exact URL we should be at
            const target_url = get_updated_url(window.location.pathname, selected_index);

            //the page is currently displayed, but it is the wrong version
            if (window.location.pathname.includes(url_text) && window.location.pathname !== target_url) {
                //reload the new page
                window.location.assign(get_updated_url(window.location.pathname, selected_index));
            }
            else {
                //update the current links
                update_dom_links(selected_index);
            }
        }

        //initialize settings element
        this.initialize_select_setting(setting_id, select_function, selection_options, preselection, false)
    }

    //initialize button setting display and function
    initialize_button_setting(id, setting_function, init_call = true) {
        //get the button element
        const btn_elem = document.querySelector("#btn_"+id);

        //the setting is currently on
        if (this.setting_on(id)) {
            //turn the button display on
            btn_elem.className = this.#on;

            //call the setting function if needed
            if (init_call) {
                setting_function();
            }
        }

        //callback function when the button is clicked
        const callback = (event) => {
            //update setting in local storage
            storage.update_array(this.#storage_name, id);

            //toggle button appearance
            event.target.className === this.#off ?
                event.target.className = this.#on :
                event.target.className = this.#off;

            //call the setting function
            setting_function();
        }

        //bind this in the function
        const btn_function = callback.bind(this);

        //add an event to the button
        btn_elem.addEventListener("pointerdown", btn_function);
    }

    //toggle visibility of a list of elements
    toggle_display(elements) {
        this.toggle_class(elements, "hidden");
    }

    //toggle the class of a list of elements
    toggle_class(elements, class_to_toggle) {
        //an element is sent directly
        if (!NodeList.prototype.isPrototypeOf(elements)) {
            //insert the element into an array
            elements = [elements];
        }

        //go through the list of elements
        elements.forEach(element => {
            //toggle the visibility of the element
            element.classList.contains(class_to_toggle) ?
                element.classList.remove(class_to_toggle) :
                element.classList.add(class_to_toggle);
        });
    }
}