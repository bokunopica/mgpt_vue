<template>
  <div class="chatWindow" id="chatWindow">
    <ul>
      <li v-for="(msg, index) in msgArr" :class="`msg_sender_${msg.sender_type}`">
        <span class="sender">{{ (msg.sender_type?"服务器":"你") + "[" + msg.datetime+ "]:"   }} </span><br>
        <span class="msgContent">{{ msg.text_content }}</span>
      </li>
    </ul>
    <div><a id="msg_end" name="1" href="#1">&nbsp</a></div>
  </div>
  <div class="chatInput">
    <div class="chatInputMsg">
      <input type="text" v-model="textMsg.content" @keyup.enter.native="sendChatTextMsg">
      <button @click="sendChatTextMsg">发送</button>
    </div>
  </div>

</template>

<script>
import { parseTime } from "@/utils/date";
import Recorder from 'js-audio-recorder';
import roundNum from '@/utils/round';
import api from "@/api";
import { socket } from "@/socket";

export default {
  name: 'ChatDemo',
  data(){
    return {
      msgArr: [
        // example
        // {
        //   timestamp: 1681622395180,
        //   datetime: parseTime(1681622395180),
        //   content: "aaa",
        //   content_type: 0,
        //   sender_type: 0 
        // },
        // {
        //   timestamp: 1681622395180,
        //   datetime: parseTime(1681622395180),
        //   content: "bbb",
        //   content_type: 0,
        //   sender_type: 1 
        // }
      ],
      textMsg: {
        timestamp: 0,
        datetime: "",
        content: "",
        content_type: 0,
        sender_type: 0,
      },
      is_text: 1,
      is_audio: 0,
      history: [],
      test_text: ""
    }
  },
  methods:{
    async sendChatTextMsg(){
      // 网络请求发送
      if(this.textMsg.content!=""){
        this.textMsg.timestamp = new Date().getTime();
        this.textMsg.datetime = parseTime(this.textMsg.timestamp)
        this.msgArr.push(this.textMsg);
        
        let prompt = this.textMsg.content
        let history = this.history

        this.textMsg = {
          timestamp: 0,
          datetime: "",
          content: "",
          content_type: 0,
          sender_type: 0
        };
        
        // TODO 转为socket形式
        socket.emit('model_text_response', {'data': prompt})
        
        let response_msg = await api.getTextMsgResponse({
          "prompt": prompt,
          "history": history,
        });
        response_msg.datetime = parseTime(response_msg.timestamp)

        this.msgArr.push({
          timestamp: response_msg.timestamp,
          datetime: response_msg.datetime,
          content: response_msg.content,
          content_type: response_msg.content_type,
          sender_type: response_msg.sender_type
        });
        if(response_msg.history){
          this.history = response_msg.history;
        }

        
        this.scrollToBottom();
      }
    },
    playMsgRecord(content){
      // Recorder.playAudio(content);
      this.recorderObj.play(content);
    },
    scrollToBottom () {
      this.$nextTick(() => {
          var container = document.getElementById("chatWindow")
          container.scrollTop = container.scrollHeight;
      })
    }
  },
  mounted(){
    // socket.io
    socket.connect();

    // 监听模型回复的任务
    socket.on('model_text_response', (data)=>{
      data = JSON.parse(data);
      // TODO 根据对应id来更新相应消息
      console.log(data);
    })    
  },
  updated(){
  },
  unmounted(){
    socket.disconnect();
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
  height: 95%;
  overflow:auto;
}

.chatInput{
  bottom: 1.3%;
  width: 92%;
  left: 6.5%;
  height: 2%;
  border: 1px solid black;
  position: absolute
}
.chatInputMsg{
  bottom: 1.3%;
  width: 95%;
  position: absolute;
}

.audioInputMsg{
  bottom: 1.3%;
  left: 70%;
  right: 5%;
  position: absolute;
}

input{
  margin-left: 0%;
  width: 80%;
}

button{
  margin-left: 2px
  
}

.switchInputButton{
  position:absolute;
  right: 3%;
  bottom: 1.3%;
}

.windowTop{
  position: inherit;
  top: 0;
}

.msg_sender_0{
  position:relative;
  right: 0;
}


.msg_sender_1{
  position:relative;
  left: 0;
}

ul {
  list-style: none;
  padding: 20px;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
}

li.msg_sender_1 {
  margin-right: 20px;
  text-align: left;
}

li.msg_sender_1 span {
  display: inline-block;
  /* border-radius: 0 15px 15px; */
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
}

li.msg_sender_0 {
  margin-left: 20px;
  text-align: right;
}

li.msg_sender_0 span {
  display: inline-block;
  /* border-radius: 15px 0 15px 15px; */
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
}

li.msg_sender_0 div {
  display: inline-block;
  /* border-radius: 15px 0 15px 15px; */
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
}

li.msg_sender_1 div {
  display: inline-block;
  /* border-radius: 15px 0 15px 15px; */
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
}

.playAudioTest{
  position:absolute;
  bottom: 120%;
}

#msg_end{
  display: none;
}


</style>


