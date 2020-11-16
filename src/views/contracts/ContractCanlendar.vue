<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <div class="page-header">
      <h3 class="page-title">
        <router-link to="/contracts" class="nav-link">Contracts</router-link>
      </h3>
      <div class="dropdown">
        <router-link
          to="/create-contract"
          class="btn btn-gradient-info btn-icon-text mr-2"
          type="button"
        >
          <!-- <i class="mdi mdi-account-plus btn-icon-prepend"></i> -->
          Create
        </router-link>
        <button
          class="btn btn-gradient-info dropdown-toggle"
          type="button"
          v-on:click="clickToViewFilter()"
        >
          Filter
        </button>
      </div>
    </div>
    <div class="col-lg-12 grid-margin stretch-card calendar">
      <div class="card">
        <div class="card-body">
          <FullCalendar :options="calendarOptions" ref="fullCalendar" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import moment from "moment";
import { isNumber } from "../../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
const ContractRepository = RepositoryFactory.get("contracts");
// const UserStatusRepository = RepositoryFactory.get("userStatus");

export default {
  name: "Contracts",
  props: {},
  components: {
    Loading,
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        events: [],
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
      },

      //
      fromDate: "",
      toDate: "",

      viewType: "dayGridMonth",

      isDeleteConVisible: false,
      isLoading: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteUserID: "",
      contracts: [],
    };
  },
  async mounted() {
    // this.isLoading = true;
    this.initDataForCanlendar();
    // this.isLoading = false;
    let seft = this;
    // Handle next button
    document
      .querySelector(".fc-next-button")
      .addEventListener("click", function() {
        seft.handleNextBtn();
      });
    // Handle prev button
    document
      .querySelector(".fc-prev-button")
      .addEventListener("click", function() {
        seft.handlePrevBtn();
      });
    // Handle dayGridMonth button
    document
      .querySelector(".fc-dayGridMonth-button")
      .addEventListener("click", function() {
        seft.viewType = "dayGridMonth";
      });
    // Handle timeGridWeek button
    document
      .querySelector(".fc-timeGridWeek-button")
      .addEventListener("click", function() {
        seft.viewType = "timeGridWeek";
      });
    // Handle timeGridDay button
    document
      .querySelector(".fc-timeGridDay-button")
      .addEventListener("click", function() {
        seft.viewType = "timeGridDay";
      });
  },
  methods: {
    // Map actions
    ...mapActions("Contract", ["_getContractsByDate"]),
    // Init contracts by date
    async initContractsByDate() {
      await this._getContractsByDate({
        departureTimeFrom: this.fromDate,
        departureTimeTo: this.toDate,
      }).then((res) => {
        this.contracts = res;
      });
    },
    // Handle next btn
    handleNextBtn() {
      let calendarApi = this.$refs.fullCalendar.getApi();
      let date = calendarApi.getDate();
      this.fromDate = moment(date).format("YYYY-MM-DD HH:mm:ss");

      switch (this.viewType) {
        case "dayGridMonth":
          this.toDate = moment(this.fromDate, "YYYY-MM-DD HH:mm:ss")
            .add(1, "months") // To date = from date + 1 month
            .format("YYYY-MM-DD HH:mm:ss");
          break;
        case "timeGridWeek":
          this.toDate = moment(this.fromDate, "YYYY-MM-DD HH:mm:ss")
            .add(7, "days") // To date = from date + 7 days
            .format("YYYY-MM-DD HH:mm:ss");
          break;
        case "timeGridDay":
          this.toDate = moment(this.fromDate, "YYYY-MM-DD HH:mm:ss")
            .add(1, "days") // To date = from date + 1 day
            .format("YYYY-MM-DD HH:mm:ss");
          break;
      }
      this.initDataForCanlendar();
      // calendarApi.next();
    },
    handlePrevBtn() {
      let calendarApi = this.$refs.fullCalendar.getApi();
      let date = calendarApi.getDate();
      this.fromDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
      switch (this.viewType) {
        case "dayGridMonth":
          this.toDate = moment(this.fromDate, "YYYY-MM-DD HH:mm:ss")
            .subtract(1, "months") // To date = from date - 1 month
            .format("YYYY-MM-DD HH:mm:ss");
          break;
        case "timeGridWeek":
          this.toDate = moment(this.fromDate, "YYYY-MM-DD HH:mm:ss")
            .subtract(7, "days") // To date = from date - 7 days
            .format("YYYY-MM-DD HH:mm:ss");
          break;
        case "timeGridDay":
          this.toDate = moment(this.fromDate, "YYYY-MM-DD HH:mm:ss")
            .subtract(1, "days") // To date = from date - 1 day
            .format("YYYY-MM-DD HH:mm:ss");
          break;
      }
      this.initDataForCanlendar();
    },
    // Full calendar
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends; // update a property
      console.log(this.calendarOptions.weekends);
    },

    // Init data for calendar
    async initDataForCanlendar() {
      this.isLoading = true;
      let calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.getEvents().forEach((event) => {
        event.remove();
      });
      await this.initContractsByDate();
      // this.calendarOptions.events = [];
      this.contracts.forEach((contract) => {
        calendarApi.addEvent({
          id: contract.contractId,
          title: contract.contractId,
          start: contract.departureTime,
          end: contract.destinationTime,
        });
      });
      this.isLoading = false;
    },

    handleEventClick(clickInfo) {
      this.$router.push({
        name: "ContractDetail",
        params: { contractId: clickInfo.event.id },
      });
    },
    handleEvents(events) {
      this.currentEvents = events;
    },
    // Init
    async initContracts() {
      await ContractRepository.get().then((res) => {
        this.contracts = res;
      });
    },
    // Update vehicle detail
    updateContract(contractId) {
      this.$router.push({
        name: "UpdateContract",
        params: { contractId: contractId },
      });
    },
    isNumber(evt) {
      isNumber(evt);
    },
    // Set filter to visible
    clickToViewFilter() {
      if (this.isFilterVisible && !this.isTableVisible) {
        this.isFilterVisible = !this.isFilterVisible;
        setTimeout(() => {
          this.isTableVisible = !this.isTableVisible;
        }, 300);
      } else if (!this.isFilterVisible && this.isTableVisible) {
        this.isTableVisible = !this.isTableVisible;
        setTimeout(() => {
          this.isFilterVisible = !this.isFilterVisible;
        }, 300);
      }
    },
  },
};
</script>
<style>
.filter {
  max-height: 450px !important;
}
.label {
  font-size: 13px;
}
.form-control {
  font-size: 13px;
}
.btn-action .btn i {
  font-size: 20px;
}

.calendar {
  max-height: 700px;
}
.fc {
  height: 620px !important;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
