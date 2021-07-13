<template>
  <div class="friends">
    <Dialog
      header="Header"
      v-model:visible="displayModal"
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <p class="p-m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          @click="closeModal"
          class="p-button-text"
        />
        <Button label="Yes" icon="pi pi-check" @click="closeModal" autofocus />
      </template>
    </Dialog>
    <Button
      label="No"
      icon="pi pi-times"
      @click="openModal"
      class="p-button-text"
    />
    <Friend name="Sophek" :number="4179898029" email="sophek@gmail.com" />
    <Friend name="Sophek" :number="4179898029" email="sophek@gmail.com" />
  </div>
</template>
<script>
import { ref } from "vue";
import Dialog from "primevue/dialog/sfc";
import Button from "primevue/button/sfc";
import Friend from "./Friend.vue";
export default {
  name: "Friends",
  components: {
    Friend,
    Dialog,
    Button,
  },
  props: {
    data: {
      type: Array,
    },
  },
  setup() {
    const displayModal = ref(false);
    const sendEmail = (email) => {
      console.log("send email to " + email);
    };
    const sendText = (number) => {
      console.log("send email to " + number);
    };
    const chatWith = (person) => {
      console.log("chat with " + person);
    };
    const openModal = () => {
      displayModal.value = !displayModal.value;
    };
    return {
      sendEmail,
      sendText,
      chatWith,
      displayModal,
      openModal,
    };
  },
};
</script>
<style scoped>
.avatar {
  height: 32px;
  width: 32px;
  background-color: red;
  border-radius: 32px;
  position: relative;
  left: 5px;
  top: 0px;
  background-size: cover;
  background-image: url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=420&q=60);
}

.button-transparent {
    background-color: transparent;
    border:none;
}

.communicate-box {
  display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
    border-radius: 17px;
    width: 100px;
    height: 100px;
    align-content: center;
    position: relative;
    left: 140px;
    top: -70px;
}

.filter-description {
  position: relative;
  left: 50px;
  top: -40px;
  text-align: left;
  width: 120px;
}

.filter-description h1 {
  font-size: 16px;
  font-weight: 600;
}

.filter-description h3 {
  font-size: 12px;
  font-weight: 600;
  color: #B7B5B5;
  white-space: pre-wrap;
}

.friendItem {
  width: 250px;
  height: 100px;
  padding: 10px;
  background: rgba( 74, 144, 226, 0.25 );
box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
backdrop-filter: blur( 4px );
-webkit-backdrop-filter: blur( 4px );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );
margin:10px;
}

.type-indicator {
  background: rgba(255, 0, 0, 0.58);
  border-radius: 4.5px;
  width: 6px;
  height: 40px;
  position: absolute;
  left: 5px;
  top: 90px;
}
</style>