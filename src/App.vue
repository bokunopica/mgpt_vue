<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <div class="mainDiv">
    
  </div>
  <ChatDemo />
  <!-- <SideBar /> -->
  <!-- <router-view/> -->
  
</template>

<script>
import SideBar from './components/SideBar.vue';
import ChatDemo from './components/ChatDemo.vue';
import api from './api/index'

export default{
  name: 'App',
  components: {
    SideBar,
    ChatDemo
  },
}


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.mainDiv{
  /* background-image: url("https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wHeX?ver=a93f"); */
  width: 100%;
  height: 100%;
  position: fixed;
  background-repeat: repeat-y;
  opacity: 15%;
}
</style>
