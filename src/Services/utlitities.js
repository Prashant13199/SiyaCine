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

export const capitalizeWords = (str) => {
    return str
        .split(' ') // Split string into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
        .join(' '); // Join array elements back into a string
}