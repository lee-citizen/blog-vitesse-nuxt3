<script setup lang="ts">
import myHooks from '~/hooks/scroll'
const { $setScroll } = useNuxtApp()

const backTop = (): void => {
  $setScroll('top')
}
const { scroll_current } = myHooks()
</script>

<template>
  <div
    class="bottom-10px right-20px back-top fixed cursor-pointer z-1 sm:bottom-20px right-30px"
    :class="scroll_current >= 1000 ? 'visible opacity-100' : 'invisible opacity-0'" @click="backTop"
  >
    <span class="iconfont icon-top hover:text-[var(--color-active)] c-#73aada text-30px sm:text-40px" />
  </div>
</template>

