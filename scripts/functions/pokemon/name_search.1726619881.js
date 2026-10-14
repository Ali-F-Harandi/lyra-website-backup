//allow searching for specific Pokémon names in the Pokémon info page
export default function name_search() {
    //function to filter the Pokémon according to the search
    const filter_function = (event) => {
        //get the current search
        let search = event.target.value.toLowerCase();

        //get all the Pokémon currently present on the page
        let pokemon_list = document.querySelectorAll("#pokemon_info > div:not(.caught)");

        //by default, check the Pokémon name
        let list_checked = ".pokemon_name";

        //no Pokémon displayed yet
        let pokemon_displayed = false;

        //if the search starts with a number
        if (/^[0-9]+/.test(search)) {
            //remove all the non-number elements
            search = search.replace(/\D/, '');

            //check the Pokémon number
            list_checked = ".pokemon_number";
        }

        //go through all the displayed Pokémon
        pokemon_list.forEach(element => {
            //get the number of the Pokémon
            let pokemon_number = element.querySelector(list_checked).textContent.toLowerCase();

            //hide the Pokémon who don't contain the given number
            if (!pokemon_number.includes(search)) {
                element.classList.add("hidden");
            }
            //display the rest of the Pokémon
            else {
                element.classList.remove("hidden");

                //a Pokémon has been displayed
                pokemon_displayed = true;
            }
        })

        //error message element
        let error_classes =  document.querySelector("#empty_search_message").classList;

        //no Pokémon is displayed
        if (!pokemon_displayed) {
            //show the error message
            error_classes.remove("hidden");
        }
        //a Pokémon is displayed
        else {
            //hide the error message
            error_classes.add("hidden");
        }
    }

    //use the function when the input is changed
    document.querySelector("#name_search_input").addEventListener("input", (event) => filter_function(event));
}
