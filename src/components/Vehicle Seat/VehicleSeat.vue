<template>
  <modal
    name="seatCreateModal"
    :width="'30%'"
    :height="'auto'"
    :adaptive="true"
  >
    <div class="card">
      <div class="card-body">
        <div class="ui form">
          <h4 class="ui dividing header">
            VEHICLE SEAT
          </h4>
          <!-- Group Name -->
          <div class="field">
            <label>Group Name <span class="require-field">*</span></label>
            <div class="ui corner labeled input">
              <input
                type="text"
                v-model="seat.seatsGroupName"
                placeholder="Enter group name"
              />
            </div>
            <div class="ui pointing red basic label" v-if="isSeatsGroupNameErr">
              Group Name is required!
            </div>
          </div>
          <!-- Seats -->
          <div class="field">
            <label>Seats <span class="require-field">*</span></label>
            <div class="ui corner labeled input">
              <input
                type="text"
                v-model="seat.seats"
                placeholder="Enter seats"
                @keypress="isNumber($event)"
              />
            </div>
            <div class="ui pointing red basic label" v-if="isSeatsErr">
              Seat is required!
            </div>
          </div>
          <!-- Price Per Distance -->
          <div class="field">
            <label>
              Price Per Distance <span class="require-field">*</span>
            </label>
            <div class="ui corner labeled input">
              <input
                type="text"
                v-model="seat.pricePerDistance"
                placeholder="Enter price per distance"
                @input="
                  () => {
                    this.seat.pricePerDistance = this.moneyFormat(
                      this.seat.pricePerDistance
                    );
                  }
                "
              />
              <div class="ui basic label">
                VND/km
              </div>
            </div>
            <div
              class="ui pointing red basic label"
              v-if="isPricePerDistanceErr"
            >
              Price Per Distance is required!
            </div>
          </div>
          <!-- Price Per Hour -->
          <div class="field">
            <label>
              Price Per Hour
              <span class="require-field">*</span>
            </label>

            <div class="ui corner labeled input">
              <input
                type="text"
                placeholder="Enter price per hour"
                v-model="seat.pricePerHour"
                @input="
                  () => {
                    this.seat.pricePerHour = this.moneyFormat(
                      this.seat.pricePerHour
                    );
                  }
                "
              />
              <div class="ui basic label">
                VND/1h
              </div>
            </div>
            <div class="ui pointing red basic label" v-if="isPricePerHourErr">
              Price Per Hour is required!
            </div>
          </div>
          <!-- Price Per Day -->
          <div class="field">
            <label>Price Per Day <span class="require-field">*</span></label>
            <div class="ui corner labeled input">
              <input
                type="text"
                placeholder="Enter price per day"
                v-model="seat.pricePerDay"
                @input="
                  () => {
                    this.seat.pricePerDay = this.moneyFormat(
                      this.seat.pricePerDay
                    );
                  }
                "
              />
              <div class="ui basic label">
                VND/1d
              </div>
            </div>
            <div class="ui pointing red basic label" v-if="isPricePerDayErr">
              Price Per Day is required!
            </div>
          </div>

          <!-- Button group -->
          <div class="row justify-content-center mt-4">
            <div class="col-10">
              <button
                class="btn btn-gradient-danger btn-fw"
                type="button"
                @click="closeModal()"
              >
                Cancel
              </button>
              <button
                class="btn btn-gradient-info btn-fw ml-2"
                type="button"
                @click="handleCreate()"
              >
                {{ this.isUpdate ? "Update" : "Create" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { isNumber } from "../../assets/js/input.js";
export default {
  props: {
    create: Function,
    update: Function,
  },
  data() {
    return {
      seat: {
        pricePerDay: "",
        pricePerDistance: "",
        pricePerHour: "",
        seats: "",
        seatsId: "",
        seatsGroupName: "",
      },
      // Error
      isPricePerDayErr: false,
      isSeatsGroupNameErr: false,
      isPricePerDistanceErr: false,
      isPricePerHourErr: false,
      isSeatsErr: false,
      isUpdate: false,
    };
  },
  mounted() {
    // this.$modal.show("example");
  },
  methods: {
    isNumber(evt) {
      isNumber(evt);
    },

    // clear all value
    clearAllValue() {
      this.seat = {
        pricePerDay: "",
        pricePerDistance: "",
        pricePerHour: "",
        seats: "",
        seatsId: "",
        seatsGroupName: "",
      };
    },

    // Valid param
    check() {
      this.isPricePerDayErr = this.seat.pricePerDay.length === 0;
      this.isSeatsGroupNameErr = this.seat.seatsGroupName.length === 0;
      this.isPricePerDistanceErr = this.seat.pricePerDistance.length === 0;
      this.isPricePerHourErr = this.seat.pricePerHour.length === 0;
      this.isSeatsErr = this.seat.seats.length === 0;
      return (
        this.isPricePerDayErr ||
        this.isSeatsGroupNameErr ||
        this.isPricePerDistanceErr ||
        this.isPricePerHourErr ||
        this.isSeatsErr
      );
    },
    // Close modal
    closeModal() {
      this.$modal.hide("seatCreateModal");
    },
    // Handle create function
    handleCreate() {
      let isValid = this.check();
      if (!isValid) {
        this.formatData();
        if (this.isUpdate) {
          this.update(this.seat);
        } else {
          this.create(this.seat);
        }
      }
    },
    // Get data
    formatData() {
      this.seat.pricePerDay = this.seat.pricePerDay.replace(/\D/g, "");
      this.seat.pricePerDistance = this.seat.pricePerDistance.replace(
        /\D/g,
        ""
      );
      this.seat.pricePerHour = this.seat.pricePerHour.replace(/\D/g, "");
    },
    // Init data
    initData() {
      this.seat.pricePerDay = this.moneyFormat(this.seat.pricePerDay);
      this.seat.pricePerDistance = this.moneyFormat(this.seat.pricePerDistance);
      this.seat.pricePerHour = this.moneyFormat(this.seat.pricePerHour);
    },
    // Money format
    moneyFormat(str) {
      return str
        .toString()
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
};
</script>

<style scoped>
.require-field {
  color: red;
}
</style>
