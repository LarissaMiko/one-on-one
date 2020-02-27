<template>
  <div class="home">
    <div v-if="session_status == 'none'" class="row p-2 bg-black align-items-center text-white">
      <h1 class="col-5 m-1 p-2 title">One-on-One Chat</h1>
      <div class="col-5 m-1 p-2 rounded bg-black text-dark">
    </div>
  </div>
  <div class="container-fluid text-white">
    <div v-if="session_status != 'none'">
      <Timer 
      :session_status="session_status" 
      v-on:update:session_status="session_status = $event"
      :round_status="round_status"
      v-on:update:round_status="round_status = $event"
      :session="session"
      v-on:nextChatroom="this.nextChatroom"
      v-on:deleteAndFindNextSession ="this.deleteAndFindNextSession"></Timer>
    </div>
    <div class="row banner bg-white text-dark p-5">
      <div class="container content">
        <h3 class="mb-5">Welcome to the One-on-One Chat {{user.firstname}}! </h3>
        <p v-if="session_status == 'upcoming'">There is a chat-session coming up for you soon!</p>
        <p v-if="session_status == 'expired'">Your chat-session is over</p>
        <p v-if="session_status == 'none'">There is no chat-session coming up for you at the moment</p>
        <MessageContainer v-if="session_status == 'running'" 
        :round_status="round_status"
        :partner="partner"
        v-bind:messages="messages" 
        v-on:sendMessage="this.sendMessage"
        v-on:showContact="this.showOwnContact"
        :user="user.id"
        />
      </div>
      </div> 
    </div>
    <footer class="footer-content pt-3 pb-3">
        <div class="footer-text text-center bg-black">
            PWP-Conference-Tool - One-on-One Chat
        </div>
    </footer>
  </div>
</template>

<script>
import settings from "../../settings";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import axios from 'axios';
import moment from 'moment';
import Vue from 'vue';

import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

const userUrl = `${settings.ApiUrl}/user`;
const sessionUrl = `${settings.ApiUrl}/session`;
export default {
  name: 'home',
  components:{

    Timer: () => import("@/components/Timer.vue"),
    MessageContainer: () => import("@/components/MessageContainer.vue")
  },
  props: {
    user_id:{
      type: String,
      default: ''
    },
  },
  data(){
    return{
      showMessageInfo: "",
      session: {
        event_id: "",
        startDate: "",
        endDate: "",
        rounds: 0,
        round: 0,
        matches:[],
        participants: []
      },
      session_status: 'none',
      round_status: '',
      user: {
        id: "",
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        organisation: "",
        country: "",
        fieldOfActivity: "",
        researchInterest: [],
        upcoming: [],
      },
      messages: [],
      partner: {
        id: "",
        firstname: "",
        lastname: "",
        email: "",
        organisation: "",
        country: "",
        fieldOfActivity: "",
        researchInterest: [],
        pause: false,
        contactVisible: false
      }
    }
  },
  async created(){
  /*var user = this.$cookies.get("user");
  //post user-information to database
    await axios.post(`${settings.ApiUrl}/newuser`, {
        "user_id" : user.id,
        "title" : user.title,
        "gender" : user.gender,
        "username" : user.username,
        "firstname" : user.firstname,
        "lastname" : user.lastname,
        "email" : user.email,
        "organisation" : user.organisation,
        "country" : user.country,
        "fieldOfActivity" : user.fieldOfActivity,
        "researchInterest" : user.researchInterest,
      })*/
    //retrieve user-information from database
    await this.getUser();
    //find next chatSession of user
    await this.getNextSession();
    //find chatStatus of next ChatSession
    await this.getSessionStatus();
    
  },
  watch: {
      session_status: function(val) {
          //connect to chat if session_status is changed by Timer
          if (val == "running") {
              this.calcRound();
              this.calcRoundStatus();
              this.getPartner();
              this.socket = settings.socket;
              this.socket.emit('newuser', this.user.id)
              this.listen();
          }
      }
      
  },
  methods:{
    //determine session_status of next upcoming session
    getSessionStatus: function(){
      var now = moment();
      var start = moment(this.session.startDate);
      var end = moment(this.session.endDate);

      if(moment(now).isBetween(start , end)){
        this.session_status = "running";
      }
      else if (moment(now).isBefore(start)){
        this.session_status = "upcoming";
      }
      else if (moment(now).isAfter(end)){
        this.session_status = "expired";
      }

    },
    //GET userinformation from API
    getUser: async function(){
    const res = await axios.get(`${userUrl}/${this.user_id}`);
    if(res == "none"){
      this.user.upcoming = "none";
      this.user.session_status="none"
    } else {
      this.user.id = res.data.user_id;
      this.user.username = res.data.username;
      this.user.firstname = res.data.firstname;
      this.user.lastname = res.data.lastname;
      this.user.email = res.data.email;
      this.user.organisation = res.data.organisation;
      this.user.fieldOfActivity = res.data.fieldOfActivity;
      this.user.researchInterest = res.data.researchInterest;
      this.user.upcoming = res.data.upcoming;
    }
    },
    //Go through all sessions of the user and determine next one
    getNextSession: async function(){
      let startDate = moment.utc("2050-12-25");
      let endDate;
      let rounds;
      let matches;
      let event_id;
      let participants;
      /*eslint-disable no-console*/
      console.log(this.user.upcoming.length == 0 )
      if(this.user.upcoming.length == 0){
        this.session_status = 'none';
      } else {
        for (const session of this.user.upcoming){
          const res = await axios.get(`${sessionUrl}/${session}`);
          let date = moment.utc(res.data.startDate);
          if(moment(date).isBefore(startDate)){
            startDate = res.data.startDate;
            endDate = res.data.endDate;
            rounds = res.data.rounds;
            matches = res.data.matches;
            event_id = res.data.event_id;
            participants = res.data.participants;
          }
      } 
        this.session.event_id = event_id;
        this.session.startDate = startDate;
        this.session.endDate = endDate;
        this.session.rounds = rounds;
        this.session.matches = matches;
        this.session.participants = participants;
      }
    },
    // Calculate round of a running chatsession
    calcRound: function(){
            let start = moment(this.session.startDate);
            let now = moment();
            //time since chat start
            let passTime = now.diff(start , 'seconds');
            this.session.round = Math.floor(passTime / 180);
            if(this.session.round >= this.session.rounds){
              this.deleteAndFindNextSession();
            }
        },
    // Calculate status of current round in chatsession
    calcRoundStatus: function(){
          let now = moment();
          let start = moment(this.session.startDate);
          //time since chat start
          let passTime = now.diff(start , 'seconds');
          //time since roundstart
          let chatProgress = passTime % 180;
          if(chatProgress <= 30){
              this.round_status = "interest"
          }
          else if(chatProgress <= 150){
              this.round_status = "chat"
          }
          else if(chatProgress <= 180){
              this.round_status = "contact"
          } 
      },
    getPartner() {
      let currentMatch = this.session.matches[this.session.round]
      let currentIndex = this.getIndexOf(currentMatch , this.user.id);
        if(currentMatch[currentIndex][0] == this.user.id){
          this.partner.id = currentMatch[currentIndex][1]
        } else{
          this.partner.id = currentMatch[currentIndex][0]
        }
        if(this.partner.id != 0){
          this.partner.pause = false;
          this.getPartnerInterests();
        } else {
          this.partner.pause = true;
        } 
      },
    getPartnerInterests: async function(){
      const res = await axios.get(`${userUrl}/${this.partner.id}`);     
      this.partner.researchInterest = res.data.researchInterest;
    },
    getPartnerContact: async function() {
      const res = await axios.get(`${userUrl}/${this.partner.id}`);
      this.partner.firstname = res.data.firstname;
      this.partner.lastname = res.data.lastname;
      this.partner.email = res.data.email;
      this.partner.organisation = res.data.organisation;
      this.partner.fieldOfActivity = res.data.fieldOfActivity;
    },
    // socket-functions
    listen: function() {
      this.socket.on('loggedIn', messages => {
        for(let message of messages){
          if(message.user == this.user.id || message.user == this.partner.id){
           this.messages.push(message);
        }
        }
      })
      this.socket.on('new_message', message => {
        if(message.user == this.user.id || message.user == this.partner.id){
           this.messages.push(message);
        }
      }),
      this.socket.on('showContact', user => {
        if(user == this.partner.id){
          this.partner.contactVisible = true;
          this.getPartnerContact();
        }
      })
    },
    sendMessage: function(message){
      this.socket.emit('message', message);

    },
    
    showOwnContact: function(){
      this.socket.emit('showContact' , this.user.id);
    },
    nextChatroom: function(){
      this.session.round++;
      //check if session is over and if so set session_status to expired and find next session
      if(this.session.round >= this.session.rounds){
        this.session_status = "expired";
        this.deleteAndFindNextSession();
      } else {
        //GET info about next chatpartner
      this.messages = [];
      this.partner = {};
      this.getPartner();
      this.socket.emit('nextRound')
      }
    },
    deleteAndFindNextSession: function(){
      axios.delete(`${sessionUrl}/${this.session.event_id}`);
      this.getNextSession();
    },
    getIndexOf(array, element) {
      for (let i = 0; i < array.length; i++) {
          var index = array[i].indexOf(element);
          if (index > -1) {
              return i;
          }
      }
  }
  }
}
</script>

<style lang="scss" scoped>
  .banner{
    min-height: 500px;
  }
  footer{
    bottom: 0px;
    left: 0px;
    right: 0px;
    position: fixed;
    background-color: black;
    height: 55px;

    .footer-text{
      color: white;
    }
  }
</style>

