<template>
  <div class="ui basic cus-modal justify-content-center">
    <div class="ui icon header col-12">
      <i class="icon mb-3" :class="icon"></i>
      {{ this.title }}
    </div>
    <div class="content col-12 row justify-content-center">
      <h4>
        {{ this.subTitle }}
      </h4>
    </div>
    <div class="actions row justify-content-center mt-5">
      <button @click="proFunc" class="ui blue primary button">
        <i class="checkmark icon"></i>
        Ok
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    subTitle: String,
    proFunc: Function,
    icon: String,
  },
};
</script>

<style></style>
