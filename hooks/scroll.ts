import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'

export default function () {
  const { $throttle } = useNuxtApp()
  const scroll_current = ref(0) // 当前滚动条位置
  const scroll_isBottom: boolean = ref(false) // 滚动条触底
  let scrollFn: Function = (): void => { } // scroll 事件
  const scroll_direction: string = ref('') // 滚动方向

  const getWin = (type) => {
    return document.documentElement[type] || document.body[type]
  }

  const handleScroll = () => {
    const type = ['scrollTop', 'scrollHeight', 'clientHeight']
    const [t, h, windwH] = type.map(i => getWin(i))

    if (h === windwH) { // 兼容路由切换
      return
    }
    scroll_current.value = t
    scroll_isBottom.value = t + windwH >= h - 10
  }

  watch(scroll_current, (newValue, oldValue) => {
    if (newValue === null || newValue === undefined)
      return

    if (newValue - oldValue < 0)
      scroll_direction.value = 'top'

    else
      scroll_direction.value = 'bottom'
  })

  onBeforeMount(() => {
    scrollFn = $throttle(handleScroll, 100)
    window.addEventListener('scroll', scrollFn)
    handleScroll()
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', scrollFn)
  })

  return {
    scroll_current,
    scroll_isBottom,
    scroll_direction,
    getWin,

  }
}
