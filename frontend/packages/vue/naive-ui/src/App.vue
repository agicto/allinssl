<template>
	<!-- 主容器：最小高度为屏幕高度，使用浅灰色背景 -->
	<div class="min-h-screen bg-white">
		<div class="container mx-auto py-8">
			<!-- 页面标题 -->
			<h1 class="text-2xl font-bold mb-8 text-center">Form Builder</h1>
			<!-- 表单构建器组件 -->
			<Demo />
		</div>
	</div>
</template>

<script lang="ts" setup>
	import Demo from './views/Demo'
</script>
