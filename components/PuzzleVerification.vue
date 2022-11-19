<script lang="ts" setup>
const props = defineProps({
  // 画布图片的尺寸
  width: {
    type: [Number],
    default: 260,
  },
  height: {
    type: [Number],
    default: 160,
  },
  // 滑块的大小
  blockSize: {
    type: [Number],
    default: 40,
  },
  // 误差
  deviation: {
    type: [Number],
    default: 4,
  },
  // 滑块随机出现的范围
  wraperPadding: {
    type: [Number],
    default: 100,
  },
  onSuccess: {
    type: Function,
    default: () => { },
  },
  onError: {
    type: Function,
    default: () => { },
  },
  verificationShow: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits<{
  (event: 'clone', type: string, result: boolean): void
}>()
const isVerificationShow = ref(0)
const moveStart = ref('')
const displayTips = ref(false)
const verification = ref(false)
const randomX = ref(0)
const randomY = ref(0)
const imgRandom = ref('')
const left_Num = ref(0)
const refList = ['puzzleBox', 'puzzleShow']
const puzzleBox = ref()
const puzzleShow = ref()
const sliderBtn = ref()
watch(() => props.verificationShow, (newValue) => {
  isVerificationShow.value = newValue
})
// 清空画布
const clearCanvas = () => {
  const c = puzzleBox.value
  const c_l = puzzleShow.value
  // let c_s = this.$refs.puzzleShadow;
  c.setAttribute('height', c.getAttribute('height'))
  c_l.setAttribute('height', c.getAttribute('height'))
  // c_s.setAttribute("height", c.getAttribute("height"))
}
const initCanvas = () => {
  clearCanvas()

  const w = props.width
  const h = props.height
  const PL_Size = props.blockSize
  const padding = props.wraperPadding
  const MinN_X = padding + PL_Size
  const MaxN_X = w - padding - PL_Size - PL_Size / 6
  const MaxN_Y = padding
  const MinN_Y = h - padding - PL_Size - PL_Size / 6

  randomX.value = Math.round(Math.random() * (MaxN_X - PL_Size) + MinN_X)
  randomY.value = Math.round(Math.random() * MaxN_Y + MinN_Y)

  const X = randomX.value
  const Y = randomY.value
  const d = PL_Size / 3

  left_Num.value = -X + 10
  refList.forEach(i => render(i, X, Y, d))
}

const status = computed(() => {
  const o = {
    0: '',
    1: 'show',
    2: 'exit',
  }
  return o[isVerificationShow.value]
})
const closeVerificationBox = () => {
  isVerificationShow.value = 2
  emit('clone', 'slider', false)
}
// 滑块移动中
const moving = (e: any) => {
  e = e || window.event
  const moveX = e.pageX || e.targetTouches[0].pageX
  const d = moveX - Number(moveStart.value)
  const w = props.width
  const PL_Size = props.blockSize
  const padding = props.wraperPadding

  if (moveStart.value === '' || (d < 0 || d > w - padding - PL_Size + 90))
    return

  sliderBtn.value.style.left = `${d}px`
  puzzleShow.value.style.left = `${d}px`
  sliderBtn.value.style.transition = 'inherit'
  puzzleShow.value.style.transition = 'inherit'
}
// 移动结束，验证并回调
const moveEnd = (e: any) => {
  e = e || window.event
  const moveEnd_X = (e.pageX || e.changedTouches[0].pageX) - Number(moveStart.value)
  const ver_Num = randomX.value - 10
  const deviationValue = props.deviation
  const Min_left = ver_Num - deviationValue
  const Max_left = ver_Num + deviationValue

  const verResult = Max_left > moveEnd_X && moveEnd_X > Min_left

  if (moveStart.value !== '') {
    displayTips.value = true
    verification.value = verResult
    setTimeout(() => {
      displayTips.value = false
      if (verResult) {
        props.onSuccess('slider', true)
      }
      else {
        initCanvas()
        props.onError()
      }
    }, 1000)
  }

  const result = ['sliderBtn', 'puzzleShow']

  if (result.every(i => typeof i !== 'undefined') && !verResult) {
    setTimeout(() => {
      sliderBtn.value.style.left = 0
      puzzleShow.value.style.left = 0
      sliderBtn.value.style.transition = 'left 0.5s'
      puzzleShow.value.style.transition = 'left 0.5s'
    }, 400)
    sliderBtn.value.style.backgroundPosition = '0 -84px'
  }
  moveStart.value = ''
}

const addMouseMoveListener = () => {
  document.addEventListener('mousemove', moving)
  document.addEventListener('touchmove', moving)
  document.addEventListener('mouseup', moveEnd)
  document.addEventListener('touchend', moveEnd)
}
// 按住滑块
const startMove = (e: any) => {
  e = e || window.event
  sliderBtn.value.style.backgroundPosition = '0 -216px'
  moveStart.value = e.pageX || e.targetTouches[0].pageX
  addMouseMoveListener()
}

const render = (type: string, X: number, Y: number, d: number) => {
  let canvas: any = null
  if (type === 'puzzleBox') {
    canvas = puzzleBox.value
    canvas.globalCompositeOperation = 'xor'
    canvas.fillStyle = 'rgba(255,255,255)'
  }
  else if (type === 'puzzleShow') {
    canvas = puzzleShow.value
    const w = props.width
    const h = props.height
    const img = new Image()
    img.src = imgRandom.value
    img.onload = function () {
      canvas.drawImage(img, 0, 0, w, h)
    }
  }
  canvas.beginPath()
  canvas.moveTo(X, Y)
  canvas.lineTo(X + d, Y)
  canvas.bezierCurveTo(X + d, Y - d, X + 2 * d, Y - d, X + 2 * d, Y)
  canvas.lineTo(X + 3 * d, Y)
  canvas.lineTo(X + 3 * d, Y + d)
  canvas.bezierCurveTo(X + 2 * d, Y + d, X + 2 * d, Y + 2 * d, X + 3 * d, Y + 2 * d)
  canvas.lineTo(X + 3 * d, Y + 3 * d)
  canvas.lineTo(X, Y + 3 * d)
  canvas.closePath()

  if (type === 'puzzleShow') {
    canvas.clip()
  }
  else {
    canvas.strokeStyle = 'rgba(0,0,0,0)'
    canvas.stroke()
    canvas.fill()
  }
}

const refreshImg = () => {
  initCanvas()
}
onMounted(() => {
  puzzleBox.value.width = props.width
  puzzleBox.value.height = props.height
  puzzleShow.value.width = props.width
  puzzleShow.value.height = props.height
  nextTick(initCanvas)
})
onUnmounted(() => {
  document.removeEventListener('mousemove', moving)
  document.removeEventListener('touchmove', moving)
  document.removeEventListener('mouseup', moveEnd)
  document.removeEventListener('touchend', moveEnd)
})
</script>

<template>
  <div class="puzzle-container" :class="status">
    <div class="puzzle-header">
      <span class="puzzle-header-left">拖动下方滑块完成拼图</span>
      <div>
        <span class="re-btn iconfont icon-shuaxin2" @click="refreshImg" />
        <span class="close-btn iconfont icon-close2" @click="closeVerificationBox" />
      </div>
    </div>

    <div class="puzzle-content">
      <div class="puzzle-image">
        <img id="scream" ref="scream" :src="imgRandom">
        <canvas id="puzzle-box" ref="puzzleBox" />
      </div>
      <div class="puzzle-lost-box" :style="`left:${left_Num}px;`">
        <canvas id="puzzle-lost" ref="puzzleShow" />
      </div>
      <p class="ver-tips" :class="{ 'slider-tips': displayTips, 'success': verification }">
        <span class="iconfont" :class="verification ? 'icon-success' : 'icon-close'" />
        <span>{{ verification ? '验证通过' : '验证失败，请移动到正确位置！' }}</span>
      </p>
    </div>

    <div class="slider-container">
      <div class="slider-bar" />
      <div ref="sliderBtn" class="slider-btn" @mousedown="startMove" @touchstart="startMove">
        <span />
        <span />
        <span />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.puzzle-container {
  display: inline-block;
  padding: 15px 15px 28px;
  background: var(--color-bg-primary);
  border-radius: 12px;
  position: fixed;
  top: calc(50% - 105px);
  left: 50%;
  box-shadow: 0 0 10px #dbdbdb;
  margin: 0 0 0 -145px;
  z-index: 99999;
  opacity: 0;
  visibility: hidden;
  transition: none;

  &.show {
    animation: fadeInTop 0.6s both;
  }

  &.exit {
    animation: fadeInDown 0.6s both;
  }

  .puzzle-header {
    display: flex;
    justify-content: space-between;
    margin: 0 0 10px;

    .puzzle-header-left {
      color: #333;
    }

    .re-btn,
    .close-btn {
      font-size: 16px;
      cursor: pointer;
      color: var(--color-text-4);
    }

    .re-btn:hover {
      color: #67c23a;
    }

    .close-btn:hover {
      color: #f56c6c;
    }

    .close-btn {
      margin-left: 5px;
    }
  }

  .puzzle-content {
    position: relative;
    overflow: hidden;
    width: 260px;

    .puzzle-image {
      position: relative;
      width: 260px;
      height: 160px;

      img {
        width: 260px;
        height: 160px;
      }
    }

    .puzzle-lost-box {
      width: 260px;
      height: 160px;
    }

    .ver-tips {
      position: absolute;
      left: 0;
      bottom: -28px;
      background: rgba(255, 255, 255, 0.9);
      height: 28px;
      line-height: 30px;
      font-size: 12px;
      width: 100%;
      margin: 0;
      text-align: left;
      padding: 0 8px;
      transition: all 0.4s;

      span {
        transition: all .4s;
        color: red;
        font-size: 13px;
        transition: none;
      }

      &.success span {
        color: #0081ff;
      }

      &.slider-tips {
        bottom: 0;
      }
    }
  }

  .slider-container {
    position: relative;
    margin: 10px auto 0;
    min-height: 15px;
    transition: none;
    width: 260px;

    .slider-btn {
      position: absolute;
      width: 46px;
      height: 26px;
      left: 0;
      top: 0;
      z-index: 12;
      cursor: pointer;
      background-position: 0 -84px;
      transition: inherit;
      background: #0084ff;
      border-radius: 36px;
      box-shadow: 0 0px 2px #0081ff;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;

      span {
        width: 2px;
        height: 12px;
        background: var(--color-bg-primary);
        display: inline-block;
        margin: 2.5px;
      }
    }

    .slider-bar {
      height: 10px;
      border: 1px solid #e9e9e9;
      border-radius: 5px;
      background: #efefef;
      box-shadow: 0 1px 1px #f8fcff inset;
      position: absolute;
      width: 100%;
      top: 7px;
    }
  }
}

@keyframes fadeInTop {
  from {
    opacity: 0;
    visibility: hidden;
    transform: translate(0, 80px);
  }

  to {
    opacity: 1;
    visibility: visible;
    transform: translate(0, 0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 1;
    visibility: visible;
    transform: translate(0, 0);
  }

  to {
    opacity: 0;
    visibility: hidden;
    transform: translate(0, -80px);
  }
}

#puzzle-box {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 22;
}

#puzzle-shadow {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 22;
}

#puzzle-lost {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 33;
}

.puzzle-lost-box {
  position: absolute;
  width: 260px;
  height: 116px;
  left: 0;
  top: 0;
  z-index: 111;
  transition: none;
}

@media screen and (max-width: 600px) {
  .puzzle-container {
    margin-top: 0;
  }
}
</style>
