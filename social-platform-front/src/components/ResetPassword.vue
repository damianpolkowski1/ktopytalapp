<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import apiClient from "@/axios";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const token = route.query.token || "";
const newPassword = ref("");
const confirmPassword = ref("");

const showErrorToast = (message) => {
    toast.add({ severity: "error", summary: "Błąd!", detail: message, life: 3000 });
};

const showSuccessToast = (message) => {
    toast.add({ severity: "success", summary: "Sukces!", detail: message, life: 3000 });
};

const resetPassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
        showErrorToast("Podane hasła nie są takie same.");
        return;
    }

    if (!token) {
        showErrorToast("Brak tokena resetowania hasła.");
        return;
    }

    if (newPassword.value.length < 4 || confirmPassword.value.length < 4) {
        showErrorToast("Hasło powinno zawierać minimum 4 znaki.");
        return;
    }

    try {
        const response = await apiClient.post("/auth/reset-password", {
            token: token,
            newPassword: newPassword.value,
        });
        showSuccessToast(response.data.message || "Hasło zostało zresetowane pomyślnie.");
        router.push({ name: "Login" });
    } catch (error) {
        console.log("Błąd resetowania hasła:", error);
        showErrorToast(error.response?.data?.message || "Wystąpił błąd podczas resetowania hasła.");
    }
};
</script>

<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
        <div class="p-8 rounded-lg bg-white shadow-md max-w-md w-full">
            <div class="flex flex-col justify-center items-center mb-6">
                <h1 class="text-xl font-bold text-gray-800 mb-2">Resetuj Hasło</h1>
                <img class="w-20 h-20" src="../assets/logo_ktopytal_okrag.png" alt="Logo" @click="router.push('/')" />
            </div>
            <div class="mb-4">
                <label for="newPassword" class="block text-gray-700 mb-1">Nowe Hasło</label>
                <InputText id="newPassword" type="password" v-model="newPassword" class="w-full" />
            </div>
            <div class="mb-4">
                <label for="confirmPassword" class="block text-gray-700 mb-1">Powtórz Hasło</label>
                <InputText id="confirmPassword" type="password" v-model="confirmPassword" class="w-full" />
            </div>
            <Button label="Zresetuj Hasło" @click="resetPassword" class="p-button-primary w-full" />
        </div>
    </div>
</template>

<style scoped></style>
