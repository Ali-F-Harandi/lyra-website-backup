//reload a page and add the currently selected option id as a URL get
export default function select_reload(link, event) {
    //get the selected option id
    const id = event.target.value;

    //get the new page url
    const new_url = link + "/" + id;

    //load the new page
    window.location.assign(new_url);
}