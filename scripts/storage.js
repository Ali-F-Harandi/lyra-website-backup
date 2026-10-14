//storage methods
export default class storage {
    //read the given storage item as a JS object
    static read(storage_name) {
        //read the given storage
        return JSON.parse(window.localStorage.getItem(storage_name));
    }

    //save the given storage item as a string
    static save(storage_name, item) {
        //save the given storage
        window.localStorage.setItem(storage_name, JSON.stringify(item));
    }

    //remove the given storage item from local storage
    static remove(storage_name) {
        window.localStorage.removeItem(storage_name);
    }

    //return contents for export
    static export(storage_name) {
        //read the contents of storage
        const storage_contents = this.read(storage_name);

        //there are contents to export
        if (storage_contents !== null) {
            //return the formatted data for export
            return {[storage_name]: storage_contents};
        }
        //return an empty object otherwise
        else {
            return {};
        }
    }

    //update the given string in a local storage array
    static update_array(storage_name, string) {
        //get the current array
        let current_array = this.read(storage_name);

        //there is no current array
        if (current_array == null) {
            //save the new array in local storage
            this.save(storage_name, [string]);
        }
        else {
            //find if the string is present or not
            const string_index = current_array.indexOf(string);

            //the string is present
            if (string_index >= 0) {
                //remove it from the array
                current_array.splice(string_index, 1);
            }
            //the string is not in the array
            else {
                //add the string
                current_array.push(string);

                //sort array
                current_array.sort();
            }

            //the array is now empty
            if (current_array.length === 0) {
                //remove it from local storage
                this.remove(storage_name);
            }
            else {
                //save array in local storage
                this.save(storage_name, current_array);
            }
        }
    }

    //remove given values from array and add one given
    static replace_array(storage_name, array_to_remove, string_to_add = "") {
        //get the current array
        let current_array = this.read(storage_name);

        //there is no current array
        if (current_array == null) {
            //there is a value to add
            if (string_to_add !== "") {
                //save the new array in local storage
                this.save(storage_name, [string_to_add]);
            }
        }
        else {
            //remove the given items from the current array
            current_array = current_array.filter(item => !array_to_remove.includes(item));

            //there is a value to add
            if (string_to_add !== "") {
                //add the string to the array
                current_array.push(string_to_add);
            }

            //the array is empty
            if (current_array.length === 0) {
                //remove it from local storage
                this.remove(storage_name);
            }
            else {
                //save array in local storage
                this.save(storage_name, current_array);
            }
        }
    }
}
