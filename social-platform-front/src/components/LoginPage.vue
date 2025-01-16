<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Button from "primevue/button";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import apiClient from "@/axios";
import { useToast } from "primevue/usetoast";

const username = ref("");
const password = ref("");
const password_register = ref("");
const repeat_password = ref("");
const email = ref("");
const router = useRouter();

const toast = useToast();

const showErrorToast = (message) => {
  toast.add({ severity: "error", summary: "Błąd!", detail: message, life: 3000 });
};

const showSuccessToast = (message) => {
  toast.add({ severity: "success", summary: "Sukces!", detail: message, life: 3000 });
};

const login = async () => {
  try {
    const response = await apiClient.post("/auth/login", {
      username: username.value,
      password: password.value,
    });
    localStorage.setItem("token", response.data.token);
    router.push("/home");
    showSuccessToast("Zalogowano pomyślnie!");
  } catch (error) {
    console.log("Błąd logowania:", error);
    showErrorToast(error.response.data.message);
  }
};

const register = async () => {
  if (password_register.value !== repeat_password.value) {
    showErrorToast("Hasła różnią się od siebie");
    return;
  }

  try {
    const response = await apiClient.post("/auth/register", {
      username: username.value,
      email: email.value,
      password: password_register.value,
    });
    localStorage.setItem("token", response.data.token);
    router.push("/home");
    showSuccessToast("Pomyślnie założono Twoje konto!");
  } catch (error) {
    console.log("Błąd rejestracji:", error);
    showErrorToast(error.response.data.message);
  }
};
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="p-8 rounded-lg bg-white shadow-md text-center">
      <div class="flex flex-col justify-center items-center mb-8">
        <h1 class="text-xl font-bold text-gray-800 mb-2">KTO PYTAŁ?</h1>
        <img class="w-20 h-20" src="../assets/logo_ktopytal_okrag.png" alt="Logo" />
      </div>
      <TabView>
        <TabPanel header="Zaloguj się">
          <h2 class="text-2xl font-bold text-gray-700 mb-4">ZALOGUJ SIĘ</h2>
          <div class="mb-4">
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-user"></i>
              </InputGroupAddon>
              <InputText placeholder="Nazwa użytkownika" v-model="username" :maxlength=50 />
            </InputGroup>
          </div>

          <div class="mb-4">
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-lock"></i>
              </InputGroupAddon>
              <InputText placeholder="Hasło" v-model="password" :maxlength=255 type="password" />
            </InputGroup>
          </div>

          <Button label="Zaloguj" @click="login" class="p-button-primary" />
          <div class="mt-4">
            <router-link to="/request-reset-password" target="_blank" rel="noopener">
              <Button label="Nie pamiętasz hasła?" link />
            </router-link>
          </div>
        </TabPanel>
        <TabPanel header="Zarejestruj się">
          <h2 class="text-2xl font-bold text-gray-700 mb-4">ZAREJESTRUJ SIĘ</h2>

          <div class="mb-4">
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-user"></i>
              </InputGroupAddon>
              <InputText placeholder="Nazwa użytkownika" v-model="username" :maxlength=50 />
            </InputGroup>
          </div>

          <div class="mb-4">
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-envelope"></i>
              </InputGroupAddon>
              <InputText placeholder="Adres E-Mail" v-model="email" :maxlength=100 />
            </InputGroup>
          </div>

          <div class="mb-4">
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-lock"></i>
              </InputGroupAddon>
              <InputText placeholder="Hasło" v-model="password_register" :maxlength=255 type="password" />
            </InputGroup>
          </div>

          <div class="mb-4">
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-lock"></i>
              </InputGroupAddon>
              <InputText placeholder="Powtórz Hasło" v-model="repeat_password" :maxlength=255 type="password" />
            </InputGroup>
          </div>

          <Button label="Zarejestruj" @click="register" class="p-button-primary" />
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<style scoped></style>
