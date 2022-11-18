<script setup lang="ts">
const includeArr: Array<string> = ['index', 'about'] // 缓存页面
/**
 * TODO keepalive in includeArr
 */
</script>

<template>
  <div class="h-100%">
    <NuxtLoadingIndicator>
      <LoadingTab />
    </NuxtLoadingIndicator>
    <slot class="page" />
  </div>
</template>
