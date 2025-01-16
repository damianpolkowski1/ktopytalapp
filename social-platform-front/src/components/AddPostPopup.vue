<script setup>
import { ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { postTweet } from "@/utils/tweets";
import { filterTextFromUnnecessaryEndlines } from "@/utils/formatText";

const emit = defineEmits(["close"]);
const postContent = ref("");
const maxCharacters = 4000;

const dialogVisible = ref(true);

const props = defineProps({
  userId: Number,
});

const toast = useToast();

const showAddedPostToast = () => {
  toast.add({
    severity: "success",
    summary: "Dodano!",
    detail: "Pomyślnie dodano Twój post",
    life: 3000,
  });
};

const savePost = async () => {
  const filteredText = filterTextFromUnnecessaryEndlines(postContent.value);

  const result = await postTweet(props.userId, filteredText);
  if (result) {
    showAddedPostToast();
    emit("close");
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
  emit("close");
};
</script>

<template>
  <Dialog
    header="Dodaj nowy post"
    :visible="dialogVisible"
    :style="{ width: '40rem' }"
    :closable="true"
    :draggable="false"
    modal
    @update:visible="
      (value) => {
        if (!value) closeDialog();
      }
    "
  >
    <div class="flex flex-col">
      <textarea
        v-model="postContent"
        :maxlength="maxCharacters"
        placeholder="Co chcesz powiedzieć?"
        class="w-full h-[20vh] resize-none p-2 border border-gray-400 rounded-md text-sm"
      ></textarea>
      <p class="text-right text-sm">{{ maxCharacters - postContent.length }} znaków pozostało</p>
    </div>
    <template #footer>
      <Button label="Anuluj" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
      <Button
        label="Dodaj"
        icon="pi pi-check"
        class="p-button"
        @click="savePost"
        :disabled="postContent.length === 0"
      />
    </template>
  </Dialog>
</template>

<style scoped></style>
