<template>
<div class="row p-2 bg-black align-items-center text-white">
      <h1 class="col-5 m-1 p-2 title">One-on-One Chat</h1>
      <div class="col-5 m-1 p-2 rounded bg-black text-dark">
        <div class="timer">
            <div class="start container-fluid text-white">
                <div class="row banner bg-black text-dark p-5">
                    <div class="container">
                        <div class="upcomingevent" v-if="session_status=='upcoming'">
                            <div class="statusmessage">{{ statusmessage }}</div>
                            <div class="time bg-black upcomingEventTime">
                                <div class="day">
                                <span class="number card">{{ days }} Days
                                </span>
                                </div>
                                <div class="hour card">
                                <span class="number">{{ hours }} Hours</span>
                                </div>
                                <div class="min card">
                                <span class="number">{{ minutes }} Minutes</span>
                                </div>
                                <div class="sec card">
                                <span class="number">{{ seconds }} Seconds</span>
                                </div>
                            </div>
                        </div>
                        <div class="runningevent" v-if="session_status=='running'">
                            <progress style="width: 100%; display: none;" value="0" max="30" id="progressBarInterests"></progress>
                            <progress style="width: 100%; display: none;" value="0" max="120" id="progressBarChat"></progress>
                            <progress style="width: 100%; display: none;" value="0" max="30" id="progressBarContact"></progress>
                            <p class="p-0 m-0 statusmessage">{{ statusmessage }}</p>
                            <div class="time">
                            <p class="countdown">{{seconds}} Seconds</p>
                            </div> 
                        </div>    
                        <div class="expiredevent" style="margin-top: 20px; font-size: 20px; " v-if="session_status=='expired'">
                        <p class="time">Your chat is over</p>
                        <div
                            class="progress-bar bg-danger"
                            role="progressbar"
                            style="width: 100%"
                            aria-valuenow="100"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap-vue/dist/bootstrap-vue.css';
import moment from 'moment';
const messageList = "messages";

export default {
name: 'Timer',
props: {
    session: {
        type: Object,
      default: () => {}
    },
    session_status:{
        type: String,
        default: "",
        required: true
    },
    round_status:{
        type: String,
        default: ""
    }
  },

components:{
},
data(){
    return{
        start: "",
        end: "",
        round: 0,
        rounds: "",
        interval: "",
        days:"",
        minutes:"",
        hours:"",
        seconds:"",
        statusmessage:"",
        statusText: "",
        intervalpercent: 100,
        interestTime: 0,
        chatTime: 0,
        contactTime: 0,
        };    
    },
    mounted() {

        //Update the countdown every second        
            this.interval = setInterval(() => {
            this.timerCount();
            this.scrollToBottom(messageList);

        }, 1000);

           
    },
    methods: { 
        /**scrolls down to bottom of div -> to latest message**/
        scrollToBottom(massageElement) {
            if(document.getElementById(massageElement)) {
                let msgEl = document.getElementById(massageElement);
                msgEl.scrollTo({
                top: msgEl.scrollHeight,
                left: 0,
                behavior: 'smooth'
                });
            }
        },

        timerCount: function(){

            this.end = moment(this.$props.session.endDate);
            this.start = moment(this.$props.session.startDate);
            let now = moment();
            let distance = this.end.diff(now , 'seconds');
            let passTime =  this.start.diff(now , 'seconds');
            let roundTime = now.diff(this.start , 'seconds');
            let chatProgress = (roundTime % 180)+1;

            // countdown for upcoming chatsession
            if( distance > 0 && passTime > 0){
                if(this.$props.session_status != "upcoming"){
                    this.$emit('update:session_status', "upcoming");
                }

            //this.seconds = passTime;
            this.statusmessage = "Your next chats start in";
            this.calcTime(passTime);
            }
            // coordinate timing during running chatsession
            else if(distance >0 && passTime < 0 || this.$props.session.round < this.$props.session.rounds){
                if(this.$props.session_status != "running"){
                    this.$emit('update:session_status', "running");
                    this.$emit('update:round_status', "interest");
                }
                if(this.$props.round_status == "interest"){

                    this.statusmessage = "You can read the interests for";
                    this.interestTime = chatProgress;
                    document.getElementById("progressBarInterests").style.display = "block";
                    document.getElementById("progressBarContact").style.display = "none";
                    document.getElementById("progressBarChat").style.display = "none";

                 
                 if(this.interestTime > 0){

                        this.seconds = 30 - this.interestTime;
                        document.getElementById("progressBarInterests").value = 30 -this.interestTime;
                    }
                    if(this.interestTime >= 30){
                        this.$emit('update:round_status', "chat");
                    }
                }
                else if(this.$props.round_status=="chat"){

                    this.statusmessage = "You have time to chat for";
                    this.chatTime = chatProgress - 30;
                    document.getElementById("progressBarChat").style.display = "block";
                    document.getElementById("progressBarInterests").style.display = "none";
                    document.getElementById("progressBarContact").style.display = "none";

                    if(this.chatTime > 0){
                        this.seconds = 120 - this.chatTime;
                        document.getElementById("progressBarChat").value = 120 - this.chatTime;
                    }
                    if(this.chatTime >= 120){
                        this.$emit('update:round_status', "contact");
                    }

                }
                else if(this.$props.round_status=="contact"){

                    this.statusmessage = "You have time to exchange contact for";
                    this.contactTime = chatProgress - 150;

                    document.getElementById("progressBarContact").style.display = "block";
                    document.getElementById("progressBarInterests").style.display = "none";
                    document.getElementById("progressBarChat").style.display = "none";

                   if(this.contactTime > 0){
                        this.seconds = 30 - this.contactTime
                        document.getElementById("progressBarContact").value = 30 - this.contactTime;
                    }
                    if(this.contactTime >= 30){
                        if(this.$props.session.round == this.$props.session.rounds){
                            this.$emit('update:session_status', "expired");
                            this.$emit('deleteAndFindNextSession');

                        } else {
                            this.$emit('nextChatroom');
                            this.$emit('update:round_status', "interest");
                        }
                    }

                }
            }
            // show if chat-session is over
            else if(distance < 0 && passTime < 0 || this.$props.session.round >= this.$props.session.rounds){
                if(this.$props.session_status != "expired"){
                    this.$emit('update:session_status', "expired");
                }
                this.statusmessage = "Chat ist over";
            }
        },
        calcTime: function(time){
        // Time calculations for days, hours, minutes and seconds
            this.days = Math.floor(time / (3600 * 24));
            this.hours = Math.floor((time / 3600) % 24);
            this.minutes = Math.floor((time / 60) % 60);
            this.seconds = time % 60;
        }      
    },
}
</script>
<style scoped>
.bg-black{
    background-color: black;
}
button{
    margin-right: 20px;
}
.wholeProgressbar{
    border-style: solid;
}
.upcomingEventTime{
    border-style: solid;
}
.statusmessage{
    color: white;
    padding-top: 20px !important;
}
.time{
    color: white;
    background-color: black;
    border: none;
}
.card{
    background-color: black;
}
button{
    margin-right: 5px !important;
    margin-left: 5px !important;
    background-color: black;
}

</style>