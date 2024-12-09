export function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h " + rminutes + "m";
}

export function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero if needed
    return `${year}-${month}-${day}`;
}

export const timeDifference = (current, previous) => {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (Math.round(elapsed / msPerDay) === 1) {
            return " just now";
        }
        return " just now";
    } else if (elapsed < msPerHour) {
        if (Math.round(elapsed / msPerMinute) === 1) {
            return Math.round(elapsed / msPerMinute) + " min ago";
        }
        return Math.round(elapsed / msPerMinute) + " mins ago";
    } else if (elapsed < msPerDay) {
        if (Math.round(elapsed / msPerHour) === 1) {
            return Math.round(elapsed / msPerHour) + " hr ago";
        }
        return Math.round(elapsed / msPerHour) + " hrs ago";
    } else if (elapsed < msPerMonth) {
        if (Math.round(elapsed / msPerDay) === 1) {
            return Math.round(elapsed / msPerDay) + " day ago";
        }
        return Math.round(elapsed / msPerDay) + " days ago";
    } else if (elapsed < msPerYear) {
        if (Math.round(elapsed / msPerMonth)) {
            return Math.round(elapsed / msPerMonth) + " month ago";
        }
        return Math.round(elapsed / msPerMonth) + " months ago";
    } else {
        return "long time ago";
    }
};