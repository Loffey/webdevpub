<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap" rel="stylesheet">
<script>
    import Spinner from "./Spinner.svelte";
    import Results from "./Results.svelte";
    import Search from "./Search.svelte";
    import { promise } from "./stores.js";
</script>

<main class:layout={$promise!=undefined}>
    <div id="change" class:layout={$promise!=undefined}>
        <div class=logo style="transform: scale(1) translate(0px, -0px)">
            <h1>EM<img src="logo.png" alt="logo" unselectable="on" height="57px">L SEARCH</h1>
        </div>
    </div>
    <div id="sinput" class:layout={$promise!=undefined}>
        <Search/>
    </div>
    {#await $promise}
        <Spinner />
    {:then result}
        <Results json={result} />
    {:catch error}
        <p id = "error" class:layout={$promise!=undefined} style="color: red">{error.message}</p>
    {/await}
</main>

<style>
    :global(body) {
        padding: 0;
        margin: 0;
    }
    main {
        height: 100vh;
        width: 100vw;
		background: linear-gradient(45deg,#220d75, grey);
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
        overflow: hidden;
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
	h1{
		font-size: 2cm;
		font-family: 'Poppins';
		color:#220d75;
        font-weight: 900;
	}
    .logo{
        max-height: 150px;
        align-items: center;
        text-align: center;
    }
    @media (max-width: 610px){
        .logo{
            max-height: fit-content;
        }
        main{
            width: 200vw;
            height: 200vh;
        }
    }
    #change{
        transform: translate(0px, -5%);;
    }
    #change.layout{
        height: 150px;
        transform: scale(1) translate(0px, -100px);
    }
    #sinput.layout{
        transform: scale(1) translate(25%, -130px);
    }
    #sinput{
        transform: scale(1) translate(25%, -0px);
        display: flex;
        gap: 10px;
        width: 100%;
        justify-self: center;
        align-items: center;
    }
</style>