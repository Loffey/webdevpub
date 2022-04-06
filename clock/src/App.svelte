<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap" rel="stylesheet">
<script>
	import {Clock} from "./clock";
	import { fade, fly, slide, draw } from "svelte/transition";
	import { spring, tweened } from "svelte/motion";
    var minute = 1
    var hour = 12

	let clock = new Clock(14, 20);
	let i = 0
    let hours = spring();
    let minutes = spring();
    $minutes=parseInt(clock.time.hour) *60 + parseInt(clock.time.minute);
    $hours=parseInt(clock.time.hour);
	
	function tick() {
		clock.tick();
		clock = clock;
		if(clock.time.hour + clock.time.minute == 0){
            hours = spring();
            minutes = spring();
            $minutes=parseInt(clock.time.hour) *60 + parseInt(clock.time.minute);
            $hours=parseInt(clock.time.hour);
        }else{
        hours.set(parseInt(clock.time.hour));
        minutes.set(parseInt(clock.time.hour) *60 + parseInt(clock.time.minute));
        }
    }
	setInterval(tick, 1000);
    console.log(clock.minute)

</script>

<main>
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@500&family=Open+Sans+Condensed:wght@300&display=swap" rel="stylesheet">
    <div class="grid-container">
	<div class="box analogClock">
    <svg viewBox="-50 -50 100 100">
        <circle class="clock-face" r="48" />
        
        <!-- markers -->
        {#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
            <line class="major" y1="40" y2="45" transform="rotate({30 * minute})" />

            {#each [1, 2, 3, 4] as offset}
                <line
                    class="minor"
                    y1="42"
                    y2="45"
                    transform="rotate({6 * (minute + offset)})"
                />
            {/each}
        {/each}
        <!-- hour hand -->
        <line
            class="hour"
            y1="33"
            y2="38"
            transform="rotate({(6 / 12) * $minutes - 180})"
        />

        <!-- minute hand -->
        <g transform="rotate({6 * $minutes - 180})">
            <line class="minute" y1="30" y2="38" />
        </g>
	</svg>
    </div>
    <div class="box digitalClock">
        <t1>
            {clock.time.hour + ":" + clock.time.minute}
	    </t1>
        <t2>
            Alarm: {clock.alarmTime}
        </t2>
        <button on:click={() => (clock.toggleAlarm())}>Toggle Alarm</button>
            <input type="time" bind:value={clock.setAlarmFromString}>
        <p id="time"/>
        <p id="alarm"/>
	    <button on:click={tick}> +1 sec </button>
        {#if clock.alarmIsTrigger == true}
	    <t3>VAKNA!!</t3>
	    {/if}
    </div>
    <div class="box bar">
        <rec>
            <t2>Minutes: {clock.time.minute}</t2>
            <svg width=20 height=10>
                <rect width="100%" height="100%" style="fill:rgb(255,255,255);stroke-height:1;stroke:rgb(34, 13, 117)"/>
                <rect width="100%" height="1%" y="50%" style="fill:rgb(0,0,0)"/>
                <rect width="{(clock.time.minute/60) * 100}%" height="50%" style="fill:rgb(34, 13, 117);stroke-height:1;stroke:rgb(0,0,0)"/>
                <rect width="{(clock.time.minute/60 + clock.time.hour/24 * 100)}%" height="50%" y="50%" style="fill:rgb(34, 13, 117);stroke-height:1;stroke:rgb(0,0,0)"/>
            </svg>
            <t2>Hours: {clock.time.hour}</t2>
        </rec>
    </div>
    </div>
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
    main {
        display:flex;
        text-align: center;
		width: 100%;
        min-height: 100%;
        color:#220d75;
        background: linear-gradient(45deg,#220d75, grey);
        background-size: 200% 200%;
        align-items: center;
        align-content: center;
        justify-content: center;
        gap: 50px;
        animation: movement 10s ease infinite;
    }
    @keyframes movement {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

.grid-container{
    display: grid;
    grid-template-columns: auto auto auto;
    grid-gap: 100px;
    padding: 1em;
}
.grid-container>div{
    /* background-color: #ddd; */
    text-align: center;
    
    max-height: 100%;
    max-width: 100%;
}
.box {
    height: 500px;
    width: 300px;
    padding-top: 75px;
    margin: 20px;
    /* background-color: white; */
}
.digitalClock {
    text-align: center;
    height: 100%;
}
.analogClock {
    text-align: center;
    height: 100%;
    padding-top: 100px;
}
.bar {
    top: 100px;
    place-items: center;
    align-items: center;
    padding-top: 150px;
    /* background-color: white; */
}
t1 {
    font-size: 3.5cm;
	font-family: 'Poppins';
}
t2 {
    font-size: 1cm;
    font-family: 'Poppins';
}
t3 {
    font-size: 2cm;
}

button {
	background-color: transparent;
    outline-color: transparent;
	color: #220d75;
	font-size: 0.5cm;
	font-family: 'Open Sans Condensed', sans-serif;
	border-radius: 20px;
	margin-left:5px;
	margin-right:5px;
}
svg {
    min-width: 300px;
    min-height: 75px;
}
.clock-face{
    stroke: #220d75;
    stroke-width: 1;
    fill: none;
}
.minor{
    stroke: black;
    stroke-width: 0.4;
}
.major{
    stroke: black;
    stroke-width: 0.8;
}
.minute{
    stroke: #220d75;
    stroke-width: 1;
}
.hour{
    stroke: #220d75;
    stroke-width: 2;
}
@media screen and (max-width:1450px){
    main {
        flex-direction: column;
        min-height: 120%;
        align-items: center;
        justify-content: center;
    }
}
@media screen and (max-width:1250px){
    main {
        flex-direction: column;
        min-height: 220%;
        align-items: center;
        justify-content: center;
    }
    .box {
        position: absolute;
        margin: auto;
        top: 0; left: 0; bottom: 0; right: 0;
    }
    .digitalClock {
        top: 900px;
    }
    .bar {
        top: 1650px;
    }
    .analogClock {
        top: 50px;
    }
}
@media screen and (max-height:650px) and (max-width:1250px){
    main {
        flex-direction: column;
        min-height: 120%;
    }
}
@media screen and (max-height:700px) and (max-width:500px){
    .digitalClock {
        top: 1000px;
    }
    .bar {
        top: 1900px;
    }
    .analogClock {
        top: 50px;
    }
    main{
        min-height: 280%;
    }
}
@media screen and (max-width:280px){
    main {
        flex-direction: column;
        min-width: 110%;
        min-height: 280%;
    }
}
</style>