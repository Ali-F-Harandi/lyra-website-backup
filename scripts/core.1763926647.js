"use strict";

function init_style(current_website) {
    //get the current saved color theme data
    const saved_style = JSON.parse(window.localStorage.getItem("saved_colors"));

    //there are color themes saved
    if (saved_style != null) {
        //there is a color theme for the current website
        if (current_website in saved_style) {
            //update the colors css file
            document.querySelector("#colors_sheet").href = "/lyra-website-backup/styles/" + saved_style[current_website] + ".css";
        }
    }
}