<template>
  <div v-show="isLockScreen" class="lock-screen-wrap">
    <div class="layout-lock-screen-mask"></div>
    <div :class="['layout-lock-screen-img', { 'layout-lock-screen-filter': isShowLoockLogin }]"></div>
    <div class="layout-lock-screen">
      <div
        ref="layoutLockScreenDateRef"
        class="layout-lock-screen-date"
        @mousedown="onDown"
        @mousemove="onMove"
        @mouseup="onEnd"
        @touchstart.stop="onDown"
        @touchmove.stop="onMove"
        @touchend.stop="onEnd"
      >
        <div class="layout-lock-screen-date-box">
          <div class="layout-lock-screen-date-box-time">
            {{ time.hm }}<span class="layout-lock-screen-date-box-minutes">{{ time.s }}</span>
          </div>
          <div class="layout-lock-screen-date-box-info">{{ time.mdq }}</div>
        </div>
        <div class="layout-lock-screen-date-top">
          <i class="el-icon-top"></i>
          <div class="layout-lock-screen-date-top-text">上滑解锁</div>
        </div>
      </div>
      <transition name="el-zoom-in-center">
        <div v-show="isShowLoockLogin" class="layout-lock-screen-login">
          <div class="layout-lock-screen-login-box">
            <div class="layout-lock-screen-login-box-img">
              <img
                src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1813762643,1914315241&fm=26&gp=0.jpg"
              />
            </div>
            <div class="layout-lock-screen-login-box-name">Administrator</div>
            <div class="layout-lock-screen-login-box-value">
              <el-input
                ref="layoutLockScreenInputRef"
                v-model="lockScreenPassword"
                placeholder="请输入密码"
                @keyup.enter.stop="onLockScreenSubmit"
              >
                <template #append>
                  <el-button icon="el-icon-right" @click="onLockScreenSubmit"></el-button>
                </template>
              </el-input>
            </div>
          </div>
          <div class="layout-lock-screen-login-icon">
            <i class="el-icon-microphone"></i>
            <i class="el-icon-alarm-clock"></i>
            <i class="el-icon-switch-button"></i>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { nextTick, onMounted, reactive, toRefs, ref, defineComponent, onUnmounted } from 'vue';
import { formatDate } from '@/utils/formatTime';
export default defineComponent({
  name: 'LayoutLockScreen',
  props: {
    isLockScreen: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['changeIsLockScreen'],
  setup(props, { emit }) {
    const layoutLockScreenDateRef = ref();
    const layoutLockScreenInputRef = ref();
    const state: any = reactive({
      transparency: 1,
      downClientY: 0,
      moveDifference: 0,
      isShowLoockLogin: false,
      isFlags: false,
      querySelectorEl: '',
      time: {
        hm: '',
        s: '',
        mdq: '',
      },
      setIntervalTime: 0,
      lockScreenPassword: '',
    });
    // 鼠标按下
    const onDown = (down: any) => {
      state.isFlags = true;
      state.downClientY = down.touches ? down.touches[0].clientY : down.clientY;
    };
    // 鼠标移动
    const onMove = (move: any) => {
      if (state.isFlags) {
        const el = state.querySelectorEl;
        const opacitys = (state.transparency -= 1 / 200);
        if (move.touches) {
          state.moveDifference = move.touches[0].clientY - state.downClientY;
        } else {
          state.moveDifference = move.clientY - state.downClientY;
        }
        if (state.moveDifference >= 0) return false;
        el.setAttribute('style', `top:${state.moveDifference}px;cursor:pointer;opacity:${opacitys};`);
        if (state.moveDifference < -400) {
          el.setAttribute('style', `top:${-el.clientHeight}px;cursor:pointer;transition:all 0.3s ease;`);
          state.moveDifference = -el.clientHeight;
          setTimeout(() => {
            el && el.parentNode?.removeChild(el);
          }, 300);
        }
        if (state.moveDifference === -el.clientHeight) {
          state.isShowLoockLogin = true;
          layoutLockScreenInputRef.value.focus();
        }
      }
    };
    // 鼠标松开
    const onEnd = () => {
      state.isFlags = false;
      state.transparency = 1;
      if (state.moveDifference >= -400) {
        state.querySelectorEl.setAttribute('style', `top:0px;opacity:1;transition:all 0.3s ease;`);
      }
    };
    // 获取要拖拽的初始元素
    const initGetElement = () => {
      nextTick(() => {
        state.querySelectorEl = layoutLockScreenDateRef.value;
      });
    };
    // 时间初始化
    const initTime = () => {
      const date = new Date();
      state.time.hm = formatDate(date, 'HH:MM');
      state.time.s = formatDate(date, 'ss');
      state.time.mdq = `${formatDate(date, 'MM月DD日')}`;
    };
    // 时间初始化定时器
    const initSetTime = () => {
      initTime();
      state.setIntervalTime = window.setInterval(() => {
        initTime();
      }, 1000);
    };
    // 密码输入点击事件
    const onLockScreenSubmit = () => {
      emit('changeIsLockScreen', false);
    };
    // 页面加载时
    onMounted(() => {
      initGetElement();
      initSetTime();
    });
    onUnmounted(() => {
      window.clearInterval(state.setIntervalTime);
    });
    return {
      layoutLockScreenInputRef,
      layoutLockScreenDateRef,
      onDown,
      onMove,
      onEnd,
      onLockScreenSubmit,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss" src="./index.scss" />
