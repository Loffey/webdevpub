<script>
    import { promise } from "./stores.js";
    let question;
    async function search() {
        const res = await fetch(
            `https://demo.dataverse.org/api/search?q=` + question
        );
        const json = await res.json();
         if (res.ok) {
            return json;
        } else {
            throw new Error(json);
        } 
    }
    window.onload = function() {
    document.body.onselectstart = function() {
        return false;
    }
}
</script>
<div class="searchinput">
    <div class=icon>
        <img src="magnifying.png" alt="search" unselectable="on" height="30px">
    </div>
    <form
        on:submit|preventDefault={() => {
            $promise = search();
        }}
        
    >
        <input bind:value={question} placeholder="Search..."/>
    </form>
</div>

<style>
    div {
        display: flex;
        gap: 10px;
        width: 50%;
        justify-self: center;
        align-items: center;
    }
    form {
        width: 100%;
    }
    form input {
        width: 100%;
        display: block;
        padding: 9px 5px 9px 45px;
    }
    .icon {
        margin-bottom: 7px;
        margin-left: 5px;
        position: absolute;
        height: 30px;
        width: 30px;
    }
</style>