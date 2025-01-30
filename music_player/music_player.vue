<template>
  <div>
    <h1>{{ message }}</h1>
    <!-- <button @click="changeMessage">Change Message</button> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);

export default Vue.extend({
  name: "MusicPlayer",
  data() {
    return {
      message: "Hello",
    };
  },
});
</script>
