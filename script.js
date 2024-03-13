const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getTodayDate = () => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let monthName = MONTHS[month - 1];
    let year = date.getFullYear();

    let dateInWords = `${monthName} ${day}, ${year}`;
    let dateInNum = `${year}-${month}-${day}`;
    return [dateInWords, dateInNum];
}

localStorage.clear();

