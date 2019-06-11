<template>
  <div>
    <div v-if="filteredRooms.length > 0" class="rooms">
      <VuePerfectScrollbar class="scroll-area" :settings="settings">
        <a
          v-for="room in filteredRooms"
          :key="room.id"
          :href="`room/${room._id}`"
          class="room"
          :room-id="room.id"
          @click.prevent="handleRoomClick(room)"
          @mouseenter="isHover = true"
          @mouseleave="isHover = false"
          :class="{'active' : isActive, 'hover' : isHover}"
        >
          <div class="room-image">
            <vs-avatar :text="room.name"/>
          </div>
          <div class="room-info">
            <div class="room-title">{{room.name}}</div>
            <p style="font-style: italic;">Last updated: {{moment(room.updated_at).fromNow()}}</p>
          </div>
        </a>
      </VuePerfectScrollbar>
    </div>
    <div v-else style="text-align: center; margin-top: 20px;">No Conversation</div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import config from "@/config";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import Error from "@/components/error/Error.vue";
import moment from "moment";

export default {
  data() {
    return {
      rooms: [],
      errors: [],
      room_name: null,
      privateRoomName: null,
      password: null,
      isHover: false,
      privateRoomPassword: null,
      isActive: false,
      searchInput: "",
      activeRoom: 0,
      settings: {
        //perfect scrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  components: {
    VuePerfectScrollbar,
    Error
  },
  computed: {
    ...mapGetters(["getUserData", "getRoomData", "getSocket"]),
    getPrivateRooms() {
      return this.rooms.filter(room => room.access === false);
    },
    getPublicRooms() {
      return this.rooms.filter(room => room.access === true);
    },
    filteredRooms() {
      if (this.searchInput.toLowerCase() === "my_rooms") {
        return this.rooms.filter(
          room => room.user._id === this.getUserData._id
        );
      } else {
        return this.rooms
          .slice()
          .sort(this.sortAlphabetical)
          .filter(room =>
            room.name.toLowerCase().includes(this.searchInput.toLowerCase())
          );
      }
    }
  },
  methods: {
    ...mapActions([
      "updateRoomData",
      "addRoom",
      "deleteRoom",
      "saveCurrentRoom"
    ]),
    sortAlphabetical(a, b) {
      let roomA = a.name.toUpperCase();
      let roomB = b.name.toUpperCase();
      if (roomA < roomB) {
        return -1;
      }
      if (roomA > roomB) {
        return 1;
      }
      return 0;
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
            this.rooms = res.data;
            this.activeRoom = this.rooms[0];
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
    openModal() {
      this.$refs.createRoom.open();
    },
    enterRoom(room) {
      this.$router.push({ name: "Messenger", params: { id: room._id } });
    },
    handleCreateRoom(e) {
      e.preventDefault();

      axios
        .post(`${config.apiUrl}/api/room`, {
          room_name: this.room_name,
          password: this.password
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
            this.$refs.createRoom.close();
            this.getSocket.emit("roomAdded", res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });

      setTimeout(() => {
        this.errors = [];
      }, 1500);
    },
    handleDelete(e) {
      e.preventDefault();
      axios
        .delete(`${config.apiUrl}/api/room/${e.target.name}`)
        .then(res => {
          this.$store.dispatch("deleteRoom", res.data);
          this.getSocket.emit("roomDeleted", {
            room: res.data,
            user: this.getUserData,
            admin: true,
            content: `${res.data.user.username} deleted room ${res.data.name}`
          });
        })
        .catch(err => console.log(err));
    },
    handleRoomClick(room) {
      if (
        room.access ||
        this.getUserData._id === room.user._id ||
        room.accessIds.includes(this.getUserData._id)
      ) {
        this.enterRoom(room);
      } else {
        this.privateRoomName = room.name;
        this.$refs.privateRoom.setData("room", room);
        this.$refs.privateRoom.open();
      }
    },
    handlePrivateRoomCheck(e) {
      e.preventDefault();
      axios
        .post(`${config.apiUrl}/api/room/verify`, {
          room_name: this.$refs.privateRoom.modalData.room.name,
          password: this.privateRoomPassword
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
            this.privateRoomPassword = null;
          } else {
            if (res.data.success) {
              this.enterRoom(this.$refs.privateRoom.modalData.room);
            }
          }

          setTimeout(() => {
            this.errors = [];
          }, 1500);
        })
        .catch(err => console.log(err));
    },
    changeActiveroom(newActiveroomId) {
      this.activeroom = newActiveroomId;
      this.$emit("changeTitleActiveroom", this.rooms[newActiveroomId]);
    },
    enterRoom(room) {
      this.$router.push({ name: "Messenger", params: { id: room._id } });
    },
    handleRoomClick(room) {
      if (
        room.access ||
        this.getUserData._id === room.user._id ||
        room.accessIds.includes(this.getUserData._id)
      ) {
        this.enterRoom(room);
      } else {
        this.privateRoomName = room.name;
        this.$refs.privateRoom.setData("room", room);
        this.$refs.privateRoom.open();
      }
    }
  },
  created() {
    this.getSocket.on("roomAdded", data => {
      this.rooms.unshift(JSON.parse(data));
    });

    this.getSocket.on("roomListUpdated", data => {
      this.rooms = this.rooms.filter(
        room => room._id !== JSON.parse(data).room._id
      );
    });

    this.getSocket.on("updateRooms", data => {
      this.rooms = JSON.parse(data).room;
    });

    this.getSocket.on("roomNameUpdated", data => {
      let updateIndex = 0;
      this.rooms.forEach((room, index) => {
        if (room._id === JSON.parse(data).room._id) {
          updateIndex = index;
        }
      });
      this.rooms.splice(updateIndex, 1, JSON.parse(data).room);
    });
  },
  mounted() {
    this.fetchRoomData();
    if (this.errorMessage) {
      setTimeout(() => {
        this.errorMessage = "";
      }, 1500);
    }
  }
};
</script>

<style lang="scss" scoped>
.rooms {
  overflow-y: auto;
  height: calc(100vh - 50px - 58px);
  a {
    color: #000;
    text-decoration: none;
  }
  .scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    height: 100%;
  }
}

@import "@/assets/scss/variable.scss";
.active {
  background-color: rgba(0, 0, 0, 0.05);
}

.hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.room {
  display: flex;
  cursor: pointer;
  border-bottom: 1px solid $border-color;
  padding: 8px;
  padding-bottom: 0;
  .room-image {
    img {
      max-width: 100%;
    }
    .room-avatars {
      overflow: hidden;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #ccc;
      position: relative;

      &.room-avatars-1 {
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      &.room-avatars-2 {
        img {
          width: 50%;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          &:first-child {
            left: 0;
            top: 0;
          }
        }
      }
      &.room-avatars-3 {
        img {
          position: absolute;
          width: 50%;
          height: 50%;
          right: 0;
          top: 0;
          &:first-child {
            left: 0;
            top: 0;
            width: 50%;
            height: 100%;
          }
          &:last-child {
            bottom: 0;
            right: 0;
            top: 15px;
            width: 50%;
            height: 50%;
          }
        }
      }
      &.room-avatars-4 {
        img {
          position: absolute;
          width: 50%;
          height: 50%;
          right: 0;
          top: 0;
          &:first-child {
            left: 0;
            top: 0;
            width: 50%;
            height: 100%;
          }
          &:nth-child(3n) {
            bottom: 0;
            right: 0;
            top: 15px;
            width: 50%;
            height: 50%;
          }
          &:last-child {
            left: 0;
            bottom: 0;
            top: 15px;
          }
        }
      }
    }
  }
  .room-info {
    flex-grow: 1;
    padding-left: 8px;
    padding-right: 8px;
    overflow: hidden;
    h2 {
      font-size: 13px;
      font-weight: 400;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    p {
      font-size: 12px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  &.active {
    background: rgba(0, 0, 0, 0.05);
  }
  &.notify {
    .room-info {
      p {
        color: $primary-color;
      }
    }
  }
}
</style>
