<template>
  <div class="user-bar">
    <div class="profile-image">
      <img src="@/assets/images/avatar.png" alt class="img-responsive">
    </div>
    <div class="profile-name">{{authUser.username}}</div>
  </div>
</template>

<script>
export default {
    props: ['authUser']
}
</script>

<style lang="scss" scoped>
$header-height: 50px;
.user-bar {
  cursor: pointer;
    display: flex;
    // justify-content: flex-end;
    line-height: $header-height;
    padding: 0 10px;
    .profile-name {
        padding-left: 10px;
    }
    .profile-image {
        line-height: $header-height;
        img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }
    }
}
</style>
