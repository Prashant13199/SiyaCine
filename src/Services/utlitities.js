import { database } from "../firebase"
export const getUsername = (id) => {
    let name = ""
    database.ref(`/Users/${id}`).on('value', snapshot => {
        name = snapshot.val()?.username
    })
    return name;
}

export const getTimeLeft = (duration) => {
    let hr = Math.floor(duration / 3600)
    let min = Math.floor((duration % 3600) / 60)
    if (hr > 0) {
        return `${hr}h ${min}m`
    } else {
        return `${min}m`
    }
}