<script>
    export let video;
    import { chosen_video, video_player_is_active } from "./stores.js";
</script>

<div
class="grid-item"
style="background-image: url({video.poster});"
on:click={() => {
  $chosen_video = video;
  $video_player_is_active = true;
}}

>
<div class="hover"><p>Press To Play</p>
  <!-- <img class="titlelogo" src="play.png" alt="logo" unselectable="on" height="30px"> -->
</div>

</div>

<style>
.grid-item {
    cursor: pointer;
    border: none;
    padding: 0px;
    font-size: 30px;
    text-align: center;
    height: 445px;
    width: 310px;
    background-size: cover;
    border-radius: 15px;
  }
.grid-item:hover{
  opacity: 1;
}
.hover{
  opacity: 0;
  width: 100%;
  height: 50px;
  bottom: 0;
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  background-color: rgba(0,0,0, 0.4);
  transform: translateY(395px);
  user-select: none;
}
.grid-item:hover .hover{
  opacity: 1;
}
p{
  font-family: 'Poppins';
  color: white;
}
@media (max-width: 500px){
  .grid-item{
    height: 220px;
    width: 155px;
    overflow-y: hidden;
  }
}
</style>