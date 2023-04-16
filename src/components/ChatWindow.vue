<template>
  <div class="chatWindow">
    <div v-for="(msg, item) in msgArr" :sender_type="msg.sender_type">
      <div class="msgTimestamp">{{ msg.timestamp }} => </div>
      <div class="msgContent">{{ msg.content }}</div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'ChatWindow',
  data(){
    return {
      msgArr: [
        {
          timestamp: 1681622395180,
          content: "aaa",
          content_type: 0,
          sender_type: 0 
        },
        {
          timestamp: 1681622395180,
          content: "bbb",
          content_type: 0,
          sender_type: 1 
        }
      ],
      send_msg: {
        timestamp: 0,
        content: "",
        content_type: 0,
        sender_type: 0
      }
    }
  }
}
</script>

<style scoped>
.chatWindow{
  left: 6.5%;
  border: 1px;
  border-style: solid;
  position:absolute;
  width: 92%;
  height: 98%;
}

</style>


