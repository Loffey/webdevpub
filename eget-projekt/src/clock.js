export class Clock{
    
    constructor(hour, minute){
        (hour >= 0 && hour < 24) ? this._hour = hour : console.log("Värdet måste vara mellan 0 och 24");
        (minute >= 0 && minute < 60) ? this._minute = minute : console.log("Värdet måste vara mellan 0 och 60");
        this.alarmIsActive = true;
        this.alarmIsTrigger = false;
        this.setAlarm(15, 0);
    }
    setAlarm(hour, minute){
        this._hourAlarm = hour;
        this._minuteAlarm = minute;
    }
    set setAlarmFromString(string){
        this._hourAlarm = string.split(":")[0] 
        this._minuteAlarm = string.split(":")[1] 
        this.alarmIsTrigger = false;
    }
    get setAlarmFromString(){
        return this.alarmTime;
    }
    activateAlarm(){
        this.alarmIsActive = true;
    }
    deactivateAlarm(){
        this.alarmIsActive = false;
    }
    toggleAlarm(){
        this.alarmIsTrigger = false;
    }
    get time(){
        return {"hour": this._hour.toString().padStart(2, '0'),
        "minute": this._minute.toString().padStart(2, '0')
        }
    }
    get alarmTime(){
        return this._hourAlarm.toString().padStart(2, '0') + ':' + this._minuteAlarm.toString().padStart(2, '0');
    }
    tick(){
        this._minute += 1;

        if(this._minute >= 60){
            this._minute = 0;
            this._hour += 1;
        }

        if(this._hour >= 24){
            this._hour = 0;
        }

        let hourPrefix = (this._hour < 10) ? "0"+this._hour : this._hour;
        let minutePrefix = (this._minute < 10) ? "0"+this._minute : this._minute;
        console.log(hourPrefix + ":" + minutePrefix)

        if(this.alarmIsActive && this._hour == this._hourAlarm && this._minute == this._minuteAlarm){
            console.log("Vakna!");
            this.alarmIsTrigger = true;
        }
    }
}