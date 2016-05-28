<template>
  <div id="app">
    <scroll :bottom-height="btnHeight" :use-pulldown="true" @pulldown:loading="downLoading" :use-pullup="true" @pullup:loading="upLoading" @pullup:complete="upDone">
      <ul>
        <li v-for="item in items" track-by="$index">{{item}}</li>
      </ul>
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
      btnHeight: '0',
      items: []
    }
  },
  ready(){
    setTimeout(()=>{
      this.items = [1,2,3,4,5,6,7,8,9,10,11];
      
      this.$broadcast('scroll-reset','container');
    },2000)
  },
  methods: {
    onScrollEnd(){
      console.log('end')
    },
    downLoading(uuid){
      setTimeout(()=>{
        console.log('loading data,pull down')
        this.items.unshift(-3,-2,-1,0);
        this.$broadcast('pulldown:reset',uuid)
      },3000)
    },
    upLoading(uuid){
      setTimeout(()=>{
        console.log('loading data,pull up')
        this.items.push(12,13,14,15)
        this.$broadcast('pullup:reset',uuid)
      },3000)
    },
    upDone(uuid){
      setTimeout(()=>{
        console.log('loading data,pull up done')
        this.items.push(100,'done')
        this.$broadcast('pullup:done',uuid)
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
