<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap" rel="stylesheet">
<script>
	import { video_player_is_active, chosen_video } from "./stores.js";
	import { Button, Overlay } from "svelte-materialify";
	import { videos } from "./videos.js";
	import Player from "./Player.svelte";
	import Thumbnail from "./Thumbnail.svelte";
	let is_fullscreen = false;
	let visibility = true;
	let show = false;
	let showbanner = true;
	let showutvalt = true;
	let shownyheter = true;
	let showäventyr = true;
	let showserier = true;
	let showdokumentärer = true;
	function showtitle() {
		visibility = false
	}
	function showBanner() {
		show = true;
	}
	function hideBanner() {
		show = false;
	}
	function hidebanner() {
		showbanner = false;
	}
	function hideutvalt() {
		showutvalt = false;
	}
	function hidenyheter() {
		shownyheter = false;
	}
	function hideäventyr() {
		showäventyr = false;
	}
	function hideserier() {
		showserier = false;
	}
	function hidedokumentärer() {
		showdokumentärer = false;
	}
  </script>
  
  <main>
	<h1 id="title" style="display: {visibility ? "" : "none"}"><img class="logo" src="discoverylogo.png" alt="logo" unselectable="on" height="90px">discovery-</h1>
	<div class="background"/>
	<button class="choosecategory" on:click={() => {
		hideutvalt()
		hideäventyr()
		hidenyheter()
		hideserier()
		hidebanner()
		showdokumentärer = true;
	}}>Dokumentärer</button>
	<button class="choosecategory" on:click={() => {
		hideutvalt()
		hideäventyr()
		hidedokumentärer()
		hideserier()
		hidebanner()
		shownyheter = true;
	}}>Nyheter</button>
	<button class="choosecategory" on:click={() => {
		hideutvalt()
		hidenyheter()
		hideäventyr()
		hidedokumentärer()
		hidebanner()
		showserier = true;
	}}>Serier</button>
	<button class="choosecategory" on:click={() => {
		showutvalt = true;
		shownyheter = true;
		showäventyr = true;
		showserier = true;
		showdokumentärer = true;
		showbanner = true;
	}}>Din Sida</button>
	<div class="categories" style="display: {showutvalt ? "" : "none"}">
		<t1>Utvalt</t1>
	</div>
	<div class="grid" style="display: {showutvalt ? "" : "none"}" on:click={showtitle}>
		<div class="template">
			<Thumbnail video={videos[0]}> </Thumbnail>
			<div class="templatetext">Mörkt hjärta<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[1]}> </Thumbnail>
			<div class="templatetext">Aldrig vuxen<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[2]}> </Thumbnail>
			<div class="templatetext">Alla mot alla med <img class="titlelogo" src="5logo.png" alt="logo" unselectable="on" height="30px"><br>Filip och Fredrik</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[3]}> </Thumbnail>
			<div class="templatetext">The Island Sverige<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template" dir="ltr">
			<Thumbnail video={videos[4]}> </Thumbnail>
			<div class="templatetext">Vägens Hjältar<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template" dir="ltr">
			<Thumbnail video={videos[5]}> </Thumbnail>
			<div class="templatetext">Sommaren med<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>släkten</div>
		</div>
		<div class="template" dir="ltr">
			<Thumbnail video={videos[6]}> </Thumbnail>
			<div class="templatetext">Building Off The<img class="titlelogo" src="dlogo.png" alt="logo" unselectable="on" height="30px"><br>Grid</div>
		</div>
		<div class="template" dir="ltr">
			<Thumbnail video={videos[31]}> </Thumbnail>
			<div class="templatetext">Välkommen Till<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>Köping</div>
		</div>
		<div class="template" dir="ltr">
			<Thumbnail video={videos[32]}> </Thumbnail>
			<div class="templatetext">Top Gear<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[33]}> </Thumbnail>
			<div class="templatetext">Ullared<img class="titlelogo" src="5logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
	</div>
	<div class="categories" style="display: {shownyheter ? "" : "none"}">
		<t1>Nytt på discovery-</t1>
	</div>
	<div class="grid" style="display: {shownyheter ? "" : "none"}" on:click={showtitle}>
		<div class="template">
			<Thumbnail video={videos[7]}> </Thumbnail>
			<div class="templatetext">Johnny vs.<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>Amber</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[8]}> </Thumbnail>
			<div class="templatetext">Huliganfallet - hotad<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>till tystnad</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[9]}> </Thumbnail>
			<div class="templatetext">Catching @killer<img class="titlelogo" src="idlogo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[10]}> </Thumbnail>
			<div class="templatetext">My Pack Life<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[11]}> </Thumbnail>
			<div class="templatetext">The Man Without A<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>Heart</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[12]}> </Thumbnail>
			<div class="templatetext">Inventions That<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>Changed History</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[13]}> </Thumbnail>
			<div class="templatetext">Kevin Hart's Muscle<img class="titlelogo" src="dlogo.png" alt="logo" unselectable="on" height="30px"><br>Car Crew</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[34]}> </Thumbnail>
			<div class="templatetext">Calls From The<img class="titlelogo" src="idlogo.png" alt="logo" unselectable="on" height="30px"><br>Inside</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[35]}> </Thumbnail>
			<div class="templatetext">Building The<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>Legend</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[36]}> </Thumbnail>
			<div class="templatetext">Love in the<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>Jungle</div>
		</div>
	</div>
	<div class="categories" style="display: {showäventyr ? "" : "none"}">
		<t1>Utmanande Äventyr</t1>
	</div>
	<div class="grid" style="display: {showäventyr ? "" : "none"}" on:click={showtitle}>
		<div class="template">
			<Thumbnail video={videos[3]}> </Thumbnail>
			<div class="templatetext">The Island Sverige<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[14]}> </Thumbnail>
			<div class="templatetext">Ensam i vildmarken<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[15]}> </Thumbnail>
			<div class="templatetext">Över Atlanten<img class="titlelogo" src="5logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[16]}> </Thumbnail>
			<div class="templatetext">Deadliest Catch<img class="titlelogo" src="dlogo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[17]}> </Thumbnail>
			<div class="templatetext">Ed Stafford: Left for<img class="titlelogo" src="dlogo.png" alt="logo" unselectable="on" height="30px"><br>Dead</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[18]}> </Thumbnail>
			<div class="templatetext">Everest: Beyond the<img class="titlelogo" src="elogo.png" alt="logo" unselectable="on" height="30px"><br>Limit</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[19]}> </Thumbnail>
			<div class="templatetext">The Impossible Row<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[37]}> </Thumbnail>
			<div class="templatetext">Survive That!<img class="titlelogo" src="dlogo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[38]}> </Thumbnail>
			<div class="templatetext">100 Days Wild<img class="titlelogo" src="dlogo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[39]}> </Thumbnail>
			<div class="templatetext">Pushing the line<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
	</div>
	<div class="banner" style="display: {showbanner ? "" : "none"}">
		<button class="button" style="display: {show ? "none" : ""}" on:click= {() => {
			$chosen_video = videos[2];
			$video_player_is_active = true;
			visibility = false;
		  }}><img class="banner" src="allamotalla.png" alt="logo" unselectable="on"></button>
		<button class="button2" style="display: {show ? "" : "none"}" on:click={() => {
			$chosen_video = videos[7];
			$video_player_is_active = true;
			visibility = false;
		  }}><img class="banner" src="johnnyvsamber.png" alt="logo" unselectable="on"></button>
		<button class="next" style="display: {show ? "none" : ""}" on:click={showBanner}>Next</button>
		<div class="first" style="display: {show ? "none" : ""}">
			<img class="dot" src="dotselected.png" alt="logo" unselectable="on" height="20px" style="display: {show ? "none" : ""}">
			<img class="dot" src="dot.png" alt="logo" unselectable="on" height="20px" style="display: {show ? "none" : ""}">
		</div>
		<button class="previous" style="display: {show ? "" : "none"}" on:click={hideBanner}>Previous</button>
		<div class="second" style="display: {show ? "" : "none"}">
			<img class="dot" src="dot.png" alt="logo" unselectable="on" height="20px" style="display: {show ? "" : "none"}">
			<img class="dot" src="dotselected.png" alt="logo" unselectable="on" height="20px" style="display: {show ? "" : "none"}">
		</div>
	</div>
	<div class="categories" style="display: {showserier ? "" : "none"}">
		<t1>Fastna framför en serie</t1>
	</div>
	<div class="grid" style="display: {showserier ? "" : "none"}" on:click={showtitle}>
		<div class="template">
			<Thumbnail video={videos[20]}> </Thumbnail>
			<div class="templatetext">Vi i villa<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[21]}> </Thumbnail>
			<div class="templatetext">Dopamin<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[0]}> </Thumbnail>
			<div class="templatetext">Mörkt hjärta<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[5]}> </Thumbnail>
			<div class="templatetext">Sommaren med<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>släkten</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[22]}> </Thumbnail>
			<div class="templatetext">LIGGA - konsten att<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>komma över sitt ex</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[23]}> </Thumbnail>
			<div class="templatetext">Pappas pojkar<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>Limit</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[24]}> </Thumbnail>
			<div class="templatetext">Udda veckor<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[2]}> </Thumbnail>
			<div class="templatetext">Alla mot alla med <img class="titlelogo" src="5logo.png" alt="logo" unselectable="on" height="30px"><br>Filip och Fredrik</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[3]}> </Thumbnail>
			<div class="templatetext">The Island Sverige<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template" dir="ltr">
			<Thumbnail video={videos[5]}> </Thumbnail>
			<div class="templatetext">Sommaren med<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>släkten</div>
		</div>
	</div>
	<div class="categories" style="display: {showdokumentärer ? "" : "none"}">
		<t1>Dokumentärer</t1>
	</div>
	<div class="grid" style="display: {showdokumentärer ? "" : "none"}" on:click={showtitle}>
		<div class="template">
			<Thumbnail video={videos[25]}> </Thumbnail>
			<div class="templatetext">Rönnäsfallet - jakten<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>på sanningen</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[26]}> </Thumbnail>
			<div class="templatetext">Ted Bundy: Mind Of<img class="titlelogo" src="idlogo.png" alt="logo" unselectable="on" height="30px"><br>A Monster</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[27]}> </Thumbnail>
			<div class="templatetext">Insats Torsk -<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>Sexhandeln inifrån</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[28]}> </Thumbnail>
			<div class="templatetext">Joakim Lundell -<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"><br>Jockiboi räddade...</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[29]}> </Thumbnail>
			<div class="templatetext">Tunnelbanan<img class="titlelogo" src="5logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[4]}> </Thumbnail>
			<div class="templatetext">Vägens Hjältar<img class="titlelogo" src="logo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[30]}> </Thumbnail>
			<div class="templatetext">The Murder Tapes<img class="titlelogo" src="idlogo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[17]}> </Thumbnail>
			<div class="templatetext">Ed Stafford: Left for<img class="titlelogo" src="dlogo.png" alt="logo" unselectable="on" height="30px"><br>Dead</div>
		</div>
		<div class="template">
			<Thumbnail video={videos[38]}> </Thumbnail>
			<div class="templatetext">100 Days Wild<img class="titlelogo" src="dlogo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
		<div class="template">
			<Thumbnail video={videos[37]}> </Thumbnail>
			<div class="templatetext">Survive That!<img class="titlelogo" src="dlogo.png" alt="logo" unselectable="on" height="30px"></div>
		</div>
	<Overlay
	  opacity={is_fullscreen ? 1 : 0.7}
	  color="black"
	  active={$video_player_is_active}
	  on:click={() => {
		$video_player_is_active = false;
	  }}
	>
	  <div
		id="video"
		class:fullscreen={is_fullscreen == true}
		on:click={(e) => {
		  e.stopPropagation();
		}}
	  >
		<div id="close">
		  <Button
			class="error-color"
			size="small"
			on:click={() => {
			  $video_player_is_active = false;
			  visibility = true;
			}}
		  >
			Close
		  </Button>
		</div>
		<div id="fullscreen">
		  <Button
			size="small"
			class="primary-color"
			on:click={() => {
			  is_fullscreen = !is_fullscreen;
			  // do not focus the fullscreenbutton if clicked
			  // this is because otherwise clicking space will cause
			  // the video player to maximize/minimize instead of pause/play
			  // when space is clicked
			  if (document.activeElement != document.body)
				document.activeElement.blur();
			}}
		  >
			{is_fullscreen ? "Minimize" : "Theatre Mode"}
		  </Button>
		</div>
  
		{#if is_fullscreen}
		  <div id="gigascreen">
			<Button
			  size="small"
			  class="secondary-color"
			  on:click={() => {
				// do not focus the fullscreenbutton if clicked
				// this is because otherwise clicking space will cause
				// the video player to maximize/minimize instead of pause/play
				// when space is clicked
				if (document.activeElement != document.body)
				  document.activeElement.blur();
  
				let div = document.getElementById("vid");
				if (div.requestFullscreen) div.requestFullscreen();
				else if (div.webkitRequestFullscreen)
				  div.webkitRequestFullscreen();
				else if (div.msRequestFullScreen) div.msRequestFullScreen();
			  }}
			>
			  {"Gigascreen"}
			</Button>
		  </div>
		{/if}
  
		<Player />
	  </div>
	</Overlay>
  
	<src />
  </main>
  
  <style>
	:global(:root) {
	  --blue: #220d75;
	}
	*{
		user-select: none;
	}
	:global(body) {
	  padding: 0;
	  margin: 0;
	}
	main {
		min-height: 100vh;
		width: 100vw;
		padding-left: 5%;
		padding-right: 5%;
		box-sizing: border-box;
		color:#220d75;
    	background: linear-gradient(60deg,black ,#220d75);
    	background-size: 200% 100%;
		animation: movement 5s ease infinite;
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
	#video {
	  position: fixed;
	  transition: all 0.3s ease-out;
	  left: 15%;
	  right: 15%;
	  top: 10%;
	  bottom: 15%;
	  height: 700px;
	  overflow: hidden;
	  align-items: top;
	  padding-top: 39%;
	  /* padding-bottom: 100px; */
	}
	#video.fullscreen {
	  left: 0%;
	  right: 0%;
	  top: 0%;
	  bottom: 0%;
	  height: auto;
	  padding-top: 50%;
	}
	#video.fullscreen #gigascreen {
	  position: absolute;
	  top: 10px; /* position the top  edge of the element at the middle of the parent */
	  left: 50%; /* position the left edge of the element at the middle of the parent */
	  transform: translate(-50%, 0);
	  z-index: 9999;
	}
	#video #close {
	  position: absolute;
	  top: 5px;
	  right: 5px;
	  z-index: 9999;
	}
	#video #fullscreen {
	  position: absolute;
	  top: 5px;
	  left: 5px;
	  z-index: 9999;
	}
	#video.fullscreen #close {
	  position: absolute;
	  top: 10px;
	  right: 10px;
	  z-index: 9999;
	}
	#video.fullscreen #fullscreen {
	  position: absolute;
	  top: 10px;
	  left: 10px;
	  z-index: 9999;
	}
	.categories {
		margin-top: 100px;
	}
	.grid {
	  /* margin-top: 100px; */
	  overflow-x: scroll;
	  display: grid;
	  grid-row-gap: 20px;
	  grid-column-gap: 40px;
	  grid-template-columns: auto auto auto auto auto auto auto auto auto auto;
	  padding: 10px;
	  scroll-snap-type: x mandatory;
	}
	.template{
		scroll-snap-align: start;
	}
	/* .grid::-webkit-scrollbar { 
    display: none;
	} */
    ::-webkit-scrollbar {
        width: 15px;
        height: 15px;
    }
    ::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.1);
    }
    ::-webkit-scrollbar-thumb {
        background-image: linear-gradient(15deg, #220d75, #220d75);
        border-radius: 10px;
    }
	t1{
		font-family: 'Poppins';
		font-size: 1cm;
		color: white;
	}
	.templatetext{
		font-family: 'Poppins';
		font-size: 0.7cm;
		color:white;
	}
	#title {
	  color: white;
	  font-size: 45px;
	  font-weight: bolder;
	  font-family: 'Poppins';
	  line-height: 100px;
	  position: fixed;
	  top: 0;
	  left: 0;
	  right: 0;
	  -webkit-backdrop-filter: blur(20px);
  	  backdrop-filter: blur(20px);
	  background-color: rgba(0,0,0, 0.4);
	  height: 100px;
	  padding-left: calc(5% + 5px);
	  border-bottom: 3px solid var(--blue);
  	  /* text-shadow: -0.5px -0.5px 0 white, 0.5px -0.5px 0 white, -0.5px 0.5px 0 white, 0.5px 0.5px 0 white; */
	  z-index: 999;
	}
	.banner {
		padding-top: 60px;
		/* border-radius: 30px; */
		/* max-width: 1920px; */
		/* width: 100%; */
		/* min-width: 1900px; */
		/* max-height: 950px; */
		/* transform: translateX(-45px); */
		background-size: cover ;
		width: 100%
	}
	.logo {
        max-height: 150px;
		position: fixed;
		padding-top: 10px;
		left:5px;
    }
	.titlelogo {
		float: right; margin: 5px 0px 10px 0px;
		padding: 2px;
    }
	.background {
		width: auto;
		height: 100px;
	}
	.button {
  		background-color: none;
  		/* color: white; */
  		/* padding: 15px 32px; */
		padding-top: 0px;
		/* padding-bottom: 20px; */
		/* border-radius: 200px; */
  		text-align: center;
  		text-decoration: none;
  		/* display: inline-block; */
  		font-size: 20px;
  		margin: 4px 2px;
  		cursor: pointer;
		font-family: 'Poppins';
		font-weight: bolder;
		/* transform: translateX(75px) translateY(-280px); */
	}
	.button2 {
		background-color: none;
		padding-top: 0px;
  		text-align: center;
  		text-decoration: none;
  		font-size: 20px;
  		margin: 4px 2px;
  		cursor: pointer;
		font-family: 'Poppins';
		font-weight: bolder;
		/* display: none; */
	}
	.button:active {
		background-color: transparent;
		border: transparent;
	}
	.button2:active {
		background-color: transparent;
		border: transparent;
	}
	.next {
		background-color: #220d75;
		color: white;
		align-content: center;
		width: 150px;
		float: right; margin: 0px 0px 10px 0px;
	}
	.choosecategory {
		background-color: #220d75;
		color: white;
		align-content: center;
		width: 150px;
		float: right; margin: 0px 0px 10px 0px;
		margin-right: 10px;
		font-family: 'Poppins';
	}
	.choosecategory:hover {
		background-color: rgb(0, 2, 94);
		text-decoration: underline;
	}
	.previous {
		background-color: #220d75;
		color: white;
		align-content: center;
		width: 150px;
	}
	.first {
		margin: auto;
  		width: 50%;
  		padding: 10px;
		text-align: center;
	}
	.second {
		margin: auto;
  		width: 50%;
  		padding: 10px;
		text-align: center;
		margin-top: -45px;
	}
	@media (max-width: 500px){
		.banner { display: none; }
		.button { display: none; }
		.templatetext {
			font-size: 0.35cm;
		}
		.titlelogo {
			height: 15px;
		}
		t1 {
			font-size: 0.5cm;
		}
	}
	@media (max-width: 1500px){
		.logo { display: none; }
	}
	@media (max-width: 1000px){
		.choosecategory { display: none; }
	}
  </style>