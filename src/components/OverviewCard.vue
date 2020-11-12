<template>
  <!-- Vehicle on route -->
  <div class="card card-img-holder text-white" :class="color">
    <div class="card-body">
      <img
        src="../assets/images/dashboard/circle.png"
        class="card-img-absolute"
        alt="circle-image"
      />
      <h4 class="font-weight-normal mb-3">
        {{ this.title }}
        <i class="mdi mdi-car-wash mdi-24px float-right"></i>
      </h4>
      <h1 class="mt-5 card-large-content">
        {{ this.count
        }}<span class="card-small-content">{{ this.countName }}</span>
      </h1>
      <!-- <h6 class="card-text">Increased by 60%</h6> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: String,
    title: String,
    count: Number,
    countName: String,
  },
};
</script>

<style></style>
