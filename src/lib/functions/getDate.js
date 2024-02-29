

function getDate(){ 
    let newDate = new Date()
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let hour = newDate.getHours();
    let minute = newDate.getMinutes();

    let strday = day.toString()
    let strmonth = month.toString();
    let stryear = year.toString();
    let strhour = hour.toString();
    let strminute = minute.toString();

    return `${strhour}:${strminute} ${strday}/${strmonth}-${stryear}`;
}

export default getDate;