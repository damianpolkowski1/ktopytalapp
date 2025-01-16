<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
            <div v-if="loading" class="flex flex-col items-center">
                <svg class="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-gray-700">Weryfikowanie...</p>
            </div>
            <div v-else>
                <p class="text-center text-green-500">Weryfikacja zakończona sukcesem. Przekierowywanie do logowania...
                </p>
            </div>
        </div>
        <Toast />
    </div>
</template>

<script>
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

export default {
    name: 'VerifyEmail',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const toast = useToast();
        const loading = ref(true);

        const showErrorToast = (message) => {
            toast.add({ severity: "error", summary: "Błąd!", detail: message, life: 3000 });
        };
        const showSuccessToast = (message) => {
            toast.add({ severity: "success", summary: "Sukces!", detail: message, life: 3000 });
        };

        const verifyEmail = async () => {
            const token = route.query.token;

            if (!token) {
                showErrorToast('Brak tokena weryfikacyjnego.');
                router.push({ name: 'Login' });
                return;
            }

            try {
                const response = await axios.get('http://localhost:6868/auth/verify', {
                    params: { token },
                });

                if (response.status === 200) {
                    showSuccessToast('Weryfikacja zakończona sukcesem.');
                }

                if (response.status === 400) {
                    showErrorToast('Nieprawidłowy lub wygasły token weryfikacyjny.');
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    showErrorToast('Nieprawidłowy lub wygasły token weryfikacyjny.');
                } else {
                    showErrorToast('Wystąpił błąd podczas weryfikacji.');
                }
            } finally {
                loading.value = false;
                setTimeout(() => {
                    router.push({ name: 'Home' });
                }, 3000);
            }
        };

        verifyEmail();

        return {
            loading,
        };
    },
};
</script>