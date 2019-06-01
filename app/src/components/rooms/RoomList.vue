<template>
  <div>
    <div v-if="rooms" class="rooms">
      <VuePerfectScrollbar class="scroll-area" :settings="settings">
        <Room
          @changeActiveRoom="changeActiveRoom($event)"
          :isActive="room.id === activeRoom"
          v-for="room in rooms"
          :key="room.id"
          :room="room"
        />
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import Room from "@/components/rooms/Room.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import config from "@/config";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import Error from "@/components/error/Error.vue";

export default {
  data() {
    return {
      rooms: [],
      errors: [],
      room_name: null,
      privateRoomName: null,
      password: null,
      privateRoomPassword: null,
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
    Room,
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
      this.$router.push({ name: "Room", params: { id: room._id } });
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
    addTestrooms() {
      for (let i = 0; i < 10; i++) {
        const newroom = {
          id: `${i}`,
          title: `room ${i}`,
          lastMessage: `Message ${i}`
        };
        this.rooms.push(newroom);
      }
    },
    changeActiveroom(newActiveroomId) {
      this.activeroom = newActiveroomId;
      this.$emit("changeTitleActiveroom", this.rooms[newActiveroomId]);
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

  .scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    height: 100%;
  }
}
</style>
