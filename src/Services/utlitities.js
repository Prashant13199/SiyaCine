import { database } from "../firebase"
export const getUsername = (id) => {
    let name = ""
    database.ref(`/Users/${id}`).on('value', snapshot => {
        name = snapshot.val()?.username
    })
    return name;
}