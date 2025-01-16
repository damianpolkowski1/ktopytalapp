<script setup>
import { ref } from "vue";
import Dialog from "primevue/dialog";
import FileUpload from "primevue/fileupload";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { usePrimeVue } from "primevue/config";
import ProgressBar from "primevue/progressbar";
import Badge from "primevue/badge";
import { formatFileSize } from "@/utils/formatText";
import apiClient from "@/axios";

const props = defineProps({
  userId: Number,
});

const emit = defineEmits(["close"]);
const $primevue = usePrimeVue();
const toast = useToast();

const showSuccessToast = (message) => {
  toast.add({
    severity: "success",
    summary: "Sukces!",
    detail: message,
    life: 3000,
  });
};

const showInfoToast = (message) => {
  toast.add({
    severity: "info",
    summary: "Błąd!",
    detail: message,
    life: 3000,
  });
};

const showErrorToast = (message) => {
  toast.add({
    severity: "error",
    summary: "Błąd!",
    detail: message,
    life: 3000,
  });
};

const barProgress = ref(0);
const files = ref([]);
const filesPending = ref(false);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
  barProgress.value = 0;
};

const onSelectedFiles = (event) => {
  filesPending.value = true;
  files.value = event.files;
};

const uploadEvent = async (callback) => {
  const formData = new FormData();
  formData.append("file", files.value[0]);
  try {
    await apiClient.post(`/images/uploadProfilePicture/${props.userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        barProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      },
    });
    showSuccessToast("Zdjęcie profilowe zostało zaktualizowane!");
    filesPending.value = false;
  } catch (error) {
    showErrorToast(error.response.data.message);
  }
};

const onUpdateError = () => {
  showErrorToast("Wystąpił błąd podczas zmiany zdjęcia profilowego!");
};

const onFileUploadError = () => {
  showInfoToast("Nie można przesłać wybranego pliku!");
};

const savePost = async () => {
  showAddedPostToast();
  emit("close");
};

const closeDialog = () => {
  emit("close");
};
</script>

<template>
  <Dialog
    header="Zdjęcie profilowe"
    :visible="true"
    :style="{ width: '50rem' }"
    :closable="true"
    :draggable="false"
    modal
    @update:visible="
      (value) => {
        if (!value) closeDialog();
      }
    "
  >
    <div class="card">
      <FileUpload
        @error="onUpdateError"
        :multiple="false"
        accept="image/*"
        :maxFileSize="2000000"
        :file-limit="1"
        @select="onSelectedFiles"
      >
        <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
          <div class="flex flex-col justify-between items-center gap-2 w-full">
            <div class="flex gap-2">
              <Button
                label="Wybierz plik"
                @click="chooseCallback()"
                @error="onFileUploadError()"
                icon="pi pi-images"
                outlined
                :disabled="files.length > 0"
              ></Button>
              <Button
                label="Rozpocznij przesyłanie"
                @click="uploadEvent(uploadCallback)"
                @error="onUpdateError()"
                icon="pi pi-cloud-upload"
                outlined
                severity="success"
                :disabled="!files || files.length === 0"
              ></Button>
            </div>
            <ProgressBar
              :value="barProgress"
              :showValue="true"
              class="h-[1.5rem] w-full md:ml-auto"
            ></ProgressBar>
          </div>
        </template>
        <template
          #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }"
        >
          <div>
            <div class="flex flex-wrap p-0 sm:p-5 gap-5">
              <div
                v-for="(file, index) of files"
                :key="file.name + file.type + file.size"
                class="card m-0 px-6 flex flex-col border border-gray-300 items-center gap-3"
              >
                <div
                  class="w-24 h-16 flex items-center justify-center overflow-hidden border border-gray-300 rounded"
                >
                  <img
                    role="presentation"
                    :alt="file.name"
                    :src="file.objectURL"
                    class="object-contain w-full h-full"
                  />
                </div>
                <span class="font-semibold">{{ file.name }}</span>
                <div>{{ formatFileSize(file.size, $primevue) }}</div>
                <Badge v-if="filesPending" value="Oczekujący" severity="warning" />
                <Badge v-else value="Przesłany" severity="success" />
                <Button
                  label="Usuń"
                  icon="pi pi-times"
                  @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                  outlined
                  severity="danger"
                />
              </div>
            </div>
          </div>
        </template>
        <template #empty>
          <div class="flex items-center justify-center">
            <i class="pi pi-cloud-upload p-5 text-8xl text-400 border-400" />
            <div class="text-500 flex flex-col items-center">
              <p class="mb-0 text-md">Przeciągnij plik tutaj lub użyj przycisku "Wybierz plik"</p>
              <p class="text-sm">
                Maksymalny rozmiar pliku to {{ formatFileSize(2000000, $primevue) }}
              </p>
            </div>
          </div>
        </template>
      </FileUpload>
    </div>
  </Dialog>
</template>

<style scoped></style>
