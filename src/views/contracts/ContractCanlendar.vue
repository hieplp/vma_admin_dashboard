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
        initialEvents: { title: "event 1", date: "2020-11-11" }, // alternatively, use the `events` setting to fetch from a feed
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

      isFilterVisible: false,
      isTableVisible: true,
      statusList: [],
      searchPhoneNumber: "",
      searchContractID: "",
      searchContractName: "",
      searchStatusID: "",
      isLoading: false,
      totalContracts: 0,
      page: 0,
      currentPage: 1,
      isDeleteConVisible: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      deleteUserID: "",
      contracts: [],
    };
  },
  async mounted() {
    // this.isLoading = true;
    await this.initContracts();
    this.initDataForCanlendar();
    // this.isLoading = false;
  },
  methods: {
    // Full calendar
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends; // update a property
    },

    // Init data for calendar
    initDataForCanlendar() {
      let calendarApi = this.$refs.fullCalendar.getApi();
      this.contracts.forEach((contract) => {
        calendarApi.addEvent({
          id: contract.contractId,
          title: contract.contractId,
          start: contract.departureTime,
          end: contract.destinationTime,
        });
      });
    },
    handleDateSelect(selectInfo) {
      console.log("handleDateSelect -> selectInfo", selectInfo);
      // let title = prompt("Please enter a new title for your event");
      // let calendarApi = selectInfo.view.calendar;
      // calendarApi.unselect(); // clear date selection
      // if (title) {
      //   calendarApi.addEvent({
      //     id: "2",
      //     title,
      //     start: selectInfo.startStr,
      //     end: selectInfo.endStr,
      //     allDay: selectInfo.allDay,
      //   });
      // }
      // console.log(this.calendarApi.get.events);
    },
    handleEventClick(clickInfo) {
      this.$router.push({
        name: "ContractDetail",
        params: { contractId: clickInfo.event.id },
      });
      // let calendarApi = this.$refs.fullCalendar.getApi();
      // console.log(calendarApi.getEventById("2"));
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
