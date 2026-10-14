//get the number from the id given
export default function num_from_id(id) {
    //get only the number from the id
    const num = id.match(/\d+$/);

    //return an integer
    return parseInt(num[0]);
}