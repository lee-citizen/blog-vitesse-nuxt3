<script lang="ts" setup>
import Parallax from 'parallax-js'
import { getArticleList } from '~/apis/index'

// const { update } =
const { $loadMore, $loadStatus } = useNuxtApp()
interface TinfoIcon {
  icon: string
  name: string
  text: string
  color: string
}

const { body: list } = await getArticleList({ page: 1 })

const store = indexStore()
const info: { [propName: string]: any } = store.$state.data
const router = useRouter()
// 样式信息
const styleMap = reactive({
  layerStyle: {},
  imgStyle: {},
})

const boxH = ref('100%')
const boxW = ref('100%')
const isNav = ref(false)
const loading = ref(true)

const image = ref('')
// const windowChange = () => { }
const infoIcon: TinfoIcon[] = [{
  icon: 'icon-text',
  name: 'words',
  text: '善良',
  color: '#EF6D57',
}, {
  icon: 'icon-eye',
  name: 'read',
  text: '勇敢',
  color: '#50bcb6',
}, {
  icon: 'icon-like',
  name: 'like',
  text: '热爱',
  color: '#ffa800',
}]
// 菜单按钮
const menu = () => {
  isNav.value = !isNav.value
  document.body.style.overflowY = isNav.value ? 'hidden' : 'auto'
}
// 计算图片样式
const coverImg = () => {
  const width = parseInt(styleMap.layerStyle.width)
  const height = parseInt(styleMap.layerStyle.height)
  const ratio = 1080 / 1920
  const compute = height / width > ratio

  const style = {
    width: compute ? (`${height / ratio}px`) : `${width}px`,
    height: compute ? `${height}px` : (`${width * ratio}px`),
    left: '',
    top: '',
  }
  style.left = `${(width - parseInt(style.width)) / 2}px`
  style.top = `${(height - parseInt(style.height)) / 2}px`

  styleMap.imgStyle = reactive(Object.assign({}, styleMap.imgStyle, style))
}
// 计算coverLayer
const coverLayer = () => {
  const _w = parseInt(boxW.value)
  const _h = parseInt(boxH.value)
  let x; let y; let i
  const e = (_w >= 1000 || _h >= 1000) ? 1000 : 500

  if (_w >= _h) {
    i = _w / e * 50
    y = i
    x = i * _w / _h
  }
  else {
    i = _h / e * 50
    x = i
    y = i * _h / _w
  }
  const style = {
    width: `${_w + x}px`,
    height: `${_h + y}px`,
    marginLeft: `${-0.5 * x}px`,
    marginTop: `${-0.5 * y}px`,
  }
  styleMap.layerStyle = reactive(Object.assign({}, styleMap.layerStyle, style))
  coverImg()
}
// 计算加载图片loading时间
const loadImage = () => {
  const time = new Date().getTime()
  // Cover image loading is complete
  const img = new Image()
  img.src = `http://www.wdxdd.top${info.cover.image}`

  img.onload = () => {
    let timer = 500 - new Date().getTime() + time

    timer = timer < 0 ? 0 : timer

    setTimeout(() => {
      image.value = info.cover.image
      loading.value = false
    }, timer)
  }

  // Cover image init
  const scene = document.getElementById('scene')
  const parallax = new Parallax(scene as HTMLElement, {
    relativeInput: true,
    clipRelativeInput: true,
  })
}

const toArticle = (id: number) => {
  router.push(`/${id}`)
}
const getDate = (time: { [propName: string]: any }) => {
  return `${time.month.cn}月 ${time.day.on}, ${time.year}`
}
// 更新样式
const update = () => {
  boxH.value = `${document.documentElement.clientHeight}px`
  boxW.value = `${document.documentElement.clientWidth}px`
  coverLayer()
}

// 防抖监听屏幕变化更新图片样式
const { width, height } = useWindowSize()
watchDebounced(
  width,
  () => {
    update()
  },
  { debounce: 100, maxWait: 1000 },
)
watchDebounced(
  height,
  () => {
    update()
  },
  { debounce: 100, maxWait: 1000 },
)

onMounted(() => {
  if (!info)
    return
  update()
  loadImage()
  const store = indexStore()
  store.$patch({ index: true })
  $loadStatus(list)
})
const loadMoreData = () => {
  $loadMore('article', (res: any) => {
    if (res.status === 1)
      list.data = list.data.concat(res.body.data)

    else
      alert(res.data)
  })
}
</script>

<template>
  <div v-if="info" class="index max-w-full container absolute w-full" :class="{ navActive: isNav }">
    <div class="cover w-full h-100vh relative z-9999 overflow-hidden">
      <div id="scene" class="h-full relative overflow-hidden" :style="{ height: boxH }">
        <div class="layer" data-depth="0.4" :style="styleMap.layerStyle">
          <img
            id="image" class="absolute
            max-w-none block" :style="styleMap.imgStyle" :src="`http://www.wdxdd.top${image}`" width="1920"
            height="1080"
          >
        </div>
      </div>
      <div class="head c-[var(--color-bg-primary)] absolute md:top-70px top-40px w-full z-99999 p-x-40px p-y-0 f-b-c">
        <div class="logo-img w-100px h-44px relative">
          <img
            src="/image/logo/logo1.png" class="opacity-100 md:w-full absolute cursor-pointer
            left-1/2 top-0 h-full w-auto translate-x--1/2 h-auto
            md:left-auto md:top-auto sm:translate-x-none"
          >
          <img
            src="/image/logo/logo2.png" class="opacity-0 md:w-full absolute cursor-pointer left-1/2 top-0 h-full w-auto translate-x--1/2
            md:left-auto md:top-auto h-auto sm:translate-x-none"
          >
        </div>
        <div
          class="menu c-[var(--color-red)] text-center bg-white bg-opacity-90 w-30px h-30px leading-32px rounded-2px
          cursor-pointer" @click="menu"
        >
          <span class="iconfont text-20px" :class="isNav ? 'icon-close' : 'icon-menu'" />
        </div>
      </div>
      <div
        class="misk bg-#B00E25 absolute top-0 left-0 h-full w-full
        bg-opacity-70" :style="{ backgroundColor: info.cover.color }"
      />
      <div
        class="post
      absolute md:top-50/100 md:left-1/10 c-white -translate-y-1/2 lg:w-3/10 md:w-4/10
      md:bottom-auto
      bottom-8/100 left-5/100 top-auto w-7/10 transform-none
      "
      >
        <div class="time text-14px">
          {{ info.cover.date }}
        </div>
        <div class="title m-y-0 m-t-15px m-b-30px">
          <nuxt-link :to="info.cover.link" class="lg:text-28px text-22px c-white cursor-pointer hover:underline">
            {{ info.cover.title }}
          </nuxt-link>
        </div>
        <div class="describe leading-22px">
          {{ info.cover.describe }}
        </div>
      </div>
      <Menu />
    </div>

    <template v-if="Object.keys(list.data).length > 0">
      <div
        class="content
        after:content-empty
        after:w-1px
        after:h-[calc(100%+100px)]
        after:absolute
        after:-top-100px
        after:left-1/2
        after:bg-[var(--color-border-1)]
        z-0
        m-auto relative p-b-80px text-center sm:wfull lg:w900px xl:w-1200px
        "
      >
        <div
          v-for="(item, index) in list.data" :key="index" class="
          post group/post odd:text-left even:text-right md:border-b md:border-color-[var(--color-border-1)] relative
          lg:mt-100px mt60px z-1 lg:border-none"
        >
          <div
            class="img-box cursor-pointer border border-color-[var(--color-border-2)] text-0 inline-block relative
            z-3 overflow-hidden md:rounded-6px lg:w-480px lg:h-310px xl:w-680px xl:h-440px md:wfull md:hauto
            md:text-center md:border-none sm:w-full sm:h-auto sm:rounded-0" @click="toArticle(item.id)"
          >
            <img
              v-lazy="item.image.url" class="sm:mx-auto md:w680px md-max-w-full lg:w-full h-full hover:opacity-95"
              :alt="item.image.name"
            >
          </div>
          <div
            class="info group-even/post:text-left lg:border border-color-[var(--color-border-1)]
            group-odd/post:xl:left-660px group-even/post:xl:right-660px
            group-odd/post:lg:left-450px group-even/post:lg:right-450px md:w96/100
            md:bg-none
            bg-[var(--color-bg-primary)]
            lg:absolute rounded-6px pm-0 xl:top-20px xl:w-500px xl:h-400px xl:pt-80px xl:pr-100px xl:pl-80px
            lg:top-10px lg:w-420px lg:h-290px lg:pt-50px lg:pr-60px lg:pl-60px static px-20px py-40px mauto md:border-none
            border-b
            hauto
            md:mt-0
            mt--10px
            "
          >
            <div class="time c-#999 text-12px ">
              {{ getDate(item.time) }}
            </div>
            <div class="title title-line-2 xl:mt-8px mt-10px lg:leading-25px">
              <a @click="toArticle(item.id)">{{ item.title }}</a>
            </div>
            <div class="describe c-[var(--color-text-2)] text-14px leading-22px mt-10px">
              {{ item.describe }}
            </div>
            <div
              class="stuff c-#999 md:static text-12px lg:absolute flex xl:bottom-80px xl:left-80px lg:bottom-50px
              lg:left-60px md:mt-20px md:-ml-6px"
            >
              <div
                v-for="(v, i) in infoIcon" :key="i" class="group p-6px text-12px flex items-center relative
                transition-none"
              >
                <i class="iconfont" :class="v.icon" /><span>{{ item[v.name] }}</span>
                <span
                  class="hint opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  absolute bottom-full left-1/2 translate-x--1/2 translate-y--5px c-#fff
                  text-12px rounded-10px px-14px py-5px space-nowrap whitespace-nowrap
                  " :style="{ backgroundColor: v.color }"
                >{{ v.text }}<i
                  class="border-5px border-color-transparent absolute translate-x--1/2 left-1/2 -bottom-10px "
                  :style="{ borderTopColor: v.color }"
                /></span>
              </div>
            </div>
          </div>
        </div>
        <div class="more m-90px inline-block" @click="loadMoreData">
          <LoadMore />
        </div>
      </div>
    </template>
    <template v-else>
      <div
        class="content-null text-center p-40px text-16px c-#464646 font-600 tracking-4px
      "
      >
        主人太懒了，还没发表任何文章！！
      </div>
    </template>
    <div v-if="info.other && info.other.icp_txt" class="  foot text-center ">
      <a
        :href="info.other.icp_link"
        class="mx-auto my-0 text-13px c-[var(--color-text-2)] decoration-none inline-block pt-1px px-0 pb-2px"
        target="_blank"
      >{{ info.other.icp_txt }}</a>
    </div>
    <BackTop />
    <Loading v-if="loading" />
  </div>

  <div v-else class="no-data">
    请到管理员后台填写完整信息！
  </div>
</template>

<style lang="scss" scoped>
.index {
  .misk {
    clip-path: polygon(0 0, 25% 0, 60% 100%, 0% 100%)
  }

  .content {
    :deep(.bottom-loading) {
      position: relative;
      z-index: 999;

      .btn {
        border-radius: 0;
        display: inline-block;
        border: 1px solid var(--color-border-1);
        border-radius: 4px;
      }
    }

    .title {

      a {
        font-size: 24px;
        line-height: 30px;
        cursor: pointer;
        color: var(--color-text-1);
        transition: backgroundPosition 0s, color .3s;

        &:hover {
          background: radial-gradient(circle at 10px -7px, transparent 8px, currentColor 8px, currentColor 9px, transparent 9px) repeat-x,
            radial-gradient(circle at 10px 27px, transparent 8px, currentColor 8px, currentColor 9px, transparent 9px) repeat-x;
          background-size: 20px 20px;
          background-position: -10px calc(100% + 16px), 0 calc(100% - 4px);
          animation: waveFlow 1s infinite linear;
        }

        @keyframes waveFlow {
          from {
            background-position-x: -10px, 0;
          }

          to {
            background-position-x: -30px, -20px;
          }
        }

      }
    }

    .describe {
      color: var(--color-text-2);
      font-size: 14px;
      line-height: 22px;
      margin-top: 10px;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    div {

      &:nth-of-type(1):hover {
        color: #EF6D57;
      }

      &:nth-of-type(2):hover {
        color: #50bcb6;
      }

      &:nth-of-type(3):hover {
        color: #ffa800;
      }

      .iconfont {
        margin-right: 4px;
        margin-top: -4px;
        display: inline-block;
        transition: none;

        &.icon-like {
          font-size: 14px;
          margin-top: -1px;
        }

        &.icon-text {
          font-size: 17px;
          margin-top: -2px;
        }
      }

    }
  }

  @media screen and (max-width: 1200px) {
    .content {

      .post {

        .info {

          .describe {
            -webkit-line-clamp: 2;
          }
        }

      }
    }
  }

  @media screen and (max-width: 900px) {
    .cover {
      .misk {
        clip-path: polygon(0 0, 220px 0, 700px 100%, 0% 100%);
      }

    }

  }

  @media screen and (max-width: 780px) {
    .cover {

      .misk {
        clip-path: none;
      }

    }

  }

}

.index.navActive {
  .logo {
    color: #333;
  }

  .cover .head .logo-img img {
    opacity: 0;

    &:last-child {
      opacity: 1;
    }
  }

  .nav {
    top: 0;
  }
}

.title-line-2 {
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: none;
}
</style>
