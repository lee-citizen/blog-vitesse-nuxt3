// 导入默认图片
import { useIntersectionObserver } from '@vueuse/core'
import defaultImg from '/image/other/default.jpg'
// 引入监听是否进入视口
export default defineNuxtPlugin((nuxtApp) => {
  /**
 * 首页图片懒加载 start
 */

  nuxtApp.vueApp.directive('lazy', {
    mounted(el, binding) {
      // 设置默认图
      el.src = defaultImg

      // console.log('lazy', el, binding.value)

      // 实时监听el是否可见，如果可见，给他的src设置binding.value
      const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
        if (isIntersecting) {
          el.src = binding.value
          // 停止
          stop()
        }
      })

      // el是img标签
      // el.onerror 0级dom事件
      // el.onclick = () =>
      // el.addEventListener('click')
      // el.onerror = () => {
      // }
      el.addEventListener('error', () => {
        // console.log('失败11111')
        // 设置默认图
        el.src = defaultImg
      })
    },
  })
})

