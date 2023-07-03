<template>
  <div class="chatWindow" id="chatWindow">
    <ul>
      <li v-for="(msg, index) in msgArr" :class="`msg_sender_${msg.sender_type}`">
        <span class="sender">{{ (msg.sender_type?"服务器":"你") + "[" + msg.datetime+ "]:"   }} </span><br>
        <span class="msgContent">{{ msg.content }}</span>
      </li>
    </ul>
    <div><a id="msg_end" name="1" href="#1">&nbsp</a></div>
  </div>
  <div class="chatInput">
    <div class="chatInputMsg">
      <input type="text" v-model="textMsg.content" @keyup.enter.native="sendChatTextMsg">
      <button @click="sendChatTextMsg" v-bind:disabled="button_lock">发送</button>
    </div>
  </div>

</template>

<script>
import { parseTime } from "@/utils/date";
import { get_uuid } from "@/utils/uuid"
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
      test_text: "",
      button_lock: 0,
    }
  },
  methods:{
    async sendChatTextMsg(){
      // button lock
      if(this.button_lock==0){
        this.button_lock = 1;
      }else{
        return ;
      }
      // 网络请求发送
      if(this.textMsg.content!=""){
        this.textMsg.timestamp = new Date().getTime();
        this.textMsg.datetime = parseTime(this.textMsg.timestamp);
        this.msgArr.push(this.textMsg);
        
        let query = this.textMsg.content;
        let history = this.history;
        console.log(history);

        this.textMsg = {
          timestamp: 0,
          datetime: "",
          content: "",
          content_type: 0,
          sender_type: 0
        };
        // 转为socket形式
        let _request_id = get_uuid();
        socket.emit(
          'model_text_response', 
          {
            'query': query,
            'history': history,
            '_request_id': _request_id,
          },
        )
        
        let current_timestamp = new Date().getTime();
        
        let response_msg = {
          timestamp: current_timestamp,
          datetime: parseTime(current_timestamp),
          content: '',
          content_type: 0,
          sender_type: 1,
          _request_id: _request_id,
        }

        this.msgArr.push(response_msg);
        this.scrollToBottom();
      }
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
      if(data.is_end){
        for (let i = 0; i<this.msgArr.length; i++){
          if(this.msgArr[i]._request_id==data._request_id){
            console.log(data);
            this.history = data.history;
            break;
          }
        }
      }else{
        for (let i = 0; i<this.msgArr.length; i++) { 
          if(this.msgArr[i]._request_id==data._request_id){
            this.msgArr[i].content = data.content;
            this.button_lock = 0;
            break; 
          }
        }
      }
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


