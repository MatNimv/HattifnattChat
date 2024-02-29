const getTime = () => {
    let date = new Date();
    let hour = date.getHours();
    let minutes = date.getMinutes();

    return `${hour}:${minutes}`;
}

export default getTime;