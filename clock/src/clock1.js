export class Clock {
    constructor(hour, minute)
    {
        (hour >= 0 && hour < 24) ? this._hour = hour : console.log("a")
        (minute >= 0 && minute < 60) ? this._minute = minute : console.log("b")
        this.alarmIsActive = true;
        this.alarmIsTrigger = false;
        this.setAlarm(15, 0);
        // if (hour<0 || hour>23)
        // {
        //     throw Error ("The Hour Argument Must Be Between 0 and 23");
        // }
 
        // if (minute<0 || minute>59)
        // {
        //     throw Error ("The Minute Argument Must Be Between 0 and 59");
        // }
        // this.hour = hour
        // this.minute = minute
    }
    setAlarm(hour, minute){
        this._hourAlarm = hour;
        this._minuteAlarm = minute;
    }
    set alarmFromString(string){
        this._hourAlarm = string.split(":")[0]
        this._minuteAlarm = string.split(":")[1]
        this.alarmIsTrigger = false;
    }
    get alarmFromString(){
        return this.alarmTime;
    }
    toggleAlarm(){
        this.alarmIsTrigger = false;
    }
    
    get time()
    {
        return{"hour": this._hour.toString().padStart(2, '0'),
        "minute":this._minute.toString().padStart(2, '0')
        }
    }
    
    activateAlarm()
    {
        this.alarmIsActive = true
    }
    
    deactivateAlarm()
    {
        this.alarmIsActive = false
    }
 
    setAlarm(hour,minute)
    {
        // if (hour<0 || hour>23)
        // {
        //     throw Error ("The Alarm hour Argument Must Be Between 0 and 23");
        // }
 
        // if (minute<0 || minute>59)
        // {
        //     throw Error ("The Alarm Minute Argument Must Be Between 0 and 59");
        // }
        this.alarmHour = hour
        this.alarmMinute = minute
     
    }
    get alarmTime(){
        return this._hourAlarm.toString().padStart(2, 0) + ':' + this._minuteAlarm.toString().padStart(2, '0');
    }
 
    tick()
    {
        this.minute++
        if (this.minute>=60)
        {
            this.hour++ 
            this.minute = 0
        }
 
        if (this.hour>=24)
        {
            this.hour = 0
        }
        let hourPrefix = (this._hour < 10) ? "0"+this._hour : this._minute;
        let minutePrefix = (this._minute < 10) ? "0"+this._minute : this._minute;
        // console.log((this.hour< 10 ? "0" + this.hour : this.hour) + ":" + (this.minute< 10 ? "0" + this.minute : this.minute))
        if (this.alarmIsActive == true)
        if ((this.hour == this.alarmHour) && (this.minute == this.alarmMinute))
        {
            console.log("Larm!!!")
        }
 
    }
}

