<template>
  <div>
    <Messenger></Messenger>
  </div>
</template>


<script>
import Axios from "axios";
import config from "@/config";
import io from "socket.io-client";
import Messenger from "@/views/Messenger.vue";

export default {
  components: {
    Messenger,
  },
  data() {
    return {
      username: "",
      socket: io("http://localhost:3000"),
      messages: [],
      users: []
    };
  },
  methods: {
    joinServer: function() {
      this.socket.on("loggedIn", data => {
        this.messages = data.messages;
        this.users = data.users;
        this.socket.emit("newuser", this.username);
      });
      this.listen();
    },
    listen: function() {
      this.socket.on("userOnline", user => {
        this.users.push(user);
      });
      this.socket.on("userLeft", user => {
        this.users.splice(this.users.indexOf(user), 1);
      });
      this.socket.on("msg", message => {
        this.messages.push(message);
      });
    },
    sendMessage: function(message) {
      this.socket.emit("msg", message);
    }
  },
  mounted() {
    // this.username = prompt("What is your username?", "Anonymous");
    if (!this.username) {
      this.username = "Anonymous";
    }
    this.joinServer();
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/variable.scss";

body {
  color: $body-color;
}
</style>
