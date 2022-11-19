<script setup lang="ts">
import { getIndexInfo } from '~/apis/index'
useHead({
  title: '点滴-前端技术博客',
  link: [
    {
      rel: 'icon', type: 'image/png', href: 'image/logo/favicon.ico',
    },
  ],
})
const { body } = await getIndexInfo()
const store = indexStore()
store.$patch({ data: body })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}
/*
html.dark {
  background: #222;
  color: white;
} */
</style>
