<template>
  <div class="app-messenger">
    <div class="header">
      <div class="left-header">
        <div class="actions">
          <font-awesome-icon class="ic-settings" icon="cog"/>
          <h5 class="title-messenger">Messenger</h5>
          <font-awesome-icon class="ic-edit" icon="edit"/>
        </div>
      </div>
      <div class="content-header">
        <h2>Title</h2>
      </div>
      <div class="right-header">
        <UserProfile></UserProfile>
      </div>
    </div>
    <div class="main">
      <div class="left-sidebar">
        <ChannelList></ChannelList>
      </div>
      <div class="content-main">
        <MessageList></MessageList>
        <MessageInput></MessageInput>
      </div>
      <div class="right-sidebar">
        <vs-dropdown>
          <GetChannel :channel="activeChannel"></GetChannel>
          <vs-dropdown-menu>
            <vs-dropdown-item divider v-for="user in usersInChannel" :key="user.id">
              <GetUser :user="user"></GetUser>
            </vs-dropdown-item>
            <!-- <vs-dropdown-item divider></vs-dropdown-item> -->
          </vs-dropdown-menu>
        </vs-dropdown>
        <UserList></UserList>
      </div>
    </div>
  </div>
</template>

<script>
import UserProfile from "@/components/users/UserProfile.vue";
import MessageList from "@/components/messages/MessageList.vue";
import MessageInput from "@/components/messages/MessageInput.vue";
import ChannelList from "@/components/channels/ChannelList.vue";
import Channel from "@/components/channels/Channel.vue";
import GetChannel from "@/components/channels/GetChannel.vue";
import UserList from "@/components/users/UserList.vue";
import GetUser from "@/components/users/GetUser.vue";

export default {
  components: {
    UserProfile,
    MessageList,
    MessageInput,
    ChannelList,
    UserList,
    GetChannel,
    GetUser
  },
  data() {
    return {
      activeChannel: {},
      usersInChannel: []
    };
  },
  mounted() {
    this.addActiveChannel();
    this.addUsersInChannel();
  },
  methods: {
    addActiveChannel() {
      let i = 1;
      this.activeChannel = {
        id: `${i}`,
        title: `Channel ${i}`,
        lastMessage: `Message ${i}`
      };
    },
    addUsersInChannel() {
      let isOnline = true;
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          isOnline = true;
        } else {
          isOnline = false;
        }

        const newUser = {
          id: `${i}`,
          name: `User ${i}`,
          isOnline: isOnline,
          created: new Date()
        };
        this.usersInChannel.push(newUser);
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/variable.scss";

.app-messenger {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 58px); // - height of navbar
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
    }

    .right-header {
      min-width: $right-sidebar-width;
    }
  }

  .main {
    display: flex;
    height: calc(100% - $header-height);
    overflow: hidden;
    .left-sidebar {
      min-width: $left-sidebar-width;
      border-right: 1px solid $border-color;
      height: 100%;
      overflow-y: overlay;
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
      overflow-y: overlay;
    }
  }
}
</style>
