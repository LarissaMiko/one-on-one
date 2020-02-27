<template>
  <div class="container-fluid">
    <div class="row start-screen">
      <div class="col-md-6 col-12 bg-black">
          <h1 class="middle-of-screen text-center text-white font-weight-bold mb-3">PWP-Conference-Tool</h1>
          <h2 class="text-center text-white">One-on-One Chat</h2>
      </div>
      <div class="col-md-6 col-12">
          <div class="middle-of-screen">
            <h5 class="mb-5">Checkout if there is a One-on-One Session coming up for you:</h5>
          <form class="form-inline justify-content-center">
            <div class="form-group ml-3">
              <input name="userID" type="text" v-model="user_id" class="FormField__Input" placeholder="user ID">
            </div>
            <button type="submit" class="form-button ml-3 pl-5 pr-5" @click.stop.prevent="submit()">send</button>
          </form>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.css';
  import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: "start",
  components: {

  },
  props: {
      user_id: {
      type: String,
      default: ''
    }
  },
  created(){
    var token = this.$cookies.get("token")
    var user = this.$cookies.get("user")
    /* eslint-disable no-console */
    console.log(token)
    console.log(user)
  },
  mounted(){

  },
  methods: {
    submit(){
      this.$router.push(`/${this.user_id}`)
    }
  }
}
</script>

<style lang="scss">
  html {
    height: 100vh;
  }

  @media (min-width:768px) {  
    .start-screen {
      height: 100vh;
    }
    .middle-of-screen{
      padding-top: 40%;
    }
  }
  @media (max-width:767px) {
    .start-screen {
      height: 100vh;
    }
    .bg-black{
      height: 50%;
      padding-top: 10%;
    }
    .middle-of-screen{
      padding-top: 0%;
    }
  }
  


  .bg-black{
    background-color: black;
  }    
  
  
  .banner{
      align-items: center;
  }
  form{
      align-items: center;
  }
  form > .form-group {
      flex: 1;
  }
  
  .form-button {
    background-color: #000;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
    text-transform: uppercase;
    height: 50px;
    font-size: .9em;
    font-weight: bold;
  }

  button:hover{
    background-color: #fff;
    color: #000;
    border: 3px solid #000;
  }
  .FormField__Input {
    width: 85%;
    background-color: transparent;
    border: none;
    color: #000;
    outline: none;
    border-bottom: 1px solid #000;
    font-size: 1em;
    font-weight: 300;
    padding-bottom: 10px;
    margin-top: 10px;
  }


</style>

