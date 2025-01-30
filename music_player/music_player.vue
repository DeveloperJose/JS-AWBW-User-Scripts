<template>
    <div>
        <h1>{{ message }}</h1>
        <button @click="changeMessage">Change Message</button>
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            message: "Hello!"
        };
    },
    methods: {
        changeMessage() {
            this.message = "Message Changed!";
        }
    }
}
</script>