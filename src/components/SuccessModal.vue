<template>
  <div class="ui basic cus-modal justify-content-center" v-if="isModalVisible">
    <div class="ui icon header col-12">
      <i class="icon mb-3" v-bind:class="{ icon }"></i>
      {{ titleMsg }}
    </div>
    <div class="content col-12 row justify-content-center">
      <h4>
        {{ subTitleMsg }}
      </h4>
    </div>
    <div class="actions row justify-content-center mt-5">
      <router-link to="/drivers" class="ui blue primary button">
        <i class="checkmark icon"></i>
        Continue
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isModalVisible: Boolean,
    titleMsg: String,
    subTitleMsg: String,
    icon: String,
  },
};
</script>

<style></style>
