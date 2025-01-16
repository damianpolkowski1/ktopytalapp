<script setup>
import { ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { updateUserProfile } from "@/utils/users";
import { filterTextFromUnnecessaryEndlines } from "@/utils/formatText";

const props = defineProps({
  userId: Number,
  description: String,
});

const emit = defineEmits(["close"]);
const descriptionContent = ref(props.description || "");
const maxCharacters = 5000;

const dialogVisible = ref(true);

const toast = useToast();

const showEdittedDescriptionToast = (message) => {
  toast.add({
    severity: "success",
    summary: "Dodano!",
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

const saveDescription = async () => {
  const filteredText = filterTextFromUnnecessaryEndlines(descriptionContent.value);

  try {
    await updateUserProfile(props.userId, { description: filteredText });
    showEdittedDescriptionToast("Pomyślnie nadpisano Twój opis");
    emit("close");
  } catch (error) {
    showInfoToast("Nie można zapisać opisu profilu");
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
  emit("close");
};
</script>

<template>
  <Dialog
    header="Opis Twojego Profilu"
    :visible="dialogVisible"
    class="w-[40rem]"
    :closable="true"
    :draggable="false"
    modal
    @update:visible="
      (value) => {
        if (!value) closeDialog();
      }
    "
  >
    <div class="flex flex-col gap-4">
      <textarea
        v-model="descriptionContent"
        :maxlength="maxCharacters"
        placeholder="Powiedz coś o sobie..."
        class="w-full h-[20vh] resize-none p-2 border border-gray-300 rounded-lg text-sm"
      ></textarea>
      <p class="text-right m-0 text-xs">
        {{ maxCharacters - descriptionContent.length }} znaków pozostało
      </p>
    </div>
    <template #footer>
      <Button label="Anuluj" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
      <Button
        label="Dodaj"
        icon="pi pi-check"
        class="p-button"
        @click="saveDescription"
        :disabled="descriptionContent.length === 0"
      />
    </template>
  </Dialog>
</template>

<style scoped></style>
