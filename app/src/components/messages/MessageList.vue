<template>
  <div>
    <div class="messages" v-if="messages">
      <VuePerfectScrollbar v-chat-scroll class="scroll-area" :settings="settings">
        <!-- <transition-group name="slide" tag="div" class="messageslist"> -->
          <div
            v-for="message in messages"
            :key="message.id"
            :class="{'message' : true, 'me': message.admin}"
          >
            <div class="message-user-image">
              <vs-avatar :text="message.admin ? 'You' : message.user.username.charAt(0).toUpperCase()"/>
            </div>
            <div class="message-body">
              <div class="message-author">{{message.admin ? 'You' : message.user.username}}</div>

              <vs-tooltip
                :position="message.admin ? 'right' : 'left'"
                :text="moment(message.created_at).fromNow()"
              >
                <div class="message-text">
                  <span>{{message.content}}</span>
                </div>
              </vs-tooltip>
            </div>
          </div>
        <!-- </transition-group> -->
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import io from "socket.io-client";
import { mapActions, mapGetters } from "vuex";
import config from "@/config";

export default {
  computed: {
    ...mapGetters(["getUserData", "getCurrentRoom", "getSocket"]),
  },
  data() {
    return {
      messages: [],
      user: null,
      settings: {
        //perfect scrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  created() {
    this.user = this.getUserData;

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
  },
  components: {
    // Message,
    VuePerfectScrollbar
  },
  mounted() {
    // this.addTestMessage();
    // this.scrollMessages();
  },
  methods: {
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
    scrollMessages() {
      var container = this.$refs.messages;
      container.scrollTop = container.scrollHeight;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.messages {
  display: flex;
  flex-direction: column;
  padding: 20px;
  // overflow-y: auto;
  height: calc(100% - 60px - 58px - 50px);

  // top: $header-height  + 58px;
  bottom: 60px;
  position: absolute;
  width: calc(100vw - 600px);

  .scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    height: 100%;
  }
}

// transition
.slide-enter-active {
  transition: all 1s;
}

.slide-leave-active {
  transition: all 1s;
}

.slide-enter-to,
.slide-leave {
  //  max-height: 100px;
  //  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  //  overflow: hidden;
  //  max-height: 0;
  opacity: 0;
  transform: translateY(30px);
}

.message {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 15px 0;

  .message-user-image {
    img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
  }

  .message-body {
    .message-author {
    }

    .message-text {
      background: $primary-color;
      padding: 10px;
      border-radius: 10px;
      p {
        margin-bottom: 0;
      }
    }
  }

  &.me {
    justify-content: flex-end;
    .message-body {
      .message-text {
        background: $secondary-color;
        color: #fff;
      }
    }
  }
}
</style>
