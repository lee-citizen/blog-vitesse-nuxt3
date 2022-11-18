<script lang="ts" setup>
import myHooks from '~/hooks/scroll'
import { getArticleDetail } from '~/apis/index'
const commentTotal = ref(0)
const contentHeight = ref(0)
const clientHeight = ref(0)
const header = ref(true)
const isLike = ref(false)
const likeHint = ref(false)
const { scroll_current, scroll_direction, getWin } = myHooks()
// const data: any = {}
const route = useRoute()
const { $skinStatus } = useNuxtApp()
const id = route.params.articleId as string
const { body: data } = await getArticleDetail(id) as any

// data.contentHtml = data.contentHtml.replace(/<pre>/g, '<div class=\'hljs-container\'><pre >')
// data.contentHtml = data.contentHtml.replace(/<\/pre>/g, '</div></pre >')

// data.contentHtml.replace(/<\/pre>/g, '</pre></div>')

// const colorMode = useColorMode()

// console.log(colorMode)

let likeTime: NodeJS.Timeout | null = null
const options = [
  {
    type: 'read',
    icon: 'icon-eye2',
  }, {
    type: 'comment',
    icon: 'icon-comment',
  }, {
    type: 'like',
    icon: 'icon-xihuan',
  }, {
    type: 'skin',
    icon: 'icon-yueliang',
  }, {
    type: 'top',
    icon: 'icon-top',
  },
]
const info = computed(() => {
  // return $store.state.data
})
const postProgress = computed(() => {
  if (contentHeight.value < clientHeight.value)
    return '100%'

  if (!scroll_current)
    return

  const h: number = contentHeight.value - clientHeight.value + 100
  const n = Number(100 * (scroll_current.value / h)).toFixed(4)
  return Number(n) < 100 ? `${n}%` : '100%'
})
const getHeight = () => {
  const domList = ['.content', '.stuff', '.title']
  const height = domList.reduce((t, i) => {
    t += document.querySelector(i).offsetHeight
    return t
  }, 0)
  return height
}
onMounted(() => {
  setTimeout(() => {
    clientHeight.value = getWin('clientHeight')
    contentHeight.value = getHeight()
    isLike.value = !!localStorage.getItem(`like-${data._id}`)
  })
})
const getItemData = (type: string) => {
  const o = {
    skin: () => 'skin',
    comment: () => commentTotal.value,
    other: () => data[type],
  }
  return o[type] ? o[type]() : o.other()
}
const onOptions = (type: string) => {
  if (type === 'read')
    return

  const o = {
    comment: () => {
      const oCommentTop = document.getElementById('href-comment')
      if (oCommentTop) {
        oCommentTop.click()
        return
      }
      const a = document.createElement('a')
      a.setAttribute('href', '#comment')
      a.setAttribute('id', 'href-comment')
      document.body.appendChild(a)
      a.click()
    },
    top: () => {
      // $setScroll('top', 500)
    },
    skin: () => {
      // $skin()
    },
    like: () => {
      if (isLike) {
        if (likeTime)
          clearTimeout(likeTime)
        likeHint.value = true
        likeTime = setTimeout(() => likeHint.value = false, 2000)
      }
      // $refs.header.onLike()
    },
  }
  o[type]()
}

const liked = () => {
  isLike.value = true
  data.like++
}
const totalComment = (val: number) => {
  commentTotal.value = val
}

// async asyncData(context){
//         const id = context.params.articleId
//         const { data } = await context.$axios.get(`article/${id}`)
//         if (data.status == 1) {
//             return { data: data.body }
//         } else {
//             context.error({ statusCode: 404, message: '页面未找到～' })
//         }
//     },
const validate = ({ params }) => {
  return /^\d+$/.test(params.articleId)
}

onMounted(() => {
  setTimeout(() => {
    clientHeight.value = getWin('clientHeight')
    contentHeight.value = getHeight()
    isLike.value = !!localStorage.getItem(`like-${data._id}`)
  })
})
</script>

<template>
  <div class="articleld">
    <!-- Article Progress -->
    <div class="scrollbar" :style="{ width: postProgress }" />

    <Header
      ref="header" :music="data.music.url" :title="data.title" :like="data._id" :sticky="true" :play-music="true"
      :article-page="true" @liked="liked"
    />

    <section v-if="data">
      <h1 class="title">
        {{ data.title }}
      </h1>
      <div class="stuff">
        <span>{{ data.time.month.cn }}月 {{ data.time.day.on }}, {{ data.time.year }}</span>
        <span>阅读 {{ data.read }}</span>
        <span>字数 {{ data.words }}</span>
        <span>评论 {{ commentTotal }}</span>
        <span>喜欢 {{ data.like }}</span>
      </div>
      <!-- v-highlight -->
      <div v-highlight class="content" v-html="data.contentHtml" />
    </section>

    <!-- Comment -->
    <Comment :id="data.id" :title="data.title" @total="totalComment" />

    <footer :class="{ show: scroll_current >= 100 && scroll_direction === 'bottom' }">
      <div class="foot-box">
        <h2>{{ data.title }}</h2>
        <ul class="options">
          <li
            v-for="(item, index) in options" :key="index" :class="{ active: item.type === 'like' && isLike }"
            @click="onOptions(item.type)"
          >
            <div v-if="item.type === 'like'" class="like-hint-box" :class="{ likeHint }">
              <div class="like-hint">
                只能点赞一次哦！
              </div>
              <span />
              <span />
            </div>
            <span
              class="iconfont" :class="[
                item.type === 'skin' && $skinStatus() ? 'icon-taiyang' : item.icon,
                item.type === 'like' && isLike ? 'icon-like' : '',
              ]"
            />
            <span :class="{ skin: item.type === 'skin' }">{{ getItemData(item.type) }}</span>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.articleld {
  position: absolute;
  width: 100%;

  section {
    width: 800px;
    margin: auto;
    transition: none;
  }

  .scrollbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--color-bar);
    transition: width .5s ease;
    z-index: 999999;
  }

  h1.title {
    font-size: 30px;
    padding: 130px 0 22px;
    color: var(--color-text-1);
  }

  .stuff {
    color: var(--color-text-2);
    position: relative;
    line-height: 22px;

    span {
      font-size: 13px;
      margin-right: 10px;
      display: inline-block;
    }

    &:after {
      content: '';
      width: 100px;
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      border-bottom: 1px solid var(--color-border-1);
    }
  }

  .content {
    padding: 100px 0;
    font-size: 14px;
    color: var(--color-text-1);

    ::v-deep {

      // box-shadow: none !important;
      // min-height: auto;
      // background: var(--color-bg-primary);
      // color: var(--color-text-1);
      p {
        line-height: 36px;
        margin: 0 0 22px;
        font-size: 16px;

        mark {
          padding: 4px 4px 0;
          line-height: 22px;
          display: inline-block;
          font-size: 16px;
        }

        strong {
          font-weight: bold;
          font-size: 16px;
        }

        ins {
          font-size: 16px;
        }
      }

      h1,
      h2,
      h3,
      h4,
      h5 {
        border: 0;
        padding: 0;
        margin: 0 0 22px;
        line-height: 28px;
        font-size: revert;
      }

      img {
        max-width: 100%;
        border-radius: 4px;

        &:hover {
          box-shadow: 0 0 10px #999;
        }
      }

      blockquote {
        border-radius: 10px;
        padding-left: 22px;
        margin-bottom: 20px;
        padding: 0 1em;
        color: var(--color-text-6);
        border-left: .25em solid #dfe2e5;
        overflow: hidden;

        p {
          margin: 10px 0;
        }
      }

      ul,
      ol {
        margin: 0 0 20px;

        li {
          margin: 10px 0;
          line-height: 28px;
        }
      }

      // ul li {
      //   list-style: none;
      //   position: relative;

      //   &:after {
      //     content: '☼';
      //     font-size: 8px;
      //     position: absolute;
      //     top: 0px;
      //     left: -16px;
      //   }
      // }

      iframe {
        width: 100%;
        height: 450px;
        margin-bottom: 20px;
      }
    }
  }

  .back-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    height: 20px;
    line-height: 20px;
    background: #50bcb6;
    font-size: 13px;
    z-index: 9999;
    padding: 0 5px;
    color: var(--color-bg-primary);
  }

  footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--color-bg-opacity);
    box-shadow: 0 -2px 12px var(--color-shadw-1);
    transition: all 0.6s;
    transform: translateY(100%);

    &.show {
      transform: translateY(0);
    }

    .foot-box {
      width: 800px;
      height: 70px;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    h2 {
      font-size: 16px;
      color: var(--color-text-2);
    }

    .options {
      display: flex;

      li {
        position: relative;
        list-style: none;
        margin-left: 6px;
        min-width: 32px;
        height: 30px;
        line-height: 30px;
        text-align: center;

        &:not(:first-child) {
          cursor: pointer;

          &:hover {

            span,
            span.icon-top {
              font-weight: 600;
            }
          }

          &.active span {
            color: var(--color-pink)
          }
        }

        span:last-child {
          font-size: 12px;
          color: var(--color-text-1);
          transform: translate(-4px, -14px);
          display: inline-block;

          &.skin {
            display: none;
          }
        }

        .iconfont {
          color: var(--color-text-1);
          font-size: 20px;

          &.icon-top {
            font-size: 28px;
            color: var(--color-text-2);
          }

          &.icon-taiyang {
            font-size: 22px;
          }
        }

        & *,
        & *::before {
          transition: none;
        }

        .like-hint-box {
          position: absolute;
          top: 20px;
          right: 20px;
          transition: all .4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
          transform-origin: right bottom;
          transform: scale(0);
          opacity: 0;
          visibility: hidden;

          & * {
            transition: all .3s;
          }

          .like-hint {
            position: absolute;
            top: -180px;
            right: 54px;
            background: #ef6c57;
            color: #fff;
            font-size: 13px;
            width: 210px;
            height: 110px;
            line-height: 114px;
            text-align: center;
            border-radius: 220px / 120px;
          }

          span {
            position: absolute;
            top: -78px;
            right: 28px;
            height: 28px;
            width: 28px;
            border-radius: 50%;
            background: #ef6b57;

            &:last-child {
              width: 14px;
              height: 14px;
              right: 12px;
              top: -34px;
            }
          }

          &.likeHint {
            opacity: 1;
            visibility: visible;
            transform: scale(1);
          }
        }
      }
    }
  }
}

@media screen and (max-width: 820px) {
  .articleld {
    section {
      width: 86%;
    }

    h1.title {
      font-size: 20px;
      padding: 90px 0 15px;
    }

    .content {
      padding: 60px 0;

      ::v-deep {
        p {
          line-height: 28px;
        }

        iframe {
          height: 390px;
        }
      }
    }

    footer {
      width: 86%;
      left: 7%;

      &.show {
        bottom: 20px;
      }

      .foot-box {
        width: 100%;
        padding: 0 60px 5px;

        h2 {
          display: none;
        }

        .options {
          width: 100%;
          justify-content: space-between;

          li {
            display: flex;
            flex-direction: column;
            line-height: normal;

            span:last-child {
              transform: none;
              margin-top: 2px;

              &.skin {
                display: block;
              }
            }

            .icon-top {
              margin-top: 4px;
            }

            .like-hint-box {
              top: 8px;
              right: 10px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .articleld {
    ::v-deep header {

      .icon-like,
      .like {
        display: none !important;
      }
    }

    .content {
      ::v-deep {
        iframe {
          height: 310px;
        }

        blockquote {
          padding-left: 16px;
        }

        p {
          font-size: 14px;

          strong,
          mark {
            font-size: 14px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .articleld {
    .content {
      ::v-deep {
        iframe {
          height: 260px;
        }
      }
    }

    footer .foot-box {
      padding: 0 8% 5px;

      .options li .like-hint-box {
        right: 14px;
        transform-origin: center bottom;

        span,
        .like-hint {
          right: 50% !important;
          transform: translateX(50%) !important;
        }

        span:nth-of-type(1) {
          top: -65px;
        }
      }
    }
  }
}

@media screen and (max-width: 414px) {
  .content {
    ::v-deep {
      iframe {
        height: 220px;
      }
    }
  }
}
</style>
