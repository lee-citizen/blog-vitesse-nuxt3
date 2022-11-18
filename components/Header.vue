<script lang="ts" setup>
import QRCode from 'qrcode'
import myHooks from '~/hooks/scroll'
import { likeArticle } from '~/apis/index'
const props = defineProps({
  music: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  like: {
    type: String,
    default: '',
  },
  sticky: { // 吸顶动画
    type: Boolean,
    default: false,
  },
  articlePage: { // 文章页
    type: Boolean,
    default: false,
  },
  playMusic: { // 自动播放音乐
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (event: 'liked', isliked: boolean): void
}>()

const router = useRouter()
const { scroll_current, scroll_direction } = myHooks()
const palyStatus = ref('icon-play')
const progressLength = ref('')
const percent = ref(0)
const mobileMusic = ref('')
const dashArray = ref(Math.PI * 100)
const isLike = ref(false)
const qrccode = ref('')
const changeClass = ref('')
let likeTime: NodeJS.Timeout | null = null
const likeHint = ref(false)
const played = ref(false)
const ss = ref('')
const store = indexStore()
const data: { [propName: string]: any } = store.$state.data

const platform = ref('')
const scrollStatus = () => {
  if (Number(scroll_current) >= 100) {
    if (scroll_direction === 'top')
      changeClass.value = 'show'

    else if (changeClass.value === 'show')
      changeClass.value = 'exit'
  }
  else {
    changeClass.value = ''
  }
  // if (val != undefined && this.playMusic && !this.played) {     // 偷偷摸摸 播放音乐
  //     setTimeout(() => {
  //         this.changeMusic()
  //     }, 100);
  // }
}
const changeMusic = async () => {
  played.value = true

  const musicTag = document.getElementById('music') as HTMLAudioElement

  let duration = musicTag && musicTag.duration
  let result

  // WeChat Browser
  palyStatus.value = palyStatus.value === 'icon-play' ? 'icon-pause' : 'icon-play'

  if (palyStatus.value === 'icon-pause') {
    if (!musicTag.ondurationchange) { // 第一次播放音乐
      musicTag.load()
      duration = await new Promise((resolve, reject) => {
        musicTag.ondurationchange = () => {
          resolve(musicTag.duration)
        }
      })
    }
    try {
      await musicTag.play()
    }
    catch (err) {
      alert('自动播放音乐出现错误，请点击左上角进行播放！')
      changeMusic()
      return
    }
    const fn = () => {
      setTimeout(() => {
        result = musicTag.currentTime / duration
        progressLength.value = `${(100 * result).toFixed(2)}%`
        percent.value = result
        if (palyStatus.value === 'icon-pause')
          fn()
      }, 50)
    }
    fn()
  }
  else {
    musicTag.pause()
  }
}
const touch = (e: Event) => {
  const target = e.target as HTMLDivElement
  const className = target.classList.value
  // Wechat code
  if (className === 'iconfont icon-wechat')
    qrccode.value = qrccode.value ? '' : 'qrccode'

  else
    qrccode.value = ''

  if (['myself', 'logo-img'].includes(className))
    return

  // Played for the first time
  if (!played.value && className !== 'iconfont icon-play')
    changeMusic()
}
const dashOffset = computed(() => {
  return (1 - percent.value) * dashArray.value
})
// 喜欢
const onLike = async () => {
  if (isLike.value) {
    if (likeTime)
      clearTimeout(likeTime)

    likeHint.value = true
    likeTime = setTimeout(() => likeHint.value = false, 2000)
  }
  else {
    const res = await likeArticle(props.like)
    if (res) {
      isLike.value = true
      emit('liked', true)
      localStorage.setItem(`like-${props.like}`, 'true')
    }
  }
}

onBeforeUnmount(() => {
  props.playMusic && window.removeEventListener(platform.value, touch)
})
onMounted(() => {
  const o = {
    articlePage: () => {
      nextTick(() => {
        const canvas = document.getElementById('qrccode')
        QRCode.toCanvas(canvas, window.location.href)
      })

      isLike.value = !!localStorage.getItem(`like-${props.like}`)
      // console.log(isLike.value)
    },
    sticky: () => {
      // $watch('scroll_current', this.scrollStatus, { immediate: true })
      watch(
        scroll_current,
        scrollStatus,
        { immediate: true },
      )
    },
    playMusic: () => {
      // PC or Mobile
      try {
        document.createEvent('TouchEvent')
        platform.value = 'touchstart'
      }
      catch (e) {
        platform.value = 'click'
      }
      document.addEventListener(platform.value, touch)
    },
  }
  for (const key in o)
    [key] && o[key]()
})
</script>

<template>
  <header>
    <div class="header-content" :class="[qrccode, changeClass]">
      <!-- Article Page -->
      <canvas v-if="like" id="qrccode" />
      <div class="l icon">
        <!-- <span class="iconfont icon-logo3 logo" @click="toIndex"></span> -->
        <div class="logo-img" @click="router.push('/')">
          <img src="/image/logo/logo3.png">
        </div>
        <span class="iconfont" :class="[palyStatus]" @click="changeMusic" />
      </div>

      <div class="title" :class="{ active: scroll_current >= 100 }">
        {{ title }}
      </div>

      <div class="r icon">
        <!-- Article Page -->
        <template v-if="like">
          <span class="iconfont icon-wechat" />
          <span class="iconfont icon-like" :class="{ like: isLike }" @click="onLike" />
        </template>
        <span class="myself" @click="router.push('/about')">
          <img :src="data.base.admin_avatar">
        </span>
      </div>

      <!-- liked hint -->
      <div v-if="like" class="like-hint-box" :class="{ likeHint }">
        <div class="like-hint">
          只能点赞一次哦！
        </div>
        <span />
        <span />
      </div>

      <!-- Music Progress -->
      <div class="musicBar" :style="{ width: progressLength }" />
    </div>

    <!-- mobile music icon -->
    <div class="music-btn" :class="[mobileMusic]" @click="changeMusic">
      <svg class="progress-circle" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
        <circle
          class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray"
          :stroke-dashoffset="dashOffset"
        />
      </svg>
      <span class="iconfont" :class="[palyStatus]" />
    </div>

    <audio id="music" loop preload="auto">
      <source type="audio/mpeg" :src="music">
    </audio>
  </header>
</template>

<style lang="scss" scoped>
@keyframes headShow {
  from {
    opacity: 0;
    top: -50px;
  }

  to {
    top: 0;
    opacity: 1;
  }
}

@keyframes headExit {
  from {
    top: 0;
    opacity: 1;
  }

  to {
    opacity: 0;
    top: -50px;
  }
}

.header-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid var(--color-border-2);
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-text-2);
  padding: 0 15px;
  background: var(--color-bg-primary);
  z-index: 99999;
  transition: all .3s;

  &.show {
    position: fixed;
    animation: headShow 0.6s both;
    box-shadow: 0 1px 8px var(--color-shadw-1);
    background: var(--color-bg-opacity);
  }

  &.exit {
    position: fixed;
    animation: headExit 0.6s both;
    box-shadow: 0 1px 8px var(--color-shadw-1);
    background: var(--color-bg-opacity);
  }

  .musicBar {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 50px;
    z-index: -1;
    background: var(--color-border-1);
  }

  .title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    transition: all .8s;
    text-align: center;
    opacity: 0;

    &.active {
      opacity: 1;
    }
  }

  .logo-img {
    width: 30px;
    margin-top: 4px;
    vertical-align: middle;
    display: inline-block;
    cursor: pointer;

    img {
      width: 100%;
    }
  }

  .icon .iconfont {
    color: var(--color-text-3);
    font-size: 20px;
    cursor: pointer;
    margin: 4px 5px 0;
    transition: all .3s;
    vertical-align: middle;
    display: inline-block;

    &.logo {
      color: #444;
      font-size: 30px;
    }

    &.icon-github {
      font-size: 28px;
      position: absolute;
      right: 48px;
      top: 5px;

      &:hover {
        color: #000;
      }
    }

    &.like,
    &.icon-like:hover {
      color: #EF6D57;
    }

    &.icon-wechat:hover {
      color: #0cd438;
    }

    &:hover {
      color: var(--color-dark)
    }
  }

  .myself {
    width: 26px;
    height: 26px;
    display: inline-block;
    border-radius: 50%;
    overflow: hidden;
    vertical-align: bottom;
    margin-left: 8px;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }

  #qrccode {
    height: 180px !important;
    width: 180px !important;
    padding: 10px;
    position: absolute;
    top: 60px;
    right: 10px;
    background: var(--color-bg-primary);
    border-radius: 10px;
    border: 1px solid #eee;
    box-shadow: 0 4px 10px #eee;
    opacity: 0;
    visibility: hidden;
    transition: all .3s;
  }

  &.qrccode {
    #qrccode {
      opacity: 1;
      visibility: visible;
    }

    .icon-wechat {
      color: #0cd438;
    }
  }

  .like-hint-box {
    position: absolute;
    top: 60px;
    right: 75px;
    transition: all .4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    transform-origin: right top;
    transform: scale(0);
    opacity: 0;
    visibility: hidden;

    .like-hint {
      position: absolute;
      top: 30px;
      right: 40px;
      background: #ef6c57;
      color: var(--color-bg-primary);
      font-size: 13px;
      width: 210px;
      height: 110px;
      line-height: 114px;
      text-align: center;
      border-radius: 220px / 120px;
    }

    span {
      position: absolute;
      top: 13px;
      right: 13px;
      height: 28px;
      width: 28px;
      border-radius: 50%;
      background: #ef6b57;

      &:last-child {
        width: 14px;
        height: 14px;
        right: 0;
        top: 0;
      }
    }

    &.likeHint {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
    }
  }
}

.music-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 36px;
  padding: 3px;
  height: 36px;
  color: var(--color-bg-primary);
  opacity: 0.8;
  cursor: pointer;
  z-index: 9999999;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  display: none;

  .progress-circle {
    height: 30px;
    width: 30px;

    circle {
      stroke-width: 10px;
      transform-origin: center;

      &.progress-background {
        transform: scale(0.9);
        stroke: var(--color-bg-primary);
      }

      &.progress-bar {
        transform: scale(0.9) rotate(-90deg);
        stroke: #50bcb6;
      }
    }
  }

  .iconfont {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    padding: 1px 0 0 3px;
    font-size: 14px;

    &.icon-pause {
      padding-left: 1px;
    }
  }
}

@media screen and (max-width: 600px) {
  .header-content {
    position: absolute;

    .scrollbar {
      position: fixed;
      height: 1px;
    }

    .iconfont.logo {
      font-size: 28px;
      margin: 4px 0 0;
    }

    .like-hint-box {
      right: 45px;
    }
  }

  .music-btn {
    opacity: 0;
    display: none;

    &.show {
      display: block;
      visibility: visible;
      animation: fadeInTop 0.6s both;
    }

    &.exit {
      display: block;
      opacity: 0;
      animation: fadeInDown 0.6s both;
    }
  }
}

@keyframes fadeInTop {
  from {
    opacity: 0;
    transform: translate(0, 30px);
  }

  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 1;
    transform: translate(0, 0px);
  }

  to {
    opacity: 0;
    visibility: hidden;
    transform: translate(0, 30px);
  }
}
</style>
