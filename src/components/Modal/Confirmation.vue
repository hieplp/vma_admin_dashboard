<template>
  <div class="ui basic cus-modal justify-content-center">
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
  methods: {},
};
</script>

<style>
@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";

.cus-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(92, 90, 87, 0.637);
  z-index: 10000;
  width: 100%;
  height: 100%;
  padding-top: 12%;
  color: white;
}
.cus-modal .header {
  color: white;
  font-size: 35px !important;
}
</style>
