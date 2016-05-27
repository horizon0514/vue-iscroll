<template>
  <div id="app">
    <scroll :bottom-height="btnHeight" :use-pulldown="true" @pulldown:loading="loading" :use-pullup="true">
      <ul></ul>
    </scroll>
<!--     <button class="btn" style="'height':btnHeight">button</button>
 -->  </div>
</template>

<script>
import scroll from './scroll.vue'
export default {
  components: {
    scroll
  },
  data () {
    return {
      btnHeight: '0'
    }
  },
  ready(){
    setTimeout(()=>{
      let html = '';
      for(let i=0;i<20;i++){
        html += '<li>'+i+'</li>';
      }
      document.querySelector('ul').innerHTML = html;
      this.$broadcast('scroll-reset','container');
    },2000)
  },
  methods: {
    onScrollEnd(){
      console.log('end')
    },
    loading(uuid){
      setTimeout(()=>{
        console.log('loading data')
        this.$broadcast('pulldown:reset',uuid)
      },3000)
    }

  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
  overflow:hidden;
  background: #f5f5f5;
}
ul{
  list-style: none;
  margin: 0;
  padding: 0;
}
li{
  height: 40px;
  background: #d45;
  border: 1px solid #f5f5f5;
  border-width: 0 0 1px 0 ;
}
.btn{
  height: 48px;
  position: absolute;
  left: 0;
  width: 100%;
  bottom: 0;
  background: green;
  border: none;
}
</style>
