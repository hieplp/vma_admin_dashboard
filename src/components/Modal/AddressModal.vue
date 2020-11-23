<template>
  <div class="con-modal px-1">
    <Address
      class="mt-1"
      :propAddress="address"
      title="LOCATION"
      ref="location"
    />
    <div class="row justify-content-center btn-group">
      <div class="col-lg-6 ml-lg-5">
        <button
          class="btn btn-gradient-danger btn-fw"
          type="button"
          @click="cancelFunction()"
        >
          Cancel
        </button>
        <button
          class="btn btn-gradient-info btn-fw ml-2"
          type="button"
          v-on:click="doneFunction()"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../../assets/js/input.js";
import Address from "../Address";
export default {
  props: {
    cancelFunction: Function,
    doneFunction: Function,
    address: String,
  },
  components: {
    Address,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    // Get data
    getData() {
      return this.$refs.location.getAdress();
    },
    isNumber(evt) {
      isNumber(evt);
    },
  },
};
</script>

<style scoped>
.con-modal {
  position: fixed;
  padding-top: 0% !important;
  padding-left: 1%;
  padding-right: 1%;
  border-radius: 1%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 255, 255);
  z-index: 50;
  width: 50%;
  max-height: 45% !important;
  padding-top: 12%;
  box-shadow: 2px 2px 15px 7px rgba(0, 0, 0, 0.34);
  color: black;
}
.con-modal .header {
  color: white;
  font-size: 35px !important;
}
.table {
  overflow: hidden !important;
  border-bottom: 1px solid rgb(206, 194, 194);
}
table.tableBodyScroll tbody {
  display: block;
  max-height: 320px;
  height: 120px;
  overflow-y: scroll;
}

table.tableBodyScroll thead,
table.tableBodyScroll tbody tr {
  display: table;
  width: 98%;
  table-layout: fixed;
}
.btn-group {
  position: absolute;
  bottom: 2%;
  width: 100%;
}

@import "../../assets/vendors/Semantic-UI-CSS-master/semantic.min.css";
</style>
