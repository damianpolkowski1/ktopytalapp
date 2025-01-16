<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
        <div class="p-8 rounded-lg bg-white shadow-md max-w-md w-full">
            <div class="flex flex-col justify-center items-center mb-6">
                <h1 class="text-xl font-bold text-gray-800 mb-2">Resetuj Hasło</h1>
                <img class="w-20 h-20" src="../assets/logo_ktopytal_okrag.png" alt="Logo" @click="router.push('/')" />
            </div>
            <p class="mb-4 text-gray-700 text-center">
                Wprowadź swój adres e-mail, aby otrzymać link do resetowania hasła.
            </p>
            <div class="mb-4">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-envelope"></i>
                    </InputGroupAddon>
                    <InputText placeholder="Adres E-Mail" v-model="resetEmail" />
                </InputGroup>
            </div>
            <Button label="Wyślij link resetujący" @click="requestPasswordReset" class="p-button-secondary w-full" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Button from "primevue/button";
import apiClient from "@/axios";
import { useToast } from "primevue/usetoast";

const resetEmail = ref("");
const router = useRouter();
const toast = useToast();

const showErrorToast = (message) => {
    toast.add({ severity: "error", summary: "Błąd!", detail: message, life: 3000 });
};

const showSuccessToast = (message) => {
    toast.add({ severity: "success", summary: "Sukces!", detail: message, life: 3000 });
};

const requestPasswordReset = async () => {
    if (!resetEmail.value) {
        showErrorToast("Proszę podać adres e-mail.");
        return;
    }

    try {
        const response = await apiClient.post("/auth/request-password-reset", {
            email: resetEmail.value,
        });
        showSuccessToast(response.data.message || "E-mail z linkiem resetującym został wysłany.");
        resetEmail.value = "";
        router.push("/");
    } catch (error) {
        console.log("Błąd wysyłki e-maila resetującego:", error);
        showErrorToast(error.response?.data?.message || "Wystąpił błąd podczas wysyłania e-maila resetującego.");
    }
};
</script>

<style scoped></style>