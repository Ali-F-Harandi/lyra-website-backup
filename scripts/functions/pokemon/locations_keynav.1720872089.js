//set up the left and right keyboards keys to navigate in the Pokémon locations page
export default function locations_keynav(link_previous, link_next) {
    //when a keyboard key is pressed
    document.addEventListener("keydown", (event) => {
        //the left key was pressed and there is a previous location
        if (event.key === "ArrowLeft" && link_previous !== "") {
            //redirect to previous location
            window.location.assign(link_previous);
        }

        //the right key was pressed and there is a next location
        if (event.key === "ArrowRight" && link_next !== "") {
            //redirect to next location
            window.location.assign(link_next);
        }
    });
}