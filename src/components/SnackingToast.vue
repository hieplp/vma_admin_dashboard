<template>
  <transition name="slide-fade">
    <!-- The actual snackbar -->
    <div id="snackbar" v-if="isVisible">
      <div class="row mt-2">
        <div class="col-2 ml-1">
          <div class="preview-thumbnail">
            <div class="preview-icon bg-info">
              <i class="mdi mdi-bell-outline"></i>
            </div>
          </div>
        </div>
        <div class="col-9 ml-2">
          <div
            class="preview-item-content d-flex align-items-start flex-column justify-content-center div-inline"
          >
            <h6 class="preview-subject font-weight-normal mb-1">
              {{ notification.title }}
            </h6>
            <p class="text-gray ellipsis mb-0">
              {{ notification.body }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      isVisible: false,
      notification: {},
    };
  },
  methods: {
    setVisible(notification) {
      this.notification = notification;
      this.isVisible = true;
      let seft = this;
      setTimeout(function() {
        seft.isVisible = false;
      }, 3000);
    },
  },
};
</script>

<style scoped>
.row {
}
.card.card-img-holder.text-white:hover {
  cursor: pointer;
}
.preview-icon {
  width: 40px;
  height: 40px;
  padding: 6px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-size: 23px;
}
.preview-thumbnail {
  position: relative;
  width: 50px;
  height: 50px;
}
.div-inline {
  display: inline-block;
}
/* The snackbar - position it at the bottom and in the middle of the screen */
#snackbar {
  visibility: visible;
  min-width: 250px; /* Set a default minimum width */
  margin-left: -125px; /* Divide value of min-width by 2 */
  background-color: white;
  color: rgb(0, 0, 0); /* White text color */
  text-align: center; /* Centered text */
  border-radius: 2px; /* Rounded borders */
  padding: 10px; /* Padding */
  padding-left: 5px;
  position: fixed; /* Sit on top of the screen */
  z-index: 1; /* Add a z-index if needed */
  right: 2%; /* Center the snackbar */
  top: 10%;
  /* bottom: 30px; 30px from the bottom */
  -webkit-box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.86);
  box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.86);
  border-radius: 2%;
}

/* Show the snackbar when clicking on a button (class added with JavaScript) */
#snackbar.show {
  visibility: visible; /* Show the snackbar */
  /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
  However, delay the fade out process for 2.5 seconds */
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

/* Animations to fade the snackbar in and out */
@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}
</style>
