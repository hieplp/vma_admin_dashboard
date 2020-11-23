<template>
  <!-- DEPARTURE LOCATION AND TIME -->
  <div class="row">
    <div class="col-lg-12 grid-margin stretch-card">
      <div class="card">
        <div class="card-body">
          <div class="ui form">
            <h4 class="ui dividing header">{{ this.title }}</h4>
            <div class="two fields">
              <!-- Adress -->
              <div class="field">
                <label>Address</label>
                <div class="ui corner labeled input">
                  <input
                    type="text"
                    maxlength="30"
                    placeholder="Address"
                    class="form-control"
                    v-model="address"
                  />
                  <div class="ui corner label">
                    <i class="asterisk icon"></i>
                  </div>
                </div>
                <div class="ui pointing red basic label" v-if="isAddressErr">
                  Address is required!
                </div>
              </div>
              <!-- Wards/Communes  -->
              <div class="field">
                <label>Wards/Communes</label>
                <div class="ui left corner labeled input">
                  <select
                    class="ui fluid dropdown cus-select"
                    v-model="selectedWard"
                    :disabled="this.wards.length === 0"
                  >
                    <option :value="{ name: '' }">
                      Wards/Communes
                    </option>
                    <option
                      v-for="ward in wards"
                      :key="ward.code"
                      :value="ward"
                      >{{ ward.name_with_type }}</option
                    >
                  </select>
                  <div class="ui left corner label">
                    <i class="asterisk icon"></i>
                  </div>
                </div>

                <div class="ui pointing red basic label" v-if="isWardErr">
                  Ward/Commune is required!
                </div>
              </div>
            </div>
            <div class="two fields">
              <!-- Districts -->
              <div class="field">
                <label>Districts</label>
                <div class="ui left corner labeled input">
                  <select
                    class="ui fluid dropdown cus-select"
                    @change="handleDropdownChange(2)"
                    v-model="selectedDistrict"
                    :disabled="this.districts.length === 0"
                  >
                    <option :value="{ name: '' }">
                      Districts
                    </option>
                    <option
                      v-for="district in districts"
                      :key="district.code"
                      :value="district"
                      >{{ district.name_with_type }}</option
                    >
                  </select>
                  <div class="ui left corner label">
                    <i class="asterisk icon"></i>
                  </div>
                </div>

                <div class="ui pointing red basic label" v-if="isDistrictErr">
                  District is required!
                </div>
              </div>
              <div class="field">
                <label>Cities/Provinces</label>
                <div class="ui left corner labeled input">
                  <select
                    class="ui dropdown cus-select"
                    @change="handleDropdownChange(1)"
                    v-model="selectedCity"
                  >
                    <option :value="{ name: '' }">
                      Cities/Provinces
                    </option>
                    <option
                      v-for="city in cities"
                      :key="city.code"
                      :value="city"
                    >
                      {{ city.name_with_type }}
                    </option>
                  </select>

                  <div class="ui left corner label">
                    <i class="asterisk icon"></i>
                  </div>
                </div>

                <div class="ui pointing red basic label" v-if="isCityErr">
                  City/Province is required!
                </div>
              </div>
              <div @click="getAdress()"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    visible: Boolean,
    propAddress: String,
  },
  data() {
    return {
      address: "",
      cities: [],
      selectedCity: {
        name: "",
      },
      districts: [],
      selectedDistrict: {
        name: "",
      },
      wards: [],
      selectedWard: {
        name: "",
      },
      // Address error
      isAddressErr: false,
      isWardErr: false,
      isDistrictErr: false,
      isCityErr: false,
    };
  },
  mounted() {
    this.cities = this.getJsonObjects("tinh_tp.json");
    if (this.propAddress) {
      this.initData();
    }
  },
  methods: {
    initData() {
      let addressArr = this.propAddress.split(", ");
      this.selectedCity = this.findItemFromJson(
        this.cities,
        addressArr[addressArr.length - 1],
        "name_with_type"
      );
      this.handleDropdownChange(1);

      this.selectedDistrict = this.findItemFromJson(
        this.districts,
        addressArr[addressArr.length - 2],
        "name_with_type"
      );

      this.handleDropdownChange(2);
      this.selectedWard = this.findItemFromJson(
        this.wards,
        addressArr[addressArr.length - 3],
        "name_with_type"
      );
      this.address = addressArr[0];
    },
    // Find address
    findItemFromJson(arr, findStr, typeName) {
      let keys = Object.keys(arr);
      for (let index = 0; index < keys.length; index++) {
        let item = arr[keys[index]];
        if (item[typeName] === findStr) {
          return item;
        }
      }
    },
    getJsonObjects(str) {
      return require("../assets/json/addresses/" + str);
    },
    // Handle address dropdown
    handleDropdownChange(name) {
      // If city is selected
      if (name === 1) {
        if (this.selectedCity.name !== "") {
          this.districts = this.getJsonObjects(
            "quan-huyen/" + this.selectedCity.code + ".json"
          );
        } else {
          this.districts = [];
        }
        this.selectedDistrict = { name: "" };
        this.selectedWard = { name: "" };
        this.wards = [];
        // If district is selected
      } else if (name === 2) {
        if (this.selectedDistrict.name !== "") {
          this.wards = this.getJsonObjects(
            "xa-phuong/" + this.selectedDistrict.code + ".json"
          );
        } else {
          this.selectedWard = { name: "" };
        }
      }
    },
    checkValid() {
      this.isAddressErr = this.address.length === 0;
      this.isWardErr = this.selectedWard.name.length === 0;
      this.isDistrictErr = this.selectedDistrict.name.length === 0;
      this.isCityErr = this.selectedCity.name.length === 0;
      return (
        this.isAddressErr ||
        this.isWardEr ||
        this.isDistrictErr ||
        this.isCityErr
      );
    },
    getAdress() {
      let isValid = this.checkValid();
      if (!isValid) {
        let address =
          this.address +
          ", " +
          this.selectedWard.name_with_type +
          ", " +
          this.selectedDistrict.name_with_type +
          ", " +
          this.selectedCity.name_with_type;
        return address;
      }
    },
  },
};
</script>

<style scoped>
.asterisk.icon {
  color: red;
}

.cus-select {
  padding-left: 26px !important;
}
.cus-disable {
  background-color: #858585 !important;
  color: white;
}
</style>
