<template>
  <div>
    <div class="content-main">
      <MessageList></MessageList>
      <MessageInput v-if="activeRoom"></MessageInput>
    </div>
    <div class="right-sidebar">
      <vs-dropdown>
        <GetRoom v-if="activeRoom" :room="activeRoom"></GetRoom>
        <vs-dropdown-menu>
          <vs-dropdown-item divider v-for="user in usersInRoom" :key="user.id">
            <GetUser :user="user"></GetUser>
          </vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown>
      <UserList></UserList>
    </div>
  </div>
</template>

<script>
import MessageList from "@/components/messages/MessageList.vue";
import MessageInput from "@/components/messages/MessageInput.vue";
import GetRoom from "@/components/rooms/GetRoom.vue";
import UserList from "@/components/users/UserList.vue";
import GetUser from "@/components/users/GetUser.vue";
import Error from "@/components/error/Error.vue";
import { mapActions, mapGetters } from "vuex";

import axios from "axios";
import config from "@/config";

export default {
  components: {
    MessageList,
    MessageInput,
    UserList,
    GetRoom,
    GetUser,
    Error
  },
  data() {
    return {
      usersInRoom: [],
      startNewConversation: false,
      conversationName: "",
      conversationPassword: "",
      activeRoomTitle: "",
      toUser: "",
      //   activeRoom: "",
      writeNewMessage: false,
      errors: [],
      room: null,
    };
  },
  mounted() {
    this.fetchRoomData();
  },
  computed: {
    activeRoom: {
      get: function() {
        // this.room = null;
        // debugger;
        axios
          .get(`${config.apiUrl}/api/room/${this.$route.params.id}`)
          .then(res => {
            this.room = res.data;
          })
          .catch(err => {
            console.log(err);
          });
        return this.room;
      },
      set: function(newRoom) {
        this.room = newRoom;
      }
    }
  },
  watch: {
    '$route' (to, from) {
      axios
          .get(`${config.apiUrl}/api${(to.path)}`)
          .then(res => {
            this.room = res.data;
            debugger
          })
          .catch(err => {
            console.log(err);
          });
    }
  },
  methods: {
    ...mapActions([
      "updateRoomData",
      "addRoom",
      "deleteRoom",
      "saveCurrentRoom"
    ]),
    checkAuth() {
      let authToken = JSON.parse(localStorage.getItem("authToken"));
      if (!authToken) {
        this.$router.push("/login");
      }
    },
    checkLingeringUser(data) {
      for (const room of data) {
        if (room.users.some(room => room._id === this.getUserData._id)) {
          return true;
        }
      }
      return false;
    },
    fetchRoomData() {
      axios
        .get(`${config.apiUrl}/api/room`)
        .then(res => {
          if (this.checkLingeringUser(res.data)) {
            return axios.put(`${config.apiUrl}/api/room/remove/users/all`, {
              user_id: this.getUserData._id
            });
          } else {
            this.$store.dispatch("updateRoomData", res.data);
            this.$store.dispatch("saveCurrentRoom", res.data[0]);
            // this.rooms = res.data;
            this.activeRoom = res.data[0];
          }
        })
        .then(res => {
          if (res && res.data) {
            this.rooms = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    createNewConversation() {
      axios
        .post(`${config.apiUrl}/api/room`, {
          room_name: this.conversationName,
          password: this.conversationPassword
        })
        .then(res => {
          if (res.data.errors) {
            for (const error of res.data.errors) {
              const [value] = Object.values(error);
              this.errors.push(value);
            }
          } else {
            this.$store.dispatch("addRoom", res.data);
            this.room_name = null;
            this.password = null;
            this.writeNewMessage = false; //close popup
            this.$vs.notify({
              text: "Successfully created!",
              color: "success",
              position: "top-center"
            });
            this.getSocket.emit("roomAdded", res.data);
          }
        })
        .catch(err => {
          this.$vs.notify({
            text: "An error has occured!",
            color: "success",
            position: "top-center"
          });
          console.log(err);
        });

      setTimeout(() => {
        this.errors = [];
      }, 1500);
    },
    updateNewTitleActiveroom(newActiveRoom) {
      this.activeRoomTitle = newActiveRoom.title;
    },
    onSubmit(evt) {
      evt.preventDefault();
      axios
        .post(`${config.apiUrl}/api/room`, this.room)
        .then(response => {
          this.$router.push({
            name: "RoomList"
          });
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/variable.scss";

.app-messenger {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px); // - height of navbar
  overflow: hidden;
  .header {
    height: $header-height;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid $border-color;
    .left-header {
      min-width: $left-sidebar-width;
      .actions {
        line-height: $header-height;
        display: flex;
        position: relative;

        .ic-settings {
          position: absolute;
          font-size: 22px;
          top: $header-height/4;
          left: 5px;
          cursor: pointer;
        }

        .title-messenger {
          font-size: 16px;
          line-height: $header-height;
          margin: 0 auto;
        }

        .ic-edit {
          position: absolute;
          font-size: 22px;
          top: $header-height/4;
          right: 5px;
          cursor: pointer;
        }
      }
    }

    .content-header {
      flex-grow: 1;
      h2 {
        line-height: $header-height;
        text-align: center;
      }
      .inputx {
        margin-top: 5px;
      }
    }

    .right-header {
      min-width: $right-sidebar-width;
      .actions {
        display: flex;
        justify-content: flex-end;
        vertical-align: middle;
        margin-top: 10px;
        .custom-class {
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }
  }

  .main {
    display: flex;
    height: calc(100% - 50px); //$header-height
    overflow: hidden;
    .left-sidebar {
      min-width: $left-sidebar-width;
      border-right: 1px solid $border-color;
      height: 100%;
      // overflow-y: auto;
    }

    .content-main {
      flex-grow: 1;
      flex-direction: column;
      height: 100%;
      width: calc(100vw - 600px);
    }

    .right-sidebar {
      min-width: $right-sidebar-width;
      border-left: 1px solid $border-color;
      overflow-y: hidden;
    }
  }
}

.footer-popup {
  text-align: center;

  button {
    margin-right: 10px;
  }
}

.popup-individual {
  .vs-input-primary {
    width: 100% !important;
    margin-top: 10px;
  }
}
</style>