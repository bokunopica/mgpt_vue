<template>
  <div class="chatWindow">
    <ul>

      <li v-for="(msg, index) in msgArr" :class="`msg_sender_${msg.sender_type}`">
        <span class="sender">{{ (msg.sender_type?"服务器":"你") + "[" + msg.datetime+ "]:"   }} </span><br>
        <span class="msgContent" v-if="!msg.content_type">{{ msg.content }}</span>
        <div class="audioMsgContent" v-if="msg.content_type">
          <!-- <button @click="playMsgRecord(msg.content)">播放录音: {{ msg.duration }}s</button> -->
          <audio controls currentTime :src="msg.audio_url"></audio>
        </div><br>
        <span class="msgContent" v-if="msg.text_content">{{ msg.text_content }}</span>
      </li>
    </ul>

    <div class="chatInputMsg" v-if="is_text">
      <input type="text" v-model="textMsg.content" @keyup.enter.native="sendChatTextMsg">
      <button @click="sendChatTextMsg">发送</button>
    </div>
    <div class="audioInputMsg" v-if="is_audio">
      <button class="playAudioTest" @click="playRecord" v-if="this.audioMsg.duration">播放录音: {{ this.audioMsg.duration }}s</button>
      <button @mousedown="startRecord" @mouseup="endRecord">{{record_status_msg}}</button>
      <button @click="sendChatAudioMsg">发送</button>
    </div>
    <button class="switchInputButton" @click="switchInput">切换输入方式</button>
  </div>
</template>

<script>
import { parseTime } from "@/utils/date";
import Recorder from 'js-audio-recorder';
import roundNum from '@/utils/round';
import api from "@/api";

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
        sender_type: 0,
      },
      audioMsg:{
        timestamp: 0,
        datetime: "",
        content: null,
        content_type: 1,
        sender_type: 0,
        duration: 0,
        text_content: "",
        audio_url: "",
      },
      is_text: 0,
      is_audio: 1,
      record_status_msg: "长按录音",
      recorderObj: null,
    }
  },
  methods:{
    async sendChatTextMsg(){
      // 网络请求发送
      if(this.textMsg.content!=""){
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
        // const response_msg = {
        //   content: "a response text msg",
        //   content_type: 0,
        //   sender_type: 1
        // }
        let response_msg = await api.getTextMsgResponse({
          "question": this.textMsg.content
        });
        response_msg.datetime = parseTime(response_msg.timestamp);
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
      this.audioMsg.duration = roundNum(this.recorderObj.duration, 2);
    },
    playRecord(){
      // 播放录音
      // Recorder.playAudio(this.audioMsg.content);
      this.recorderObj.play();
    },
    playMsgRecord(content){
      console.log(content)
      // Recorder.playAudio(content);
      this.recorderObj.play(content);
    },
    async sendChatAudioMsg(){
      // 网络请求发送
      if(this.audioMsg.duration!=0){
        // PCM流数据写入formData
        var formData = new FormData();
        formData.append('audio', this.audioMsg.content)

        this.audioMsg.timestamp = new Date().getTime();
        this.audioMsg.datetime = parseTime(this.audioMsg.timestamp);


        
        
        // get text info from backend Audio2Text
        let a2t_response = await api.AudioToTextResponse(formData);
        this.audioMsg.text_content = a2t_response['text'];

        // audio_url
        this.audioMsg.audio_url = window.URL.createObjectURL(this.audioMsg.content)
        

        this.msgArr.push(this.audioMsg);
        
        // ask the question
        // get audio return
        let buf_response = await api.getAudioMsgResponse({
          "question": this.audioMsg.text_content
        });

        this.audioMsg = {
          timestamp: 0,
          datetime: "",
          content: null,
          content_type: 1,
          sender_type: 0,
          duration: 0,
          text_content: "",
          audio_url: "",
        };

        var audio_blob = new Blob(
          [buf_response], 
        ); 

        let response = {
          timestamp: new Date().getTime(),
          datetime: "",
          content: null,
          content_type: 1,
          sender_type: 1,
          duration: 0,
          text_content: "",
          audio_url: window.URL.createObjectURL(audio_blob),
        };
        response.content = audio_blob;
        response.duration = audio_blob.size/32000;
        response.datetime = parseTime(response.timestamp);
        this.msgArr.push(response)
      }
    },
    switchInput(){
      this.is_text = !this.is_text;
      this.is_audio = !this.is_audio;
    },
  },
  mounted(){
    navigator.mediaDevices.getUserMedia({ audio: true }); 
    let recorder = new Recorder({
      sampleBits: 16,         // 采样位数，支持 8 或 16，默认是16
      sampleRate: 16000,      // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
      numChannels: 1,         // 声道，支持 1 或 2， 默认是1
      compiling: false,       // 是否边录边转换，默认是false
    });
    this.recorderObj = recorder;
  },
  updated(){
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
  bottom: 1%;
  width: 95%;
  position: inherit;
}

.audioInputMsg{
  bottom: 1%;
  left: 70%;
  right: 5%;
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
  position:absolute;
  right: 3%;
  bottom: 1%;
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



</style>


