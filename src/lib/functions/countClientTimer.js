const countClientTimer = (startTimer) => {
    //getting the client timer
    let endTime = new Date().getTime();
    let timeDiff = endTime - startTimer;
    let stringNum = timeDiff.toString();
    if (stringNum.length >= 5){
        timeDiff = stringNum.slice(0, 4)
    }
    let clientTime = timeDiff / 1000;
    return clientTime
}

export default countClientTimer;