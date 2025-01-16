<script setup>
import Header from "./Header.vue";
import MainFeed from "./MainFeed.vue";
import Sidebar from "./Sidebar.vue";
import Button from "primevue/button";
import AddPostPopup from "./AddPostPopup.vue";
import { jwtDecode } from "jwt-decode";
import { onMounted, ref } from "vue";
import { waitForToken } from "../utils/token";
import { useRoute } from "vue-router";

const route = useRoute();
const feedTab = ref(route.query.feedTab || "dla-ciebie");

const token = ref("");
const mainFeed = ref(null);

const changeFeed = (newTab) => {
  feedTab.value = newTab;
};

onMounted(async () => {
  try {
    const tokenToDecode = await waitForToken();
    token.value = jwtDecode(tokenToDecode);
  } catch (error) {
    console.error("Błąd ładowania tokena:", error);
    window.location.href = "/";
  }
});

const isAddPostDialogVisible = ref(false);

const openAddPostDialog = () => {
  isAddPostDialogVisible.value = true;
};

const closeAddPostDialog = async () => {
  isAddPostDialogVisible.value = false;

  if (mainFeed.value?.loadFeedData) {
    await mainFeed.value.loadFeedData();
  }
};
</script>

<template>
  <div class="flex flex-col items-center h-screen">
    <Header v-if="token" :userId="token.userId" :feedTab="feedTab" @changeFeed="changeFeed" />
    <div class="flex w-[90%]">
      <div class="flex-grow">
        <div class="flex items-center gap-4 mx-1 mb-2">
          <h1 v-if="token" class="p-2">Witaj, {{ token.nickname }}</h1>
          <Button label="Napisz coś" icon="pi pi-plus" outlined @click="openAddPostDialog" />
          <AddPostPopup
            v-if="isAddPostDialogVisible"
            @close="closeAddPostDialog"
            :userId="token.userId"
          />
          <br /><br />
        </div>
        <MainFeed ref="mainFeed" v-if="token" :userId="token.userId" :feedTab="feedTab" />
      </div>
      <div class="w-[30%]">
        <Sidebar v-if="token" :userId="token.userId" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
