<template>
  <div class="content-wrapper">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :loader="'dots'"
      :is-full-page="false"
      :color="'#2e5bff'"
    ></loading>

    <!-- Delete confimation -->
    <div
      class="ui basic cus-modal justify-content-center"
      v-if="isDeleteConVisible"
    >
      <div class="ui icon header col-12">
        <i class="user times icon mb-3"></i>
        Delete Confirmation
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>Do you want to delete contract with id {{ this.deleteUserID }}?</h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button
          type="button"
          class="ui blue primary button"
          @click="handleDialog('isDeleteConVisible', '')"
        >
          <i class="checkmark icon"></i>
          Cancel
        </button>
        <button type="button" class="ui red  button" @click="deleteContract()">
          <i class="trash alternate icon"></i>
          Delete
        </button>
      </div>
    </div>
    <!-- Error message -->
    <div class="ui basic cus-modal justify-content-center" v-if="isError">
      <div class="ui icon header col-12">
        <i class="frown outline icon mb-3"></i>
        Delete Contract Fail!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          {{ this.errMsg }}
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button @click="isError = !isError" class="ui blue primary button">
          <i class="checkmark icon"></i>
          Ok
        </button>
      </div>
    </div>

    <!-- Success message -->
    <div class="ui basic cus-modal justify-content-center" v-if="isSuccess">
      <div class="ui icon header col-12">
        <i class="check circle icon mb-3"></i>
        Delete successfully!
      </div>
      <div class="content col-12 row justify-content-center">
        <h4>
          Contract with id {{ this.deleteUserID }} is deleted successfully.
        </h4>
      </div>
      <div class="actions row justify-content-center mt-5">
        <button
          @click="
            () => {
              isSuccess = !isSuccess;
              this.searchContracts();
            }
          "
          class="ui blue primary button"
        >
          <i class="checkmark icon"></i>
          Ok
        </button>
      </div>
    </div>

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
    <div class="row">
      <!-- Contracts table -->
      <div
        class="grid-margin stretch-card"
        v-bind:class="{
          'col-lg-12': isTableVisible,
          'col-lg-9': !isTableVisible,
        }"
      >
        <div class="card" v-if="contracts.length > 0">
          <div class="card-body">
            <h4 class="card-title">Contract List</h4>
            <p class="card-description">{{ this.totalContracts }} total</p>
            <table class="table ">
              <thead>
                <tr class="">
                  <th>NO.</th>
                  <th>ID</th>
                  <!-- <th>DEPARTURE LOCATION</th>
                  <th>DEPARTURE TIME</th>
                  <th>DESTINATION LOCATION</th>
                  <th>DESTINATION TIME</th> -->
                  <th>DURATION FROM</th>
                  <th>DURATION TO</th>
                  <th>TOTAL PRICE</th>
                  <th>STATUS</th>
                  <th class="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(contract, index) in this.contracts"
                  :key="contract.contractId"
                >
                  <td class="text-secondary">{{ page * 15 + index + 1 }}</td>
                  <td>{{ contract.contractId }}</td>
                  <td>{{ contract.durationFrom }}</td>
                  <td>{{ contract.durationTo }}</td>
                  <td>{{ contract.totalPrice }}</td>
                  <!-- <td>{{ contract.departureLocation }}</td>
                  <td>{{ contract.departureTime }}</td>
                  <td>{{ contract.destinationLocation }}</td>
                  <td>{{ contract.destinationTime }}</td> -->
                  <td>
                    <label
                      class="badge"
                      v-bind:class="{
                        'badge-info': contract.contractStatus === 'FINISHED',
                        'badge-warning':
                          contract.contractStatus === 'NOT_STARTED',
                        'badge-danger':
                          contract.contractStatus === 'UNFINISHED',
                        'badge-dark': contract.contractStatus === 'CANCELLED',
                      }"
                      >{{ contract.contractStatus }}</label
                    >
                  </td>
                  <td class="row justify-content-center btn-action">
                    <button
                      class="btn btn-gradient-info btn-rounded btn-icon mr-1"
                      @click="viewContract(contract.contractId)"
                    >
                      <i class="mdi mdi-account-box-outline"></i>
                    </button>
                    <button
                      class="btn btn-gradient-warning btn-rounded btn-icon mr-1"
                      :disabled="contract.userStatusName === 'CANCELLED'"
                      @click="updateContract(contract.contractId)"
                    >
                      <i class="mdi mdi-grease-pencil"></i>
                    </button>
                    <button
                      class="btn btn-gradient-danger btn-rounded btn-icon mr-1"
                      :disabled="contract.userStatusName === 'CANCELLED'"
                      @click="
                        handleDialog('isDeleteConVisible', contract.userId)
                      "
                    >
                      <i class="mdi mdi-delete-forever"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="this.totalContracts > 15">
            <paginate
              v-model="currentPage"
              :page-count="Math.floor(this.totalContracts / 15) + 1"
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
        </div>
        <!-- Empty list -->
        <div class="card empty-list" v-else-if="!isLoading">
          <i class="mdi mdi-account-off"></i>
          <h1>NOTHING</h1>
          <h3>Your list is empty.</h3>
        </div>
      </div>

      <!-- Filter -->
      <transition name="slide-fade">
        <div class="col-3 card filter" v-if="isFilterVisible">
          <div class="form-group">
            <h4 class="card-title mt-4">Filter</h4>
            <div class="col-sm-12">
              <!-- Search Contract ID -->
              <label>Contract ID</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Contract ID"
                v-model="searchContractID"
                @keypress="isNumber($event)"
                maxlength="12"
              />
            </div>
            <div class="col-12 mt-3">
              <label>Contract Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchContractName"
                placeholder="Contract name"
              />
            </div>
            <!-- Phone number dropdown-->
            <div class="col-12 mt-3">
              <label>Phone Number</label>
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Phone Number"
                v-model="searchPhoneNumber"
                @keypress="isNumber($event)"
                maxlength="10"
              />
            </div>
            <!-- Contract status dropdown -->
            <div class="col-12 mt-3">
              <label>Status</label>
              <select
                class="form-control form-control-sm"
                name="status"
                v-model="searchStatusID"
              >
                <option
                  v-for="status in this.statusList"
                  :key="status.userStatusId"
                  :value="status.userStatusId"
                  >{{ status.userStatusName }}</option
                >
              </select>
            </div>

            <br />
            <div class="col-12 mt-3">
              <button
                class="btn btn-outline-info w-100"
                type="button"
                v-on:click="searchContracts()"
              >
                Filter
              </button>
            </div>
            <div class="col-12 mt-2">
              <button
                class="btn btn-outline-danger w-100"
                type="button"
                v-on:click="clearSearchValue()"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../../assets/js/input.js";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";

const ContractRepository = RepositoryFactory.get("contracts");
// const UserStatusRepository = RepositoryFactory.get("userStatus");

export default {
  name: "Contracts",
  props: {},
  components: {
    Loading,
  },
  data() {
    return {
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
    this.isLoading = true;
    // await this.initStatusList();
    await this.initContracts();
    this.isLoading = false;
  },
  methods: {
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
    // view vehicle detail
    viewContract(contractId) {
      this.$router.push({
        name: "ContractDetail",
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
<!-- Add "scoped" attribute to limit CSS to this component only -->
