<script setup>
import Avatar from "primevue/avatar";
import ScrollPanel from "primevue/scrollpanel";
import { onMounted } from "vue";
import { followUser, getFollowedUsers } from "@/utils/followingRelationships";
import { getUsersInfo } from "@/utils/users";
import Button from "primevue/button";
import { ref } from "vue";
import { unfollowUser } from "@/utils/followingRelationships";

const followedUsers = ref([]);

const props = defineProps({
  userId: Number,
});

onMounted(async () => {
  const followedUsersIds = await getFollowedUsers(props.userId);

  if (!followedUsersIds || followedUsersIds.length < 1) return;

  followedUsers.value = await getUsersInfo(followedUsersIds);

  await Promise.all(
    followedUsers.value.map(async (user) => {
      user.isCurrentlyFollowed = true;
    })
  );
});

const toggleFollow = async (followed) => {
  if (followed.isCurrentlyFollowed) {
    await unfollowUser(props.userId, followed.id);
  } else {
    await followUser(props.userId, followed.id);
  }

  followed.isCurrentlyFollowed = !followed.isCurrentlyFollowed;
};
</script>

<template>
  <div class="bg-white p-4 flex flex-col items-center justify-center h-[70vh] rounded-lg shadow-md">
    <h3 class="text-lg font-bold mt-0 mb-4 text-gray-800">Obserwujesz</h3>
    <h4 v-if="!followedUsers.length" class="text-gray-600">Nikogo nie obserwujesz</h4>
    <ScrollPanel class="w-[90%] h-[85%]">
      <ul class="list-none p-0">
        <li v-for="(followed, index) in followedUsers" :key="index" class="mb-4 flex items-center">
          <RouterLink :to="`/profile/${followed.id}`" class="flex items-center no-underline text-gray-900 flex-1">
            <Avatar v-if="followed.profilePicturePath" :image="followed.profilePicturePath" shape="circle"></Avatar>
            <Avatar v-else icon="pi pi-user" shape="circle"></Avatar>
            <div class="ml-3">
              <span class="flex items-center">
                {{ followed.nickname }}
                <i v-if="followed.IsVerified" class="pi pi-verified text-blue-600 ml-1 text-sm"></i>
              </span>
            </div>
          </RouterLink>
          <div>
            <Button v-if="followed.isCurrentlyFollowed" label="Przestań obserować" @click="toggleFollow(followed)"
              class="!text-xs !py-1 !px-3 ml-2" severity="danger" icon="pi pi-minus" outlined />
            <Button v-if="!followed.isCurrentlyFollowed" label="Zaobserwuj" @click="toggleFollow(followed)"
              class="!text-xs !py-1 !px-3 ml-2" icon="pi pi-plus" outlined />
          </div>
        </li>
      </ul>
    </ScrollPanel>
  </div>
</template>

<style scoped>
.verified-icon {
  color: rgb(47, 104, 238);
  margin-left: 0.2rem;
  font-size: 0.9rem;
}
</style>
