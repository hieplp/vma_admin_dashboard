<template>
  <div class="card">
    <div class="card-body">
      <div class="ui form">
        <h4 class="ui dividing header">
          {{ this.title.replaceAll("_", " ") }}
        </h4>
        <div class="field justify-content-center">
          <label class="mb-4">Images</label>
          <div class="row">
            <div
              class="col-3 preview-img mb-3"
              v-for="(img, index) in document.imageLinks"
              :key="img.imageLink"
            >
              <img
                :src="img.imageLink"
                class="ui large image"
                @click="openGallery(index)"
              />
            </div>
          </div>
        </div>
        <div class="two fields">
          <div class="field">
            <label>ID</label>
            <div class="ui corner labeled input">
              <input
                v-model="document.vehicleDocumentId"
                type="text"
                readonly
              />
            </div>
          </div>
          <div class="field">
            <label>Register Location</label>
            <div class="ui corner labeled input">
              <input
                type="text"
                v-model="document.registeredLocation"
                class="form-control"
                readonly
              />
            </div>
          </div>
        </div>
        <div class="two fields">
          <!-- <div class="field" v-if="document.otherInformation">
            <label>{{
              document.userDocumentType === "DRIVING_LICENSE"
                ? "Class"
                : "Other Information"
            }}</label>
            <div class="ui corner labeled input">
              <input
                type="text"
                v-model="document.otherInformation"
                class="form-control"
                readonly
              />
            </div>
          </div> -->
          <div class="field">
            <label>Register Date</label>
            <div class="ui corner labeled input">
              <input
                type="text"
                v-model="document.registeredDate"
                class="form-control"
                readonly
              />
            </div>
          </div>
          <div class="field">
            <label>Expiry Date</label>
            <div class="ui corner labeled input">
              <input
                type="text"
                v-model="document.expiryDate"
                class="form-control"
                readonly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { title: String, document: Object },
  data() {
    return {};
  },
  methods: {
    openGallery(index) {
      let media = [];
      let imageLinks = this.document.imageLinks;
      imageLinks.forEach((img) => {
        let temp = {
          thumb: img.imageLink,
          src: img.imageLink,
        };
        media.push(temp);
      });
      this.$parent.openGallery(media, index);
      // await this.$parent.$refs.lightbox.showImage(index);
    },
  },
};
</script>

<style>
.ui.large.image:hover {
  cursor: pointer;
}
</style>
