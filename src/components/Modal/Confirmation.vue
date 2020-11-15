<template>
  <div class="ui basic cus-modal justify-content-center" id="modal">
    <div class="ui icon header col-12">
      <i :class="'icon mb-3 ' + this.icon"></i>
      {{ this.title }}
    </div>
    <div class="content col-12 row justify-content-center">
      <h4>{{ this.subTitle }}</h4>
    </div>
    <div class="actions row justify-content-center mt-5">
      <button
        type="button"
        :class="'ui button ' + this.leftBtnColor"
        @click="handleLeftBtn()"
      >
        <i :class="'icon ' + this.leftBtnIcon"></i>
        {{ this.leftBtnTitle }}
      </button>
      <button
        type="button"
        :class="'ui button ' + this.rightBtnColor"
        @click="handleRightBtn()"
      >
        <i :class="'icon ' + this.rightBtnIcon"></i>
        {{ this.rightBtnTitle }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    subTitle: String,
    icon: String,
    // right button
    rightBtnTitle: String,
    rightBtnIcon: String,
    rightBtnColor: String,
    // left button
    leftBtnTitle: String,
    leftBtnIcon: String,
    leftBtnColor: String,
    // Function
    handleLeftBtn: Function,
    handleRightBtn: Function,
  },
};
</script>
