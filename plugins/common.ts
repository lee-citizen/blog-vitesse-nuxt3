import { getArticleList } from '~/apis/index'
// 引入监听是否进入视口
export default defineNuxtPlugin(() => {
  let timerScroll = null
  function getWin(type) {
    return document.documentElement[type] || document.body[type]
  }

  const Tween = {
    linear(t, b, c, d) { // 匀速
      return c * t / d + b
    },
    easeIn(t, b, c, d) { // 加速
      return c * (t /= d) * t + b
    },
    easeOut(t, b, c, d) { // 减速
      return -c * (t /= d) * (t - 2) + b
    },
    easeBoth(t, b, c, d) { // 加速减速
      // eslint-disable-next-line no-cond-assign
      if ((t /= d / 2) < 1)
        return c / 2 * t * t + b

      return -c / 2 * ((--t) * (t - 2) - 1) + b
    },
    easeInStrong(t, b, c, d) { // 加加速
      return c * (t /= d) * t * t * t + b
    },
  }
  let [page, loadType, time] = [1, 'more', null]

  function setLoadType(type) {
    const store = indexStore()
    store.$patch({ status: type })

    loadType = type
    time = null
  }

  return {

    provide: {
      skinStatus: () => {
        const skinMode = useColorMode()
        return skinMode.preference === 'dark'
      },
      // hello: (msg: string) => `Hello ${msg}!`,
      throttle: (fn, interval) => {
        let flag = true
        return function (...args) {
          if (flag) {
            flag = false
            setTimeout(() => {
              fn.apply(this, args)
              flag = true
            }, interval)
          }
        }
      },
      debounce: (fn, interval) => {
        let timer = null
        return function (...args) {
          if (timer)
            clearTimeout(timer)
          timer = setTimeout(() => {
            fn.apply(this, args)
          }, interval)
        }
      },
      /**
 * 设置滚动条位置
 * @param {String} type  => 类型
 * @param {Number} speed => 速度
 */
      setScroll: (type, times = 1000) => {
        const startTime = new Date().getTime()
        const typeList = {
          index: () => {
            return getWin('scrollTop') + getWin('clientHeight') / 2
          },
          article: '',
          envelope: '',
          message: '',
          comment: () => {
            const form = document.querySelector('.comment-form')
            const h = form.offsetHeight
            const t = form.offsetTop
            return t + h + 20 - getWin('clientHeight')
          },
          viewComment: () => {
            const comment = document.getElementById('comment')
            const top = comment.offsetTop
            return top
          },
          top: () => 0,
        }

        const target = typeList[type]()
        let beforeScroll = 0

        // console.warn(target)

        timerScroll = setInterval(() => {
          let curScroll = getWin('scrollTop')
          const curTime = new Date().getTime()
          const t = times - Math.max(0, startTime - curTime + times)
          const value = Tween.linear(t, curScroll, target - curScroll, times)

          curScroll = document.body.scrollTop = document.documentElement.scrollTop = value

          /**
           * 终点 & 边界处理
           */
          let result = null
          if (type === 'comment' || type === 'viewComment')
            result = (beforeScroll && curScroll > beforeScroll) || curScroll <= target || curScroll === 0

          else if (type === 'top')
            result = curScroll === target || (beforeScroll && curScroll > beforeScroll)

          else
            result = curScroll <= beforeScroll || curScroll === target

          result && clearInterval(timerScroll)

          beforeScroll = curScroll
        }, 25)
      },
      // Load More

      loadMore: (type, callback, from) => {
        if (type === 'none') { // reset
          page = 1
          loadType = 'more'
          return
        }
        if (loadType === 'loading' || loadType === 'nomore')
          return

        // const axios = Vue.prototype.$nuxt.$options.$axios

        page++
        setLoadType('loading')

        time = new Date().getTime()

        const params = { page, from }
        // console.log({ params })

        getArticleList(params).then((res) => {
          const { body: data } = res

          const result = data.page === data.totalPage ? 'nomore' : 'more'
          // loading 效果最少 500ms
          let timer = 500 - new Date().getTime() + time
          timer = timer < 0 ? 0 : timer

          setTimeout(() => {
            callback(res)
            setLoadType(result)
            const { $setScroll } = useNuxtApp()
            $setScroll('index')
          }, timer)
        }).catch((err) => {
          page--
          setLoadType('more')
          callback(err)
        })
      },
      loadStatus: (data) => {
        if (data.page === data.totalPage)
          setLoadType('nomore')
      },

    },

  }
})

