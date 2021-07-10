<template>
  <div class="friendItem">
    <div class="avatar"></div>
    <div class="filter-description">
      <h1>{{ name }}</h1>
    </div>
    <div class="communicate-box">
      <button class="button-transparent" @click="sendEmail(email)">
        <unicon style="cursor: pointer" name="at" fill="white"></unicon>
      </button>
      <button class="button-transparent" @click="sendText(number)">
        <unicon style="cursor: pointer" name="phone" fill="white"></unicon>
      </button>
      <button class="button-transparent" @click="chatWith(name)">
        <unicon style="cursor: pointer" name="chat" fill="white"></unicon>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Friend",
  props: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    number: {
      type: Number,
    },
  },
  setup() {
    const sendEmail = (email) => {
      console.log("send email to " + email);
    };
    const sendText = (number) => {
      console.log("send email to " + number);
    };
    const chatWith = (person) => {
      console.log("chat with " + person);
    };
    return {
      sendEmail,
      sendText,
      chatWith,
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