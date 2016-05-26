<template>
	<div class="wrapper">
		<div class="scroller">
			<slot></slot>
			<slot name="pulldown"></slot>
      <slot name="pullup"></slot>
		</div>
	</div>
</template>
<script>
	var iScroll = require('iscroll/build/iscroll-lite')

	export default{
		name: "vue-iscroller",
		props:{

		},

		
	}
</script>
<style scoped>
	.wrapper{
		position: absolute;
    z-index: 1;
    top: 0;
    bottom: 48px;
    left: 0;
    width: 100%;
    overflow: hidden;
	}
</style>