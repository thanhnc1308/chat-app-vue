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
        <div class="actions">
          <phone-icon class="custom-class"></phone-icon>
          <video-icon class="custom-class"></video-icon>
          <more-horizontal-icon class="custom-class"></more-horizontal-icon>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="left-sidebar">
        <ChannelList></ChannelList>
      </div>
      <div class="content-main">
        <MessageList></MessageList>
        <!-- <MessagesList></MessagesList> -->
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
import MessagesList from "@/components/messages/MessagesList.vue";
import Test from "@/components/messages/Test.vue";
import MessageInput from "@/components/messages/MessageInput.vue";
import ChannelList from "@/components/channels/ChannelList.vue";
import Channel from "@/components/channels/Channel.vue";
import GetChannel from "@/components/channels/GetChannel.vue";
import UserList from "@/components/users/UserList.vue";
import GetUser from "@/components/users/GetUser.vue";

import { VideoIcon } from "vue-feather-icons";
import { PhoneIcon } from "vue-feather-icons";
import { MoreHorizontalIcon } from "vue-feather-icons";

export default {
  components: {
    UserProfile,
    MessageList,
    MessageInput,
    ChannelList,
    UserList,
    GetChannel,
    GetUser,
    VideoIcon,
    PhoneIcon,
    MoreHorizontalIcon,
    MessagesList,
    Test,
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
    height: 100%;
    overflow: hidden;
    .left-sidebar {
      min-width: $left-sidebar-width;
      border-right: 1px solid $border-color;
      height: 100%;
      overflow-y: auto;
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
</style>
