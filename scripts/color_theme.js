import storage from "/lyra-website-backup/scripts/storage.js";

//color theme methods
export default class color_theme {
    static storage_name = "saved_colors";

    //get the currently saved color themes
    static get saved_color_themes() {
        //get the saved color theme data
        const saved_colors = storage.read(this.storage_name);

        //there are no color themes
        if (saved_colors === null) {
            //return empty object
            return {};
        }

        //return the color theme data
        return saved_colors;
    }

    //change the currently displayed theme
    static change_color_theme(website, color_theme_id) {
        //get the currently saved color themes
        let current_color_themes = this.saved_color_themes;

        //add/change the one given
        current_color_themes[website] = color_theme_id;

        //save the color themes
        storage.save(this.storage_name, current_color_themes);

        //update the current color theme css
        document.querySelector("#colors_sheet").href = "/lyra-website-backup/styles/" + this.saved_color_themes[website] + ".css";
    }
}