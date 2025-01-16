<script setup>
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { logout } from "@/utils/login";
import { ref, h, onMounted } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import apiClient from "@/axios";
import AutoComplete from "primevue/autocomplete";
import Avatar from "primevue/avatar";
import { useToast } from "primevue/usetoast";

const emit = defineEmits(["changeFeed"]);

const props = defineProps({
  userId: Number,
  feedTab: String,
});

const route = useRoute();
const toast = useToast();

const changeFeed = (feed) => {
  if (route.name !== "Home") {
    router.push({ name: "Home", query: { feedTab: feed } });
  }

  emit("changeFeed", feed);
};

const menuItems = ref([
  {
    label: "Dla Ciebie",
    icon: "pi pi-home",
    command: () => changeFeed("dla-ciebie"),
    feedKey: "dla-ciebie",
  },
  {
    label: "Odkryj",
    icon: "pi pi-compass",
    command: () => changeFeed("odkryj"),
    feedKey: "odkryj",
  },
  {
    label: "Twoje Posty",
    icon: "pi pi-comment",
    command: () => changeFeed("twoje-posty"),
    feedKey: "twoje-posty",
  },
]);

const isButtonActive = (feedKey) => props.feedTab === feedKey;

const searchQuery = ref("");
const filteredUsers = ref([]);
//let filteredUsers = [];

const navigateToUserProfile = () => {
  router.push({ name: "Profile", params: { id: props.userId } });
};

const search = async (event) => {
  try {
    if (!event.query) {
      const response = await apiClient.get("/users/all");
      filteredUsers.value = response.data;
      filteredUsers.value = filteredUsers.value.filter((user) => user.id !== props.userId);
      return;
    }
    const response = await apiClient.get("/users/search", {
      params: { q: event.query },
    });
    filteredUsers.value = response.data;
    filteredUsers.value = filteredUsers.value.filter((user) => user.id !== props.userId);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Błąd",
      detail: "Wystąpił błąd podczas wyszukiwania użytkowników.",
      life: 3000,
    });
  }
};

const onSelect = () => {
  const user = searchQuery.value;
  if (user && user.id) {
    router.push({ name: "Profile", params: { id: user.id } });
  }
};
</script>

<template>
  <div class="p-4 w-full">
    <Menubar :model="menuItems" class="flex items-center border border-gray-300">
      <template #start>
        <div class="flex items-center mr-8 cursor-pointer" @click="menuItems[0].command">
          <img class="w-16 h-16 mx-4" src="../assets/logo_ktopytal_okrag.png" alt="Logo" />
          <span class="text-lg font-bold text-gray-800">KTO PYTAŁ?</span>
        </div>
      </template>
      <template #item="{ item }">
        <Button
          :label="item.label"
          :icon="item.icon"
          class="menubar-button hidden md:inline-flex"
          @click="item.command"
          :outlined="isButtonActive(item.feedKey)"
          severity="secondary"
          text
        />
      </template>
      <template #end>
        <div class="flex flex-row flex-grow-0">
          <div class="mr-4 flex-row hidden lg:flex xl:flex 2xl:flex">
            <div class="relative w-full flex items-center">
              <AutoComplete
                v-model="searchQuery"
                :suggestions="filteredUsers"
                field="nickname"
                @complete="search"
                placeholder="Szukaj użytkowników..."
                :virtualScrollerOptions="{ itemSize: 42 }"
                dropdown
              >
                <template #option="slotProps">
                  <div class="flex items-center gap-2">
                    <Avatar
                      v-if="slotProps.option.profilePictureId"
                      :image="'http://localhost:6868/images/' + slotProps.option.profilePictureId"
                      shape="circle"
                      size="small"
                    />
                    <Avatar v-else icon="pi pi-user" shape="circle" size="small" />
                    <span class="font-semibold">
                      {{ slotProps.option.nickname }}
                      <i
                        v-if="slotProps.option.IsVerified"
                        class="pi pi-verified text-blue-600 ml-1"
                      ></i>
                    </span>
                  </div>
                </template>
              </AutoComplete>
              <Button icon="pi pi-search" @click="onSelect" class="ml-2" />
            </div>
          </div>
          <div class="flex space-x-4">
            <Button
              label="Twój Profil"
              icon="pi pi-user"
              @click="navigateToUserProfile"
              class="p-button-outlined"
            />
            <Button
              label="Wyloguj się"
              icon="pi pi-sign-out"
              class="p-button-outlined"
              severity="danger"
              @click="logout"
            />
          </div>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<style scoped></style>
