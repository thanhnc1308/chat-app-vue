<template>
  <div class="messenger">
    <div class="content-main">
      <MessageList></MessageList>
      <MessageInput v-if="activeRoom"></MessageInput>
    </div>
    <div class="right-sidebar">
      <vs-dropdown>
        <GetRoom v-if="activeRoom" :room="activeRoom"></GetRoom>
        <vs-dropdown-menu>
          <vs-dropdown-item divider v-for="user in users" :key="user.id">
            <GetUser :user="user"></GetUser>
          </vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown>
      <UserList :users="users"></UserList>
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
      users: [],
      startNewConversation: false,
      conversationName: "",
      conversationPassword: "",
      activeRoomTitle: "",
      toUser: "",
      //   activeRoom: "",
      writeNewMessage: false,
      errors: [],
      room: null,
      usersTyping: ""
    };
  },
  mounted() {
    this.fetchRoomData();
  },
  computed: {
    activeRoom: {
      get: function() {
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
    },
    ...mapGetters(["getUserData", "getCurrentRoom", "getSocket"]),
    filteredUsers() {
      return this.users
        .slice()
        .sort(this.sortAlphabetical)
        .filter(user =>
          user.lookup.username
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
        );
    },
    getUsersTyping() {
      if (this.usersTyping.length > 0) {
        return `${this.usersTyping.join(", ")} is typing...`;
      }
    }
  },
  watch: {
    $route(to, from) {
      axios
        .get(`${config.apiUrl}/api${to.path}`)
        .then(res => {
          this.room = res.data;
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
    },
    ...mapActions(["saveCurrentRoom"]),
    checkUserTabs(room) {
      if (
        room &&
        room.users.findIndex(
          user => user.lookup._id === this.getUserData._id
        ) === -1
      ) {
        this.$router.push({ name: "RoomList" });
      }
    },
    sortAlphabetical(a, b) {
      let userA = a.lookup.username.toUpperCase();
      let userB = b.lookup.username.toUpperCase();
      if (userA < userB) {
        return -1;
      }
      if (userA > userB) {
        return 1;
      }
      return 0;
    },
    leaveRoom(e, newPage) {
      if (e) {
        e.preventDefault();
      }
      axios
        .post(`${config.apiUrl}/api/room/remove/users`, {
          room_name: this.getCurrentRoom.name
        })
        .then(res => {
          if (
            this.room.access ||
            this.room.accessIds.includes(this.getUserData._id)
          ) {
            this.getSocket.emit("exitRoom", {
              room: res.data,
              user: null,
              admin: true,
              content: `${this.getUserData.handle} left ${
                this.getCurrentRoom.name
              }`
            });
          }
          this.roomLeft = true;
          if (!newPage) {
            this.$router.push({ name: "RoomList" });
          }
        });
    },
    openEditRoom() {
      this.$refs.editRoom.open();
    },
    handleEditRoom(e) {
      e.preventDefault();
      axios
        .post(`${config.apiUrl}/api/room/update/name`, {
          room_name: this.getCurrentRoom.name,
          new_room_name: this.newRoomName
        })
        .then(res => {
          if (res.data.errors) {
            for (const error of res.data.errors) {
              const [key] = Object.keys(error);
              const [value] = Object.values(error);
              this.errors.push({
                key,
                value
              });
            }
          } else {
            this.$refs.editRoom.close();
            this.getSocket.emit("roomUpdateEvent", {
              oldRoomName: this.getCurrentRoom.name,
              room: res.data
            });
            this.getSocket.emit("newMessage", {
              room: this.getCurrentRoom,
              user: this.getUserData,
              admin: true,
              content: `${this.getUserData.username} updated room ${
                this.getCurrentRoom.name
              } to ${this.newRoomName}`
            });
            this.newRoomName = "";
          }

          setTimeout(() => {
            this.errors = [];
          }, 1500);
        })
        .catch(err => console.log(err));
    },
    viewRoomDetails() {
      this.$refs.roomDetails.open();
    },
    toggleUserList() {
      this.$refs.userList.toggle();
      this.sidebarVisible = !this.sidebarVisible;
    }
  },
  created() {
    axios
      .get(`${config.apiUrl}/api/room/${this.$route.params.id}`)
      .then(res => {
        this.room = res.data;
        this.users = res.data.users;
        this.$store.dispatch("saveCurrentRoom", res.data);

        /** Check for private access and access Id */
        if (!res.data.access) {
          if (
            !res.data.accessIds.includes(this.getUserData._id) &&
            this.getUserData._id !== res.data.user.lookup._id
          ) {
            return this.$router.push({
              name: "RoomList",
              params: { message: "You do not have access to this room" }
            });
          }
        }
        /** Socket IO: User join event, get latest messages from room */
        this.getSocket.emit("userJoined", {
          room: this.getCurrentRoom,
          user: this.getUserData,
          content: `${this.getUserData.handle} joined ${
            this.getCurrentRoom.name
          }`,
          admin: true
        });

        /** Socket IO: Received New User Event */
        this.getSocket.on("updateRoomData", data => {
          data = JSON.parse(data);
          if (data.messages) {
            this.messages = data.messages;
          }

          if (data.room) {
            this.room = data.room;
            this.users = data.room.users;
            this.$store.dispatch("saveCurrentRoom", data.room);
          }
        });

        /** Socket IO: Reconnect User Event */
        this.getSocket.on("reconnect", () => {
          this.usersTyping = [];
          this.getSocket.emit("reconnectUser", {
            room: this.getCurrentRoom,
            user: this.getUserData
          });
        });

        this.getSocket.on("reconnected", () => {
          console.warn("Reconnected");
        });

        this.getSocket.on("disconnect", () => {
          console.warn("Disconnected");
        });

        /** Socket IO: User Exit Event - Update User List */
        this.getSocket.on("updateUserList", data => {
          this.users = JSON.parse(data).users;
        });

        /** Socket IO: User Exit Event - Check other tabs of the same room and redirect */
        this.getSocket.on("receivedUserExit", room => {
          this.checkUserTabs(room);
        });

        /** Socket IO: New Messaage Event - Append the new message to the messages array */
        this.getSocket.on("receivedNewMessage", message => {
          this.messages.push(JSON.parse(message));
        });

        /** Socket IO: User Typing Event  */
        this.getSocket.on("receivedUserTyping", data => {
          this.usersTyping = JSON.parse(data).filter(
            user => user !== this.getUserData.handle
          );
        });

        /** Socket IO: Room Deleted Event - Redirect all users */
        this.getSocket.on("roomDeleted", () => {
          this.$store.dispatch("saveCurrentRoom", null);
          setTimeout(() => {
            this.$router.push({ name: "RoomList" });
          }, 2000);
        });

        /** Socket IO: Room Updated Event */
        this.getSocket.on("roomUpdated", data => {
          this.room = JSON.parse(data).room;
          this.$store.dispatch("saveCurrentRoom", JSON.parse(data).room);
        });
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.$router.push({
            name: "RoomList",
            params: { message: "This room does not exist or has been deleted" }
          });
        }
      });
  },
  beforeDestroy() {
    if (this.getCurrentRoom && !this.roomLeft) {
      this.leaveRoom(null, true);
    }
    this.getSocket.removeListener("userJoined");
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/variable.scss";

.messenger {
  display: flex;

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
</style>