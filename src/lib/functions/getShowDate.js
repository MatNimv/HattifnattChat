
function getShowDate(){
    let newDate = new Date()
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    let strday = day.toString()
    let strmonth = month.toString();
    let stryear = year.toString();

    //kabaras för att displaya datumet fint
    let monthName;
    if(strmonth == 1){monthName = "Jan"}
    else if(strmonth == 2){monthName = "Feb"}
    else if(strmonth == 3){monthName = "Mar"}
    else if(strmonth == 4){monthName = "Apr"}
    else if(strmonth == 5){monthName = "May"}
    else if(strmonth == 6){monthName = "Jun"}
    else if(strmonth == 7){monthName = "Jul"}
    else if(strmonth == 8){monthName = "Aug"}
    else if(strmonth == 9){monthName = "Sep"}
    else if(strmonth == 10){monthName = "Oct"}
    else if(strmonth == 11){monthName = "Nov"}
    else if(strmonth == 12){monthName = "Dec"}
//
    return `${monthName} ${strday}, ${stryear}`;
}

export default getShowDate;