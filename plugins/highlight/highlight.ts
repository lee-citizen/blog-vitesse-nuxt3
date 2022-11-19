import hljs from 'highlight.js'
import 'vue-hljs-with-line-number'
import './code.scss'
// import 'vue-hljs-with-line-number/line-number.css'
// import 'highlight.js/styles/androidstudio.css'
// 样式文件,我选的是atom-one-dark-reasonable样式 可以通过highlight.js/styles 选择其他css
// import 'highlight.js/styles/atom-one-dark-reasonable.css'
import 'highlight.js/styles/atom-one-dark.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('highlight', {
    mounted(el, binding) {
      // const element = el.querySelectorAll('pre code')
      // element.forEach((block) => {
      //   hljs.lineNumbersBlock(el, block, binding, {
      //     singleLine: true, // 开启单行行号显示
      //   })
      //   hljs.highlightBlock(block)
      // })
      const pre = el.querySelectorAll('.content pre')
      const element = el.querySelectorAll('.hljs code')
      element.forEach((block, index) => {
        hljs.lineNumbersBlock(block, block, binding, {
          singleLine: true, // 开启单行行号显示
        })
        // hljs.highlightBlock(block)

        // 插入复制功能
        const copy = document.createElement('div')
        copy.classList.add('hljs-copy')
        copy.innerText = '复制'
        // 添加点击事件
        copy.addEventListener('click', () => {
        // 创建一个输入框
          const textarea = document.createElement('textarea')
          document.body.appendChild(textarea)
          textarea.setAttribute('readonly', 'readonly')
          textarea.value = element[index].innerText
          textarea.select()
          if (document.execCommand('copy')) {
            document.execCommand('copy')

            copy.innerText = '复制成功'
          }
          document.body.removeChild(textarea)
        })

        pre[index].appendChild(copy)

        // 鼠标移入显示复制按钮
        el.addEventListener('mouseout', () => {
          copy.innerText = '复制'
          copy.style.display = 'none'
        })
        el.addEventListener('mouseover', () => {
          copy.style.display = 'block'
        })
      })

      // const code = el.querySelector('.hljs')
      // const els = el.querySelectorAll('.hljs-container')
      // console.log(els)
    },
  })
})

