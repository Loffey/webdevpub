<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap" rel="stylesheet">
<script>
    import { fly, fade, slide, scale } from 'svelte/transition';
    let visibility = false;
    let start = false;
    let retry = false;
    let guess = '';
    var points = 0;
    var highscore = 0;

    function random_item(items)
    {
    return items[Math.floor(Math.random()*items.length)];
    }

    var items = [
    "banana", 
    "uncover", 
    "orange", 
    "volvo", 
    "table", 
    "mansion", 
    "aftermath",
    "sunshine",
    "shimmering",
    "pollution",
    "lunch",
    "embarrass",
    "tomorrow",
    "absolutely",
    "absorb",
    "abuse",
    "academic",
    "accept",
    "access",
    "accident",
    "accompany",
    "accomplish",
    "according",
    "account",
    "accurate",
    "achievement",
    "acknowledge",
    "beautiful",
    "beauty",
    "because",
    "become",
    "bedroom",
    "beer",
    "before",
    "begin",
    "beginning",
    "behavior",
    "behind",
    "being",
    "belief",
    "believe",
    "ceiling",
    "celebrate",
    "celebration",
    "celebrity",
    "cell",
    "center",
    "central",
    "century",
    "disability",
    "disagree",
    "disappear",
    "disaster",
    "discipline",
    "discourse",
    "discover",
    "discovery",
    "discrimination",
    "discuss",
    "embrace",
    "emerge",
    "emergency",
    "emission",
    "emotion",
    "emotional",
    "emphasis",
    "emphasize",
    "employ",
    "employee",
    "employer",
    "employment",
    "empty",
    "foreign",
    "forest",
    "forever",
    "forget",
    "form",
    "formal",
    "formation",
    "former",
    "formula",
    "forth",
    "fortune",
    "forward",
    "general",
    "generally",
    "generate",
    "generation",
    "genetic",
    "gentleman",
    "gently",
    "holiday",
    "holy",
    "home",
    "homeless",
    "honest",
    "honey",
    "honor",
    "hope",
    "horizon",
    "horror",
    "horse",
    "hospital",
    "incentive",
    "incident",
    "include",
    "including",
    "income",
    "incorporate",
    "increase",
    "increased",
    "increasing",
    "increasingly",
    "incredible",
    "indeed",
    "joint",
    "joke",
    "journal",
    "journalist",
    "journey",
    "joy",
    "judge",
    "judgment",
    "kitchen",
    "knee",
    "knife",
    "knock",
    "know",
    "knowledge",
    "legacy",
    "legal",
    "legend",
    "legislation",
    "legitimate",
    "lemon",
    "length",
    "less",
    "lesson",
    "management",
    "manager",
    "manner",
    "manufacturer",
    "manufacturing",
    "many",
    "margin",
    "multiple",
    "murder",
    "muscle",
    "museum",
    "music",
    "musical",
    "musician",
    "narrative",
    "narrow",
    "nation",
    "national",
    "native",
    "natural",
    "naturally",
    "nature",
    "near",
    "nearby",
    "nearly",
    "observe",
    "observer",
    "obtain",
    "obvious",
    "obviously",
    "occasion",
    "occasionally",
    "occupation",
    "occupy",
    "perhaps",
    "period",
    "permanent",
    "permission",
    "permit",
    "person",
    "personal",
    "personality",
    "personally",
    "personnel",
    "reach",
    "react",
    "reaction",
    "read",
    "reader",
    "reading",
    "ready",
    "real",
    "reality",
    "realize",
    "really",
    "reason",
    "scandal",
    "scared",
    "scenario",
    "scene",
    "schedule",
    "scheme",
    "scholar",
    "survey",
    "survival",
    "survive",
    "survivor",
    "suspect",
    "sustain",
    "swear",
    "sweep",
    "sweet",
    "swim",
    "totally",
    "touch",
    "tough",
    "tour",
    "tourist",
    "tournament",
    "toward",
    "towards",
    "tower",
    "town",
    "view",
    "viewer",
    "village",
    "violate",
    "violation",
    "violence",
    "violent",
    "virtually",
    "waste",
    "watch",
    "water",
    "wave",
    "weak",
    "wealth",
    "wealthy",
    "weapon",
    "wear",
    "weather",
    "wedding",
    "week",
    "weekend",
    "worried",
    "worry",
    "worth",
    "would",
    "wound",
    "write",
    "writing",
    "wrong",
    "yard"
    ];
    console.log(random_item(items));
    var word = random_item(items);

    function show() {
        visibility = true;
    }
    function play() {
        start = true;
    }
    function replay() {
        start = false;
    }
    function onepoint() {
        points += 1;
    }
    function clearField() {
        document.getElementById("field").value = "";
    }

    var timeleft = 30;

    function score(){
        if (points > highscore){
            (highscore = points);
        }
        else {
            console.log(highscore);
        }
    }
    
    var myTimer;
    function clock() {
        myTimer = setInterval(myClock, 1000);
        var c = 30;

    function myClock() {
       document.getElementById("showtime").innerHTML = --c;
        if (c == 0) {
            clearInterval(myTimer);
            start = false;
            clearField();
            score();
       }
     }
   }
</script>

<main>

    <div class="uncover">
        <img class="logo" src="uncover.png" alt="uncoverlogo" unselectable="on" height="50px">
        <p>Guess the hidden word!<br>Points: {points}, Highscore: {highscore}</p>
        <div class="timer" style="display: {start ? "" : "none"}">
            <p id="showtime">30</p>
        </div>
        <div class="desc" style="display: {start ? "none" : ""}">
            <d>Hover over the white line to reveal<br>
                the word hiding behind it.<br>
                Type your guess in the white field.<br>
                One word is one point<br>
                you have 30 seconds.</d>
        </div>
        <button class="open" style="display: {start ? "none" : ""}" on:click={() => {
            play();
            clock();
            {points = 0};
            score();
        }}>Start</button>
        {#if timeleft == 0}
            {replay()};
        {/if}
        <div class="block" style="display: {start ? "" : "none"}">
        </div>

        <input bind:value={guess} id="field" class="guess" type="text" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Write your guess" style="display: {start ? "" : "none"}">

        <div class="showword" style="display: {start ? "" : "none"}">
            {#if guess == word}
                <h1>
                    {word = random_item(items)}
                </h1>
                {onepoint()};
                {clearField()}
                <!-- <p>korrekt</p> -->
            {:else}
                <h1>
                    {word}
                </h1>
            {/if}
        </div>
        <button class="open" style="display: {retry ? "" : "none"}" on:click={() => {
            play()
            timeleft = 10;
        }}>Try Again</button>

        <div class="showgame" style="display: {start ? "none" : ""}"></div>
    </div>
    <div class="start" style="display: {visibility ? "none" : ""}">
        <button class="open" on:click={() => {
            show()
        }}>OPEN PORTFOLIO</button>
    </div>

    <h1 style="display: {visibility ? "" : "none"}">Earlier Projects:</h1>

    <div class="grid">
        <div class="item" style="display: {visibility ? "" : "none"}">
            <t>KL<img class="titlelogo" src="clock.png" alt="O" unselectable="on" height="30px">CKOR</t>
            <form action="https://loffey.github.io/webdevpub/clock/public/">
                <button class="link" type="submit">Klockor</button>
            </form>
        </div>
        <div class="item" style="display: {visibility ? "" : "none"}">
            <t>EM<img class="titlelogo" src="emol.png" alt="O" unselectable="on" height="30px">L SEARCH</t>
            <form action="https://loffey.github.io/webdevpub/search/public/">
                <button class="link" type="submit">Sökmotor</button>
            </form>
        </div>
        <div class="item" style="display: {visibility ? "" : "none"}">
            <t>discovery-</t>
            <form action="https://loffey.github.io/webdevpub/videos/public/">
                <button class="link" type="submit">Videotjänst</button>
            </form>
        </div>
    </div>
</main>

<style>
    :global(body) {
        padding: 0;
        margin: 0;
    }
    main {
        height: 100vh;
        width: 100vw;
		background: linear-gradient(60deg,#220d75, black);
        background-size: 200% 200%;
        animation: gradient 15s ease infinite;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
        gap: 50px;
        padding-top: 10%;
        padding-left: 10%;
        padding-right: 10%;
        padding-bottom: 5%;
        box-sizing: border-box;
        overflow-y: scroll;
    }
    @keyframes gradient {
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
	h1 {
		font-size: 1cm;
		font-family: 'Poppins';
        font-weight: 900;
        margin-top: 0px;
        color: white;
	}
    t {
        font-family: 'Poppins';
        color: white;
        font-size: 40px;
    }
    p {
        font-family: 'Poppins';
        color: white;
    }
    d {
        font-family: 'Poppins';
        color: white;
    }
    .grid {
        display: grid;
	    grid-row-gap: 50px;
	    grid-column-gap: 200px;
	    grid-template-columns: auto auto auto;
	    padding: 10px;
    }
    .item {
        background-color: #220d75;
        text-align: center;
        padding: 50px;
        border-radius: 20px;
        border: 3px, white;
    }
    .link {
        background-color: transparent;
        color: white;
    }
    .open {
        background-color: transparent;
        color: white;
        font-family: 'Poppins';
    }
    .uncover {
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
        text-align: center;
        gap: 50px;
        /* padding-top: 10%; */
        padding-left: 10%;
        padding-right: 10%;
        /* padding-bottom: 5%; */
        box-sizing: border-box;
    }
    .logo {
        transform: translateY(50px);
    }
    .block {
        height:25px;
        width: 500px;
        background-color: white;
    }
    .showword {
        width: 500px;
        height: 100px;
        text-align: center;
        transform: translateY(-190px);
        z-index: 1;
        user-select: none;
        transition-timing-function: linear;
        transition-duration: 2s;
        transition-property: height;
    }
    h1:hover {
        /* font-size: 30px; */
        transform: translateY(-20px);
        transition-timing-function: linear;
        transition-duration: 4s;
    }
    .showgame {
        height: 130px;
        opacity: 0;
    }
</style>