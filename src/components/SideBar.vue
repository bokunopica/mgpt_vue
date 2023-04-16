<template>
  <div class="sideBar">
    <div class="sideBarRow">
      <router-link to="/">main</router-link>
    </div>
    <div class="sideBarRow">
      <router-link to="/about">about</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeftNavBar',
}
</script>

<style scoped>
.sideBar{
  float:left;
  border: 1px;
  border-style: solid;
  position:absolute;
  width: 5%;
  height: 95%;
}
.sideBarRow{
  border: solid 1px;
  width: 100%;
  height: 5%;
  padding-top: 20%;
}

</style>


