<template>
  <div class="chatWindow">
    <div v-for="(msg, index) in msgArr" :sender_type="msg.sender_type">
      <span class="sender">{{ (msg.sender_type?"服务器":"你") + "---"   }}</span>
      <span class="msgTimestamp">{{ msg.datetime }} </span>
      <div class="msgContent" v-if="!msg.content_type">{{ msg.content }}</div>
      <div class="audioMsgContent" v-if="msg.content_type">
        <button @click="playMsgRecord(msg.content)">播放录音: {{ msg.duration }}s</button>
      </div>
    </div>
    <div class="chatInputMsg" v-if="is_text">
      <input type="text" v-model="textMsg.content" @keyup.enter.native="sendChatTextMsg">
      <button @click="sendChatTextMsg">发送</button>
    </div>
    <div class="audioInputMsg" v-if="is_audio">
      <button @click="playRecord" v-if="this.audioMsg.duration">播放录音: {{ this.audioMsg.duration }}s</button>
      <button @mousedown="startRecord" @mouseup="endRecord">{{record_status_msg}}</button>
      <button @click="sendChatAudioMsg">发送</button>
    </div>
    <button class="switchInputButton" @click="switchInput">切换输入方式</button>
    
  </div>
</template>

<script>
import { parseTime } from "@/utils/date";
import Recorder from 'js-audio-recorder';

export default {
  name: 'ChatWindow',
  data(){
    return {
      msgArr: [
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
        sender_type: 0
      },
      audioMsg:{
        timestamp: 0,
        datetime: "",
        content: null,
        content_type: 1,
        sender_type: 0,
        duration: 0,
      },
      is_text: 0,
      is_audio: 1,
      record_status_msg: "长按录音",
      recorderObj: null,
    }
  },
  methods:{
    sendChatTextMsg(){
      // TODO 网络请求发送
      if(this.textMsg.content!=""){
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
    startRecord(){
      // 开始录音
      this.record_status_msg = "正在录音"
      this.recorderObj.start()
    },
    endRecord(){
      // 结束录音
      this.record_status_msg = "长按录音"
      this.recorderObj.stop();
      this.audioMsg.content = this.recorderObj.getWAVBlob();
      this.audioMsg.duration = this.recorderObj.duration;
    },
    playRecord(){
      // 播放录音
      // Recorder.playAudio(this.audioMsg.content);
      this.recorderObj.play();
    },
    playMsgRecord(content){
      this.recorderObj.play(content);
    },
    sendChatAudioMsg(){
      // TODO 网络请求发送
      if(this.recorderObj.size!=0){
        console.log(this.audioMsg)
        this.audioMsg.timestamp = new Date().getTime();
        this.audioMsg.datetime = parseTime(this.audioMsg.timestamp);
        this.msgArr.push(this.audioMsg);
        this.audioMsg = {
          timestamp: 0,
          datetime: "",
          content: null,
          content_type: 1,
          sender_type: 0,
          duration: 0
        };
        const timestamp_now = new Date().getTime();
        const response_msg = {
          timestamp: timestamp_now,
          datetime: parseTime(timestamp_now),
          content: "a response text msg for audio msg",
          content_type: 0,
          sender_type: 1
        }
        this.msgArr.push(response_msg)
      }
    },
    switchInput(){
      this.is_text = !this.is_text;
      this.is_audio = !this.is_audio;
    }
  },
  mounted(){
    navigator.mediaDevices.getUserMedia({ audio: true }); 
    let recorder = new Recorder();
    this.recorderObj = recorder;
  },
  unmounted(){
    this.recorderObj = null;
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
.chatInputMsg{
  margin-top: -1;
  bottom: 1%;
  width: 95%;
  position: inherit;
}

.audioInputMsg{
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

.switchInputButton{
  position: absolute;
  left: 0;
  top: 0;
}

</style>


