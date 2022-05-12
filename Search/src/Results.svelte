<script>
    export let json;
    import { fly, fade, slide, draw } from "svelte/transition";
</script>

{#if json && "data" in json && "items" in json.data && json.data.items.length > 0}
    <div id = "item-holder" style="transform: scale(1.2) translate(0px, -90px)">
        {#each json.data.items as item}
            {#if item.type=="dataverse"}
            <div id = "item">
                {#each Object.entries(item) as [key, value]}
                    <!-- <p in:fade>{JSON.stringify(value)}</p> -->
                {/each}
                <p class=link>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
                </p>
                <p class=description>
                    {item.description}
                </p>
                <p class=date>
                    {item.published_at}
                </p>
            </div>
            {/if}
        {/each}
    </div>
{:else if json}
    <div class=noresult style="transform: scale(1.2) translate(0px, -90px)"><p1>No Results Found!<br></p1>
    <p2>We couldn't find what your looking for.<br> Try changing the search term.</p2></div>
{/if}

<style>
    #item-holder {
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
        overflow-y: scroll;
        box-sizing: border-box;
        padding-left: 10%;
        padding-right: 10%;
        max-width: 100%;
        row-gap: 20px;
    }
    #item {
        border-radius: 5px;
        background-color: whitesmoke;
        border: 0px solid whitesmoke;
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
        word-wrap: break-word;
    }
    p {
        border: 0px solid black;
        padding: 5px;
        font-family: 'Poppins';
    }
    p1 {
        font-size: 1cm;
        color: #220d75;
        font-family: 'Poppins';
        font-weight: 900;
    }
    p2 {
        font-size: 0.7cm;
        color: #220d75;
        font-family: 'Poppins';
    }
    .link {
        font-size: larger;
        color:#220d75;
    }
    .description {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .date{
        color:black;
        overflow: hidden;
    }
    .noresult{
        height: 180px;
        width:600px;
        text-align: center;
        border-radius: 5px;
        /* background-color: whitesmoke;
        border: 0px solid whitesmoke; */
        padding: 10px;
        box-sizing: border-box;
    }
    /** https://onaircode.com/html-css-custom-scrollbar-examples/ */
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
    @media (max-width: 610px){
        p1{
            font-size: 0.8cm;
        }
        p2{
            font-size: 0.5cm;
        }
    }
</style>