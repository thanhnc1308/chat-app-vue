<template>
  <div class="app-messenger">
    <div class="header">
      <div class="left-header">
        <div class="actions">
          <font-awesome-icon class="ic-settings" icon="cog"/>
          <h5 class="title-messenger">Messenger</h5>
          <font-awesome-icon @click="startNewConversation = true" class="ic-edit" icon="edit"/>
        </div>
      </div>
      <div class="content-header">
        <h2 v-if="!writeNewMessage">{{activeRoomTitle}}</h2>
        <vs-input
          v-else
          @keyup.enter="onSubmit()"
          v-model.trim="room.room_name"
          @blur="writeNewMessage = false"
          class="inputx"
          placeholder="Write message to..."
          v-model="toUser"
        />
      </div>
      <div class="right-header">
        <div class="actions">
          <phone-icon class="custom-class"></phone-icon>
          <video-icon class="custom-class"></video-icon>
          <more-horizontal-icon class="custom-class"></more-horizontal-icon>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="left-sidebar">
        <RoomList @changeTitleActiveRoom="updateNewTitleActiveRoom($event)"></RoomList>
      </div>
      <router-view></router-view>
    </div>

    <!-- popup write new conversation -->
    <vs-popup class="holamundo" title="New Conversation" :active.sync="startNewConversation">
      <vs-tabs>
        <vs-tab label="Individual">
          <div class="popup-individual">
            <vs-input
              label="Name"
              placeholder="Enter Conversation Name"
              v-model.trim="conversationName"
            />
            <vs-input
              type="password"
              label="Password"
              placeholder="Enter Conversation Password"
              pattern=".{5,10}"
              title="Password must be between 5 and 15 characters"
              v-model.trim="conversationPassword"
            />
            <Error :errors="errors"/>
          </div>
        </vs-tab>
        <vs-tab label="Group Chat">
          <div class="popup-individual">
            <vs-input label="Name" placeholder="Enter Group Name" v-model.trim="conversationName"/>
            <vs-input
              type="password"
              label="Password"
              placeholder="Enter Group Password"
              pattern=".{5,10}"
              title="Password must be between 5 and 15 characters"
              v-model.trim="conversationPassword"
            />
            <Error :errors="errors"/>
          </div>
        </vs-tab>
      </vs-tabs>
      <vs-divider></vs-divider>
      <div class="footer-popup">
        <vs-button @click="createNewConversation()" color="danger" type="filled">Create</vs-button>
        <vs-button @click="startNewConversation = false" color="dark" type="border">Close</vs-button>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import RoomList from "@/components/rooms/RoomList.vue";
import Error from "@/components/error/Error.vue";

import { VideoIcon } from "vue-feather-icons";
import { PhoneIcon } from "vue-feather-icons";
import { MoreHorizontalIcon } from "vue-feather-icons";
import { mapActions, mapGetters } from "vuex";

import axios from "axios";
import config from "@/config";

export default {
  beforeRouteEnter(to, from, next) {
    let authToken = localStorage.getItem("authToken");
    if (!authToken) {
      return next({ path: "/login" });
    }
    next();
  },
  components: {
    RoomList,
    VideoIcon,
    PhoneIcon,
    MoreHorizontalIcon,
    Error,
  },
  data() {
    return {
      startNewConversation: false,
      conversationName: "",
      conversationPassword: "",
      activeRoomTitle: "",
      activeRoom: "",
      writeNewMessage: false,
      errors: [],
      room: {}
    };
  },
  mounted() {
    this.fetchRoomData();
  },
  computed: {
    // activeRoom() {
    //   axios
    //     .get(`${config.apiUrl}/api/room/${this.$route.params.id}`)
    //     .then(res => {
    //       return res.data;
    //     });
    // }
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