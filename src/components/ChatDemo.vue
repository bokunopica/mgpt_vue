<template>
  <div class="topBar">
    <img src="img/icons/favicon-32x32.png" alt="">
    <div id="topBarTitle">MedGPT</div>
  </div>
  <div class="chatWindow" id="chatWindow">
    <ul>
      <li v-for="(msg, index) in msgArr" :class="`msg_sender_${msg.sender_type}`">
        <img :src="msg.sender_type?'img/icons/medglm_avatar.jpg':'img/icons/user_avatar.png'" alt="" class="chatAvatar">
        <br>
        <div class="msgContent">{{ msg.content }}</div>
      </li>
    </ul>
  </div>
  <div class="chatInput">
    <div class="chatInputMsg">
      <input type="text" v-model="textMsg.content" @keyup.enter.native="sendChatTextMsg">
      <button @click="sendChatTextMsg" v-bind:disabled="button_lock">提交</button>
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
    },
    delayActivateButton(){
      this.button_lock = 0;
      clearInterval(this.btn_timer);
    }
  },
  mounted(){
    // socket.io
    socket.connect();
    // 监听模型回复的任务
    socket.on('model_text_response', (data)=>{
      data = JSON.parse(data);
      // 根据对应id来更新相应消息
      if(data.is_end){
        for (let i = 0; i<this.msgArr.length; i++){
          if(this.msgArr[i]._request_id==data._request_id){
            this.history = data.history;
            this.btn_timer = setInterval(this.delayActivateButton, 1000);
            this.scrollToBottom();
            break;
          }
        }
      }else{
        for (let i = 0; i<this.msgArr.length; i++) { 
          if(this.msgArr[i]._request_id==data._request_id){
            this.msgArr[i].content = data.content;
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
.topBar{
  height:5%;
  width: 100%;
  margin-left: 0;
  background-color: #d9e8d8;
  position: fixed;
  top: 0;
  left: 0;
  margin-bottom: 5px;
}

.topBar img{
  height: 4%;
  left: 3%;
  top: 0.5%;
  position: fixed;
}

.topBar div{
  margin: 0 auto;
  width: 100%;
  height: 5%;
  text-align: center;
  line-height: 40px;
  border: 1px solid #ddd;
}

.chatWindow{
  border: 1px solid gray;
  position:fixed;
  left: 0.5%;
  top: 5%;
  width: 99%;
  height: 86%;
  overflow:auto;
}

.chatInput{
  bottom: 1.3%;
  width: 95%;
  left: 2.5%;
  height: 7.5%;
  position: absolute
}
.chatInputMsg{
  bottom: 1.3%;
  width: 100%;
  position: absolute;
}

.chatInputMsg input{
  width: 77%;
  height: 5%;
  left: 2.5%;
  bottom: 1.5%;
  position:fixed;
  font-size: 20px;
}

.chatInputMsg button{
  bottom: 1.5%;
  height: 5.5%;
  right: 2%;
  width: 15%;
  position: fixed;
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
  position: relative;
}

li.msg_sender_0 {
  margin-left: 20px;
  text-align: right;
  position: relative;
}

.chatAvatar{
  width: 32px;
  height: 32px;
  position: relative;
}

.msgContent{
  margin-top: 1%;
  display: inline-block;
  inline-size: auto;
  border-radius: 15px 15px 15px 15px;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
  position: relative;
}

</style>


