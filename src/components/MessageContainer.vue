<template>
<div>
    <div class="partnerBreak" v-if="partner.pause == true">
        <p>Time for a coffee - your next partner is currently in another chat</p>
    </div>
    <div class="noPartnerBreak" v-if="partner.pause == false">
        <div v-if="round_status == 'chat'" class="chat-window">
            <div class="messages" id="messages">
                <div class="message" v-for="message in messages" v-bind:key="message.index" v-chat-scroll>
                    <div v-if="message.user !== user" class="firstletter"><i class="fas fa-question"></i></div>
                    <div v-bind:class="[(message.user == user) ? 'own-text' : 'partner-text']">{{message.msg}}</div>
                    <div v-if="message.user == user" class="firstletter"><i class="user-icon fas fa-user"></i></div>
                </div>
            </div>
            <form class="input-container" v-on:submit="sendMessage">
                <input type="text" v-model="msg">
                <button class="send-button" v-on:click="sendMessage" v-bind:disabled="!msg"><i class="fas fa-paper-plane send-icon"></i></button>
            </form>
        </div>
        <div class="row">
            <div class="col-4 m-1 p-2"></div>
            <div v-if="round_status == 'interest'" class="col-4 m-1 p-2 interestInfo">
            <p ><b>Your chatpartner has following interests:</b></p>
            <ul>
                    <li v-for="(interest, index) in this.$props.partner.researchInterest" :key="`interest-${index}`">
                        {{ interest }}
                    </li>
            </ul>
            </div>
            <div class="col-4 m-1 p-2"></div>
        </div>
        <div class="row">
            <div class="col-4 m-1 p-2"></div>
        <div v-if="round_status == 'contact'" class="col-4 m-1 p-2 contactInfo">
                <div id="buttons" class="contactquestion">
                    <p>Do you want to send your contact details to your chat partner?</p>
                    <button v-on:click="this.showContact" class="btn btn-primary">Yes</button>
                    <button v-on:click="this.notShowContact" class="btn btn-primary">No</button>
            </div>
            <div style="display:none;" class="showContacts" id="showContacts">
                <div class="contactTrue" v-if="partner.contactVisible == true">
                    <p><b>Here are the contact details of your chatpartner:</b></p>
                    <ul>
                        <li>Firstname: {{partner.firstname}}</li>
                        <li>Lastname: {{partner.lastname}}</li>
                        <li>E-mail: {{partner.email}}</li>
                        <li>Country: {{partner.country}}</li>
                        <li>Field of Activity: {{partner.fieldOfActivity}}</li>
                    </ul>
                </div>
                <div class="contactFalse" v-if="partner.contactVisible == false">
                    <p><b>See you at the next chat!</b></p>
                </div>
            </div>
        </div>
        <div class="col-4 m-1 p-2"></div>
        </div>
    </div>
</div>
</template>

<script>
//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
    name: "messagecontainer",
    props: {
        messages:{
            type: Array,
            default: () => []
        }, 
        user:{
            type: String,
            default: ''
        },
        round_status:{
            type: String,
            default: ''
        },
        partner:{
            type: Object,
            default: () => {}
        }
    },
    

    data: function(){
        return{
            msg: "",
            firstname: "",
            lastname:"",
            email:"",
            user_interests: ""
        }
    },
    async created(){
        
    },
    methods: {

        notShowContact:function(){
            document.getElementById("showContacts").style.display = "block";
            document.getElementById("buttons").style.display = "none";

        },
        showContact: function(){
          this.$emit('showContact', this.user)
            document.getElementById("showContacts").style.display = "block";
            document.getElementById("buttons").style.display = "none";

        },
       sendMessage: function () {
            this.$emit('sendMessage', 
            {
                msg: this.msg,
                user: this.user
            });
            this.msg = "";
        //    this.scrollToBottom(messageList);
        },
          

    }
}
</script>

<style lang="scss" scoped>
    ul{
        list-style-type: none;
       margin:0px;
        padding: 0px !important;
    }
    .interestInfo, .contactInfo{
       border-style: solid;
 
    }
    button{
    background-color: #000;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
    text-transform: uppercase;
    width: 120px;
    height: 50px;
    font-size: .9em;
    font-weight: bold;
    border-color: black;
    margin-right: 5px;
    margin-left: 5px;

}
  button:hover{
    background-color: #fff;
    color: #000;
    border: 3px solid #000;
  }

    .chat-window {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: #F9F9F9;
        box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.15);
        .messages {
            //flex: 1;
            overflow: scroll;
            height: 380px;
            .message {
                display: flex;
                border-bottom: 1px solid #EFEFEF;
                padding: 10px;
                &:last-of-type {
                    border-bottom: none;
                    
                }
                .user-icon{
                    color: white;
                }
                .username {
                    width: 100px;
                    margin-right: 15px;
                }
                .firstletter{
                    border: none;
                    border-radius: 100%;
                    overflow: hidden;
                    min-width: 40px;
                    height: 40px;
                    background-color: #000;
                    color: #fff;
                    padding: 7px;
                    font-size: 18px;
                    font-style: normal;
                    font-weight: 700;
                    }
                .partner-text {
                    flex: 1;
                     float: left;
                    border-radius: .35em;
                    padding: 0.5em 1em;
                    background-color: white;
                    margin: 0 2px 0 15px;
                    border: none;
                    box-shadow: 0 3px 7px #d3d3d3;
                    width: 100%;
                    text-align: left;
                    color: black;
                    cursor: pointer;
                }
                .partner-text:before {
                    background-color: white;
                    width: 15px;
                    height: 15px;
                    -webkit-transform: rotate(45deg);
                    transform: rotate(45deg);
                    display: inline-block;
                    content: "";
                    position: relative;
                   // top: 12px;
                    left: -23px;

                }
                .own-text{
                    flex: 1;
                    float: right;
                    border-radius: .35em;
                    padding: 0.5em 1em;
                    background-color: #eaeaea;
                    margin: 0 15px 0 2px;
                    border: none;
                    box-shadow: 0 3px 7px #d3d3d3;
                    width: 100%;
                    text-align: right;
                    color: black;
                    cursor: pointer;
                }
                .own-text:after {
                    background-color:#eaeaea;
                    width: 15px;
                    height: 15px;
                    -webkit-transform: rotate(45deg);
                    transform: rotate(45deg);
                    display: inline-block;
                    content: "";
                    position: relative;
                   // top: 12px;
                    left: 23px;
                }
        }}
	.input-container {
		display: flex;
		input {
			flex: 1;
			height: 50px;
			font-size: 18px;
			box-sizing: border-box;
            border-radius: 4px;
		}
		button {
            background-color: black;
            display: inline-block;
            width: 50px;
            height: 50px;
            border-radius: 50%;
		}
        .send-icon{
        color: white;
        }
	}
}
</style> 