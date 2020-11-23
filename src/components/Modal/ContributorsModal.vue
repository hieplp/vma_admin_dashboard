<template>
  <div class="con-modal">
    <div class="ui form">
      <div class="three fields mt-4">
        <!--Contributor Name -->
        <div class="field">
          <label>Contributor Name</label>
          <div class="ui corner labeled input">
            <input
              v-model="searchContributorName"
              type="text"
              placeholder="Contributor Name"
              @blur="initContributorsList"
            />
          </div>
        </div>
        <!--Contributor Phone Number -->
        <div class="field">
          <label>Contributor Phone Number</label>
          <div class="ui corner labeled input">
            <input
              type="text"
              v-model="searchPhoneNumber"
              placeholder="Contributor Phone Number"
              @keypress="isNumber($event)"
              @blur="initContributorsList"
            />
          </div>
        </div>
        <!--Status -->
        <div class="field">
          <label>Status</label>
          <select
            class="ui fluid dropdown"
            name="status"
            v-model="searchStatusID"
            @change="initContributorsList"
          >
            <option value="" selected>NONE</option>
            <option
              v-for="status in this.statusList"
              :key="status"
              :value="status"
              >{{ status }}</option
            >
          </select>
        </div>
      </div>
    </div>

    <table class="table tableBodyScroll mt-1">
      <thead>
        <tr class="">
          <th style="width: 80px">NO.</th>
          <!-- <th>ID</th> -->
          <th>NAME</th>
          <th>PHONE NUMBER</th>
          <!-- <th>TOTAL VEHICLES</th> -->
          <th style="width: 80px">STATUS</th>
          <th class="text-center">ACTION</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(contributor, index) in this.contributorsList"
          :key="contributor.userId"
        >
          <!-- TODO: -->
          <template v-if="contributor.userStatus !== 'DISABLE'">
            <td style="width: 80px" class="text-secondary">
              {{ page * 15 + index + 1 }}
            </td>
            <!-- <td>{{ contributor.userId }}</td> -->
            <td>{{ contributor.fullName }}</td>
            <td>{{ contributor.phoneNumber }}</td>
            <!-- <td>
            <p v-if="contributor.totalVehicles">
              {{ contributor.totalVehicles }}
            </p>
            <p v-else>N/A</p>
          </td> -->
            <td style="width: 80px">
              <label
                class="badge"
                v-bind:class="{
                  'badge-info': contributor.userStatus === 'ACTIVE',
                  'badge-danger': contributor.userStatus === 'INACTIVE',
                }"
              >
                {{ contributor.userStatus }}
              </label>
            </td>
            <td class="row justify-content-center btn-action">
              <button
                class="btn btn-outline-info btn-rounded btn-icon mr-1"
                :class="
                  selectedContributor.userId !== contributor.userId
                    ? 'btn-outline-info'
                    : 'btn-gradient-info'
                "
                @click="select(contributor.userId, contributor.fullName)"
              >
                <i class="mdi mdi-account-check"></i>
              </button>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <div class="mt-4" v-if="this.totalContributors > 15">
      <paginate
        v-model="currentPage"
        :page-count="Math.floor(this.totalContributors / 15) + 1"
        :page-range="3"
        :margin-pages="1"
        :click-handler="clickCallback"
        :first-last-button="true"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
        :next-class="'page-item'"
        :prev-class="'page-item'"
        :active-class="'page-active'"
      >
      </paginate>
    </div>
    <div class="row justify-content-center btn-group">
      <div class="col-4">
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
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
const ContributorRepository = RepositoryFactory.get("contributors");
export default {
  props: {
    cancelFunction: Function,
    doneFunction: Function,
    userId: String,
  },
  data() {
    return {
      contributorsList: [],
      statusList: [],
      searchPhoneNumber: "",
      searchContributorID: "",
      searchContributorName: "",
      searchStatusID: "",
      searchTotalVehicles: ["", ""],
      totalContributors: 0,
      page: 0,
      currentPage: 1,
      selectedContributor: {
        userId: "",
      },
    };
  },
  mounted() {
    this.initContributorsList();
    this.initStatusList();
    this.selectedContributor.userId = this.userId;
  },
  methods: {
    // pagination handle
    async clickCallback(pageNum) {
      this.isLoading = true;
      this.currentPage = pageNum;
      this.page = pageNum - 1;
      this.contributorsList = await ContributorRepository.get(
        this.page,
        this.searchContributorName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchContributorID,
        this.searchTotalVehicles
      );
      this.isLoading = false;
    },
    async initContributorsList() {
      this.contributorsList = await ContributorRepository.get(
        this.page,
        this.searchContributorName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchContributorID,
        this.searchTotalVehicles
      );

      this.totalContributors = await ContributorRepository.getTotalContributor(
        this.searchContributorName,
        this.searchPhoneNumber,
        this.searchStatusID,
        this.searchContributorID,
        this.searchTotalVehicles
      );
    },
    // Init data for Contributor Status Dropdown
    async initStatusList() {
      this.statusList = require("../../assets/json/user/driverStatus.json");
      this.$delete(this.statusList, this.statusList.length - 1);
    },
    // Select contributor
    select(userId, fullName) {
      if (this.selectedContributor.userId === userId) {
        this.selectedContributor = {
          userId: "",
          fullName: "",
        };
      } else {
        this.selectedContributor = {
          userId: userId,
          fullName: fullName,
        };
      }
    },
    // Return select contributor
    getSelectedContributor() {
      return this.selectedContributor;
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
  z-index: 10000;
  width: 85%;
  height: 90%;
  max-height: 700px;
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
  max-height: 420px;
  height: 420px;
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
