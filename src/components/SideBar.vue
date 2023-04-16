<template>
  <div class="sideBar">
    <div class="sideBarRow" v-for="(row, index) in sideBarRows">
      <router-link :to="row.to">{{ row.title }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeftNavBar',
  data(){
    return {
      sideBarRows: [
        {
          "to": "/",
          "title": "chat"
        },
      ]
    }
  }
}
</script>

<style scoped>
.sideBar{
  float:left;
  border: 1px;
  border-style: solid;
  position:absolute;
  width: 5%;
  height: 98%;
}
.sideBarRow{
  border: solid 1px;
  width: 100%;
  height: 5%;
  padding-top: 20%;
}

</style>


