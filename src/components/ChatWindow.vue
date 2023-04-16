<template>
  <div class="chatWindow">
    <div v-for="(msg, item) in msgArr" :sender_type="msg.sender_type">
      <span class="sender">{{ (msg.sender_type?"服务器":"你") + "---"   }}</span>
      <span class="msgTimestamp">{{ msg.datetime }} </span>
      <div class="msgContent">{{ msg.content }}</div>
    </div>
    <div class="chatInputMsg">
      <input type="text" v-model="textMsg.content" @keyup.enter.native="sendChatTextMsg">
      <button @click="sendChatTextMsg">发送</button>
    </div>
    
  </div>
</template>

<script>
import { parseTime } from "@/utils/date";

export default {
  name: 'ChatWindow',
  data(){
    return {
      msgArr: [
        {
          timestamp: 1681622395180,
          datetime: parseTime(1681622395180),
          content: "aaa",
          content_type: 0,
          sender_type: 0 
        },
        {
          timestamp: 1681622395180,
          datetime: parseTime(1681622395180),
          content: "bbb",
          content_type: 0,
          sender_type: 1 
        }
      ],
      textMsg: {
        timestamp: 0,
        datetime: "",
        content: "",
        content_type: 0,
        sender_type: 0
      }
    }
  },
  methods:{
    sendChatTextMsg(){
      // TODO 网络请求发送
      console.log(this.textMsg.content)
      this.textMsg.timestamp = new Date().getTime();
      this.textMsg.datetime = parseTime(this.textMsg.timestamp)
      this.msgArr.push(this.textMsg);
      this.textMsg = {
        timestamp: 0,
        datetime: "",
        content: "",
        content_type: 0,
        sender_type: 0
      };
      const timestamp_now = new Date().getTime();
      const response_msg = {
        timestamp: timestamp_now,
        datetime: parseTime(timestamp_now),
        content: "a response text msg",
        content_type: 0,
        sender_type: 1
      }
      this.msgArr.push(response_msg)
    }
  },
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
.chatInputMsg{
  margin-top: -1;
  bottom: 1%;
  width: 95%;
  position: inherit;
}

input{
  margin-left: 0%;
  width: 80%;
}

button{
  margin-left: 2px
  
}

</style>


