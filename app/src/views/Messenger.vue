<template>
    <div class="app-messenger">
        <div class="header">
            <div class="left-header">
                <div class="actions">

                </div>
            </div>
            <div class="content-header"><h2>Title</h2></div>
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
                <Channel :channel="activeChannel"></Channel>
                <UserList></UserList>
            </div>
        </div>
    </div>
</template>

<script>
import UserProfile from '@/components/users/UserProfile.vue';
import MessageList from '@/components/messages/MessageList.vue';
import MessageInput from '@/components/messages/MessageInput.vue';
import ChannelList from '@/components/channels/ChannelList.vue';
import Channel from '@/components/channels/Channel.vue';
import UserList from '@/components/users/UserList.vue';

export default {
    components: {
        UserProfile,
        MessageList,
        MessageInput,
        ChannelList,
        Channel,
        UserList,
    },
    data() {
        return {
            activeChannel: {},
        }
    },
    mounted() {
        this.addActiveChannel();
    },
    methods: {
        addActiveChannel() {
            let i = 1;
            this.activeChannel = {
                id: `${i}`,
                title: `Channel ${i}`,
                lastMessage: `Message ${i}`,
            }
        },
    },
}
</script>

<style lang="scss">
@import "@/assets/scss/variable.scss";

.app-messenger {
    display: flex;
    flex-direction: column;
    .header {
        height: $header-height;
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid $border-color;
        .left-header {
            width: $left-sidebar-width;
            .actions {
                line-height: $header-height;
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
            width: $right-sidebar-width;
        }
    }

    .main {
        display: flex;
        height: 100%;
        overflow: hidden;
        .left-sidebar {
            width: $left-sidebar-width;
            border-right: 1px solid $border-color;
        }

        .content-main {
            flex-grow: 1;
            overflow: hidden;
            flex-direction: column;
        }

        .right-sidebar {
            width: $right-sidebar-width;
            border-left: 1px solid $border-color;
        }
    }
}

</style>
