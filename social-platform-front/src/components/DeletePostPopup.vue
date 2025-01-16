<script setup>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { deleteTweet } from "@/utils/tweets";
import { useToast } from "primevue/usetoast";

const emit = defineEmits(["close"]);

const props = defineProps({
  postId: Number,
});

const toast = useToast();

const showDeletedPostToast = () => {
  toast.add({
    severity: "info",
    summary: "Usunięto!",
    detail: "Twój post został usunięty",
    life: 3000,
  });
};

const confirmDeletion = async () => {
  const result = await deleteTweet(props.postId);
  if (result) {
    showDeletedPostToast();
    emit("close");
  }
};

const closeDialog = () => {
  emit("close");
};
</script>

<template>
  <Dialog :visible="true" :closable="false" :draggable="false" modal @hide="closeDialog">
    <div class="flex justify-center items-center mb-2">
      <h2 class="text-lg font-bold p-0 m-0">Czy na pewno chcesz usunąć swój post?</h2>
    </div>
    <template #footer>
      <div class="flex justify-center items-center gap-4">
        <Button
          label="Anuluj"
          icon="pi pi-times"
          class="p-button-text"
          severity="secondary"
          @click="closeDialog"
        />
        <Button
          label="Potwierdź"
          icon="pi pi-check"
          class="p-button"
          severity="danger"
          @click="confirmDeletion"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped></style>
