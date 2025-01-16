<script setup>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { deleteUserAccount } from "@/utils/users";

const emit = defineEmits(["close"]);

const props = defineProps({
  userId: Number,
});

const confirmDeletion = async () => {
  const result = await deleteUserAccount(props.userId);
  if (result) {
    emit("close");
  }
};

const closeDialog = () => {
  emit("close");
};
</script>

<template>
  <Dialog :visible="true" :closable="false" :draggable="false" modal @hide="closeDialog">
    <div class="flex flex-col justify-center items-center mb-2">
      <h2 class="text-lg font-bold p-0 m-0">Czy na pewno chcesz usunąć swoje konto?</h2>
      <h3 class="text-sm text-gray-600 mt-4 mb-0">
        Ta akcja jest nieodwracalna, a wszystkie Twoje dane zostaną utracone!
      </h3>
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
