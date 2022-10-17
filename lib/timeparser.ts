
var stringRegex = new RegExp(/(.*.)-(..)-(..)T(..):(..):(..)/);

function parseYTTimeFromString(TimeString:string){
    var timeArr = TimeString.split(":");
    var seconds = 0;
    if(timeArr.length == 3){
        seconds += Number(timeArr[0].valueOf())*3600;
        seconds += Number(timeArr[1].valueOf())*60;
        seconds += Number(timeArr[2].valueOf());
    }
    
    if(timeArr.length == 2){
        seconds += Number(timeArr[0].valueOf())*60;
        seconds += Number(timeArr[1].valueOf());
    } 
    
    return seconds;
}

function parseTimeFromSeconds(seconds:string){
    var res = `${parseInt(seconds)>=3600?Math.floor(parseInt(seconds)/3600)+":":''}${parseInt(seconds)>=3600?(Math.floor((parseInt(seconds)/60) % 60)).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false }):Math.floor((parseInt(seconds)/60) % 60)}:${(parseInt(seconds) % 60).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })}`
    return res;
}
export {parseTimeFromSeconds,parseYTTimeFromString}