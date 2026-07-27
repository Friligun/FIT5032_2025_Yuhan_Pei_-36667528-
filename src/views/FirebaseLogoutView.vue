<template>
  <div class="container mt-5">
    <h1>Log Out</h1>
    <p>You are currently logged in as: <strong>{{ currentEmail }}</strong></p>
    <p><button @click="signout">Sign Out</button></p>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();
const currentEmail = ref(auth.currentUser ? auth.currentUser.email : "No user signed in");
const message = ref("");

console.log("Current User:", auth.currentUser);

const signout = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out successfully");
      message.value = "You have been signed out.";
      currentEmail.value = "No user signed in";
    })
    .catch((error) => {
      console.log(error.code);
    });
};
</script>
