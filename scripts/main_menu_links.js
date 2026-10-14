import gen1_settings from "/lyra-website-backup/scripts/pokemon/gen1/gen1_settings.js";

export default class main_menu_links {
    //update the URLs when loading the main menu
    static init_links() {
        //update the Gen 1 guide URL
        (new gen1_settings()).js_guide_version();
    }
}