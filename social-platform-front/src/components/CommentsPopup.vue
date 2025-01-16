<script setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import { formatDate } from "@/utils/formatDate";
import { postComment, getCommentsForPost } from "@/utils/comments";
import { getUsersInfo } from "@/utils/users";
import DeleteCommentPopup from "./DeleteCommentPopup.vue";
import { useToast } from "primevue/usetoast";
import { filterTextFromUnnecessaryEndlines } from "@/utils/formatText";
import Avatar from "primevue/avatar";

const emit = defineEmits(["close"]);

const dialogVisible = ref(true);

const props = defineProps({
  postId: Number,
  userId: Number,
});

const comments = ref([]);
const newCommentText = ref("");
const maxCharacters = 2000;

const usersInfo = ref([]);

const loadComments = async () => {
  comments.value = await getCommentsForPost(props.postId);

  if (comments.value.length)
    usersInfo.value = await getUsersInfo(comments.value.map((comment) => comment.userId));
};

const toast = useToast();

const showAddedCommentToast = () => {
  toast.add({
    severity: "success",
    summary: "Dodano!",
    detail: "Pomyślnie dodano Twój komentarz",
    life: 3000,
  });
};

const addComment = async () => {
  const filteredText = filterTextFromUnnecessaryEndlines(newCommentText.value);
  const result = await postComment(props.userId, props.postId, filteredText);

  if (result) {
    newCommentText.value = "";
    showAddedCommentToast();
    await loadComments();
  }
};

onMounted(async () => {
  await loadComments();
});

const closeDialog = () => {
  dialogVisible.value = false;
  emit("close");
};

const isDeleteCommentDialogVisible = ref(false);
const selectedForCommentDeletingId = ref(null);

const openCommentDeleteDialog = (commentId) => {
  selectedForCommentDeletingId.value = commentId;
  isDeleteCommentDialogVisible.value = true;
};

const closeCommentDeleteDialog = async () => {
  isDeleteCommentDialogVisible.value = false;
  await loadComments();
};
</script>

<template>
  <Dialog
    :visible="dialogVisible"
    :style="{ width: '45rem', 'max-height': '37rem' }"
    header="Komentarze"
    modal
    :draggable="false"
    @update:visible="
      (value) => {
        if (!value) closeDialog();
      }
    "
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col items-center max-h-[22rem] overflow-y-auto scrollbar-none">
        <h3 v-if="!comments.length">Ten post nie ma jeszcze komentarzy</h3>
        <Card
          v-else
          v-for="comment in comments"
          :key="comment.id"
          class="border border-gray-300 my-4 w-[90%] comment-card"
        >
          <template #title>
            <div class="flex justify-between items-center">
              <div class="flex items-center mb-2">
                <Avatar
                  v-if="usersInfo.find((user) => user.id === comment.userId)?.profilePicturePath"
                  :image="usersInfo.find((user) => user.id === comment.userId)?.profilePicturePath"
                  shape="circle"
                  size="large"
                ></Avatar>
                <Avatar v-else icon="pi pi-user" shape="circle" size="large"></Avatar>
                <div class="ml-3">
                  <span class="flex items-center">
                    {{
                      usersInfo.find((user) => user.id === comment.userId)?.nickname ||
                      "Nieznany użytkownik"
                    }}
                    <i
                      v-if="usersInfo.find((user) => user.id === comment.userId)?.IsVerified"
                      class="pi pi-verified text-blue-600 ml-2 text-md"
                    ></i>
                  </span>
                </div>
              </div>
              <div v-if="props.userId == comment.userId">
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  @click="openCommentDeleteDialog(comment.id)"
                />
              </div>
            </div>
          </template>
          <template #subtitle>{{ formatDate(comment.createdAt) }}</template>
          <template #content>
            <p class="break-words whitespace-normal max-w-full">{{ comment.text }}</p>
          </template>
        </Card>
        <DeleteCommentPopup
          v-if="isDeleteCommentDialogVisible"
          @close="closeCommentDeleteDialog"
          :commentId="selectedForCommentDeletingId"
        />
      </div>
      <div class="flex">
        <Textarea
          v-model="newCommentText"
          :maxlength="maxCharacters"
          class="flex-1 mr-2 resize-none"
          placeholder="Dodaj komentarz..."
          rows="3"
        />
        <Button label="Opublikuj" @click="addComment" :disabled="newCommentText.length === 0" />
      </div>
      <p
        v-if="newCommentText.length > 0"
        class="text-right mt-[-0.5rem] text-sm dialog-content-characters-p"
      >
        {{ maxCharacters - newCommentText.length }} znaków pozostało
      </p>
      <p v-else class="text-right mt-[-0.5rem] text-sm">&nbsp;</p>
    </div>
  </Dialog>
</template>

<style scoped>
.scrollbar-none {
  scrollbar-width: none;
}
.comment-card {
  border: 1px solid #ccc;
  margin: 1rem;
  width: 90%;
}

.dialog-content-characters-p {
  text-align: right;
  margin: 0 0 -0.5rem 0;
  font-size: 0.8rem;
}
</style>
