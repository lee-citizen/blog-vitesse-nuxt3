<script setup lang="ts">
const status = computed(() => {
  return indexStore().$state.status
})
</script>

<template>
  <div class="bottom-loading" text-center>
    <div v-if="status === 'loading'" class="loader" h-34px w-100px flex items-center justify-between m-auto z-99>
      <div v-for="i in 5" :key="i" class="dot" />
    </div>
    <div v-else-if="status === 'nomore'" load-btn>
      呜呜，没有更多了~~
    </div>
    <div v-else class="more hover:c-#fff bg-[var(--color-active)] border-[var(--color-active)]" load-btn cursor-pointer>
      加载更多
    </div>
  </div>
</template>

<style lang='scss' scoped>
// loading
.dot {
  width: 15px;
  height: 15px;
  background: #3ac;
  border-radius: 100%;
  display: inline-block;
  animation: slide 1s infinite;
}

.dot:nth-child(1) {
  animation-delay: 0.1s;
  background: #32aacc;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
  background: #64aacc;
}

.dot:nth-child(3) {
  animation-delay: 0.3s;
  background: #96aacc;
}

.dot:nth-child(4) {
  animation-delay: 0.4s;
  background: #c8aacc;
}

.dot:nth-child(5) {
  animation-delay: 0.5s;
  background: #faaacc;
}

@-moz-keyframes slide {
  0% {
    transform: scale(1);
  }

  50% {
    opacity: 0.3;
    transform: scale(2);
  }

  100% {
    transform: scale(1);
  }
}

@-webkit-keyframes slide {
  0% {
    transform: scale(1);
  }

  50% {
    opacity: 0.3;
    transform: scale(2);
  }

  100% {
    transform: scale(1);
  }
}

@-o-keyframes slide {
  0% {
    transform: scale(1);
  }

  50% {
    opacity: 0.3;
    transform: scale(2);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes slide {
  0% {
    transform: scale(1);
  }

  50% {
    opacity: 0.3;
    transform: scale(2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
