<script setup>
import Card from "primevue/card";
import Button from "primevue/button";
import { onMounted, ref, watch } from "vue";
import { getFollowedUsers, getNotFollowedUsers } from "@/utils/followingRelationships";
import { getUsersInfo } from "@/utils/users";
import {
  getTweetsByUserIds,
  likeOrUnlikeATweet,
  getLikesCount,
  getLike,
  getCommentsCount,
} from "@/utils/tweets";
import { formatDate } from "@/utils/formatDate";
import { formatLikesCount, formatCommentsCount, formatViewsCount } from "@/utils/formatText";
import DeletePostPopup from "./DeletePostPopup.vue";
import CommentsPopup from "./CommentsPopup.vue";
import Avatar from "primevue/avatar";
import { format } from "date-fns";

const posts = ref([]);

const usersToDisplayIds = ref([]);
const usersToDisplayInfo = ref([]);

const props = defineProps({
  userId: Number,
  feedTab: String,
});

const loadFeedData = async () => {
  if (props.feedTab == "dla-ciebie") {
    usersToDisplayIds.value = await getFollowedUsers(props.userId);
  } else if (props.feedTab == "odkryj") {
    usersToDisplayIds.value = await getNotFollowedUsers(props.userId);
  } else if (props.feedTab == "twoje-posty") {
    usersToDisplayIds.value = [props.userId];
  }

  if (usersToDisplayIds.value && usersToDisplayIds.value.length > 0) {
    usersToDisplayInfo.value = await getUsersInfo(usersToDisplayIds.value);
    posts.value = await getTweetsByUserIds(usersToDisplayIds.value);

    await Promise.all(
      posts.value.map(async (post) => {
        post.likesCount = await getLikesCount(post.id);
        post.commentsCount = await getCommentsCount(post.id);
        post.likedByCurrentUser = await getLike(props.userId, post.id);
      })
    );
  } else {
    posts.value = [];
    usersToDisplayInfo.value = [];
  }
};

onMounted(async () => {
  await loadFeedData();
});

watch(
  () => props.feedTab,
  async () => {
    await loadFeedData();
  }
);

const toggleLike = async (post) => {
  post.likesCount = await likeOrUnlikeATweet(props.userId, post.id);
  post.likedByCurrentUser = !post.likedByCurrentUser;
};

const isDeletePostDialogVisible = ref(false);
const selectedForDeletingId = ref(null);

const openDeletePostDialog = (postId) => {
  selectedForDeletingId.value = postId;
  isDeletePostDialogVisible.value = true;
};

const closeDeletePostDialog = async () => {
  isDeletePostDialogVisible.value = false;
  await loadFeedData();
};

const isCommentsDialogVisible = ref(false);
const selectedForCommentsId = ref(null);

const openCommentsDialog = (postId) => {
  selectedForCommentsId.value = postId;
  isCommentsDialogVisible.value = true;
};

const closeCommentsDialog = async () => {
  isCommentsDialogVisible.value = false;
  await loadFeedData();
};

defineExpose({
  loadFeedData,
});
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-[3vh] mb-12">
    <h1 v-if="!posts.length">Brak postów do wyświetlenia</h1>
    <Card v-for="(post, index) in posts" :key="index" class="w-[85%] p-[1vh]">
      <template #title>
        <div class="flex justify-between items-center">
          <RouterLink
            :to="`/profile/${post.userId}`"
            class="flex items-center mb-[0.5rem] no-underline text-gray-800"
          >
            <Avatar
              v-if="usersToDisplayInfo.find((user) => user.id === post.userId)?.profilePicturePath"
              :image="
                usersToDisplayInfo.find((user) => user.id === post.userId)?.profilePicturePath
              "
              shape="circle"
              size="large"
            ></Avatar>
            <Avatar v-else icon="pi pi-user" shape="circle" size="large"></Avatar>
            <div class="ml-4">
              <span class="flex items-center">
                {{
                  usersToDisplayInfo.find((user) => user.id === post.userId)?.nickname ||
                  "Nieznany użytkownik"
                }}
                <i
                  v-if="usersToDisplayInfo.find((user) => user.id === post.userId)?.IsVerified"
                  class="pi pi-verified text-blue-600 ml-2 text-md"
                ></i>
              </span>
            </div>
          </RouterLink>
          <div v-if="props.feedTab == 'twoje-posty'">
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              @click="openDeletePostDialog(post.id)"
            />
          </div>
        </div>
      </template>
      <template #subtitle>{{ formatDate(post.createdAt) }}</template>
      <template #content>
        <p class="break-words whitespace-normal max-w-full">
          {{ post.text }}
        </p>
      </template>
      <template #footer>
        <div class="flex items-center">
          <Button
            :icon="post.likedByCurrentUser ? 'pi pi-heart-fill' : 'pi pi-heart'"
            :class="{ 'text-red-500': post.likedByCurrentUser }"
            @click="toggleLike(post)"
            severity="danger"
            text
          />
          <span class="ml-1 mr-4">{{ formatLikesCount(post.likesCount) }}</span>
          <Button
            icon="pi pi-comments"
            :label="formatCommentsCount(post.commentsCount)"
            @click="openCommentsDialog(post.id)"
            severity="secondary"
            text
          />
        </div>
        <div class="text-gray-500 text-sm flex items-center ml-3 mt-2">
          <i class="pi pi-eye mr-2 text-md"></i>
          <p class="m-0 p-0">{{ formatViewsCount(post.viewsCount) }}</p>
        </div>
      </template>
    </Card>

    <DeletePostPopup
      v-if="isDeletePostDialogVisible"
      @close="closeDeletePostDialog"
      :postId="selectedForDeletingId"
    />
    <CommentsPopup
      v-if="isCommentsDialogVisible"
      @close="closeCommentsDialog"
      :postId="selectedForCommentsId"
      :userId="props.userId"
    />
  </div>
</template>

<style scoped>
.liked {
  color: #ef4444;
}
</style>
