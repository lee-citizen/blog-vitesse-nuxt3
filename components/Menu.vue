<script setup lang="ts">
const list = [
  {
    title: 'Article',
    url: 'article',
  },
  {
    title: 'Rainy',
    url: 'rain',
  },
  {
    title: 'Envelope',
    url: 'envelope',
  },
  {
    title: 'Subscribe',
    url: 'subscribe',
  },
  {
    title: 'Message',
    url: 'message',
  },
  {
    title: 'About',
    url: 'about',
  },
]

const viewList = computed(() => {
  return list.filter((item) => {
    const type = item.url
    if (['subscribe', 'message'].includes(type)) {
      // if ($store.state.data.administrator[type])
      return item
    }
    else {
      return item
    }
  })
})

const router = useRouter()
const toPage = (url: string) => {
  router.push(`/${url}`)
}
</script>

<template>
  <div
    class="nav fixed left-0 -top-100% w-100%  h-100% z-9999 f-c-c bg-white bg-opacity-96 duration-300 ease-in"
  >
    <ul class="nav-list w-80% block text-center -mt120px">
      <template v-for="(item, index) in viewList" :key="index">
        <li class="m-20px mt-0 list-none inline-block">
          <a
            class="md:text-24px text-18px  cursor-pointer c-#666 hover:c-#080808 tracking-1px"
            @click="toPage(item.url)"
          >{{ item.title
          }}</a>
        </li>
      </template>
    </ul>
    <div class="w-100% absolute bottom-30px block text-center">
      <span class="sm:text-16px text-14px">Everywhere in the world has a similar life.</span>
    </div>
  </div>
</template>

