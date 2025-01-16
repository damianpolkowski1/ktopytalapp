<script setup>
import Avatar from "primevue/avatar";
import Header from "@/components/Header.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import { waitForToken } from "@/utils/token";
import { jwtDecode } from "jwt-decode";
import {
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  onUpdated,
  ref,
} from "vue";
import { getUserInfo, getUserProfile, checkIfUserExists, updateUserProfile } from "@/utils/users";
import {
  formatDateWithoutTime,
  formatDateBeforeSending,
  formatDateWithoutWords,
} from "@/utils/formatDate";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from "vue-router";
import router from "@/router";
import { useToast } from "primevue/usetoast";
import EditDescriptionPopup from "./EditDescriptionPopup.vue";
import { plLocale } from "@/utils/calendarComponentTranslate";
import UploadProfilePicturePopup from "./UploadProfilePicturePopup.vue";
import DeleteAccountPopup from "./DeleteAccountPopup.vue";
import InputSwitch from "primevue/inputswitch";
import Button from "primevue/button";
import {
  checkIfFollowing,
  followUser,
  unfollowUser,
  getFollowersCount,
} from "@/utils/followingRelationships";
import { formatFollowersCount } from "@/utils/formatText";

const route = useRoute();
const token = ref("");

// Data needed for displaying profile
const userInfo = ref({});
const userProfileInfo = ref({});

// logged user id
const userId = ref(0);

// Id of a user whose profile is being displayed
const userProfileId = ref(0);

// Idicates if the profile being displayed is the profile of the logged user
// If so, they can edit their profile
const editMode = ref(false);

const isEditingLocation = ref(false);
const isEditingBirthdate = ref(false);

const tempLocation = ref("");
const tempBirthdate = ref("");

const isFollowing = ref(false);

// A number of followers of the user whose profile is being displayed
const followersCount = ref(0);

const toast = useToast();

const showInfoToast = (message) => {
  toast.add({ severity: "info", summary: "Błąd!", detail: message, life: 3000 });
};

const showErrorToast = (message) => {
  toast.add({ severity: "error", summary: "Błąd!", detail: message, life: 3000 });
};

const loadProfileData = async (profileId) => {
  try {
    try {
      userProfileId.value = profileId ? profileId : route.params.id;
      if (!(await checkIfUserExists(userProfileId.value))) {
        router.push("/home");
      }

      const tokenToDecode = await waitForToken();
      token.value = jwtDecode(tokenToDecode);
      userId.value = token.value.userId;

      if (userProfileId.value == userId.value) {
        editMode.value = true;
      } else {
        editMode.value = false;
      }
    } catch (error) {
      console.error("Błąd ładowania tokena:", error);
      window.location.href = "/";
    }

    userInfo.value = await getUserInfo(userProfileId.value);
    userProfileInfo.value = await getUserProfile(userProfileId.value);
    tempLocation.value = userProfileInfo.value.location;
    tempBirthdate.value = formatDateWithoutWords(userProfileInfo.value.birthdate);
    isFollowing.value = await checkIfFollowing(userId.value, userProfileId.value);
    followersCount.value = await getFollowersCount(userProfileId.value);
  } catch (error) {
    console.error("Błąd ładowania danych profilu:", error);
    window.location.href = "/";
  }
};

onMounted(async () => {
  await loadProfileData(route.params.id);
});

onBeforeRouteUpdate(async (to) => {
  await loadProfileData(to.params.id);
});

const saveLocation = async () => {
  isEditingLocation.value = false;
  try {
    const updatedUser = await updateUserProfile(userProfileId.value, {
      location: tempLocation.value,
    });

    userProfileInfo.value = updatedUser;
  } catch (error) {
    showInfoToast("Błąd zapisywania danych");
  }
};

const saveEmailNotificationsPreference = async () => {
  try {
    await updateUserProfile(userProfileId.value, {
      emailNotificationsEnabled: userProfileInfo.value.emailNotificationsEnabled,
    });
  } catch (error) {
    showInfoToast("Błąd zapisywania danych");
  }
};

const saveBirthdate = async () => {
  isEditingBirthdate.value = false;
  try {
    const formattedBirthdate = tempBirthdate.value
      ? formatDateBeforeSending(tempBirthdate.value)
      : null;

    const updatedUser = await updateUserProfile(userProfileId.value, {
      birthdate: formattedBirthdate,
    });

    userProfileInfo.value = {
      birthdate: formattedBirthdate,
      ...updatedUser,
    };
  } catch (error) {
    showInfoToast("Nie zapisano nowych danych");
  }
};

const toggleFollow = async () => {
  if (isFollowing.value) {
    try {
      await unfollowUser(userId.value, userProfileId.value);
      followersCount.value--;
    } catch (error) {
      showErrorToast("Błąd usunięcia obserwacji");
    }
  } else {
    try {
      await followUser(userId.value, userProfileId.value);
      followersCount.value++;
    } catch (error) {
      showErrorToast("Błąd dodania obserwacji");
    }
  }
  isFollowing.value = !isFollowing.value;
};

const isEditDescriptionDialogVisible = ref(false);

const openEditDescriptionDialog = () => {
  isEditDescriptionDialogVisible.value = true;
};

const closeEditDescriptionDialog = async () => {
  isEditDescriptionDialogVisible.value = false;
  loadProfileData();
};

const isUploadProfilePictureDialogVisible = ref(false);

const openUploadProfilePictureDialog = () => {
  isUploadProfilePictureDialogVisible.value = true;
};

const closeUploadProfilePictureDialog = async () => {
  isUploadProfilePictureDialogVisible.value = false;
  loadProfileData();
};

const isDeleteAccountDialogVisible = ref(false);

const openDeleteAccountDialog = () => {
  isDeleteAccountDialogVisible.value = true;
};

const closeDeleteAccountDialog = async () => {
  isDeleteAccountDialogVisible.value = false;
};
</script>

<template>
  <div class="flex flex-col items-center mb-[10vh]">
    <Header v-if="token" :userId="token.userId" />
    <div class="background-shape"></div>

    <div class="profile-avatar top-[19vh] absolute">
      <Avatar
        v-if="userInfo.profilePicturePath"
        :image="userInfo.profilePicturePath"
        class="bg-gray-300"
        size="xlarge"
        style="border-radius: 10px"
      />
      <Avatar
        v-else
        icon="pi pi-user"
        class="bg-gray-300"
        size="xlarge"
        style="border-radius: 10px"
      />
      <div v-if="editMode" class="avatar-overlay">
        <i class="pi pi-pencil" @click="openUploadProfilePictureDialog"></i>
      </div>
    </div>

    <div class="mt-[23vh] flex flex-col gap-[3vh]">
      <Card class="text-center" style="min-width: 30rem; max-width: 50rem">
        <template #title>
          <div class="flex flex-col items-center justify-center mt-2">
            <div class="flex relative items-center gap-[0.5rem] m-0">
              <h2 class="p-0 m-0">{{ userInfo.nickname }}</h2>
              <i v-if="userInfo.IsVerified" class="pi pi-verified text-blue-600"></i>
            </div>
          </div>
          <div class="mb-3 mt-1 text-gray-500 text-[1rem]">
            <p class="m-0">{{ formatFollowersCount(followersCount) }}</p>
          </div>
          <div class="mb-6" v-if="!editMode">
            <Button
              v-if="isFollowing"
              label="Przestań obserować"
              @click="toggleFollow()"
              class="!text-xs !py-[0.5rem] !px-3"
              severity="danger"
              icon="pi pi-user-minus"
              outlined
            />
            <Button
              v-if="!isFollowing"
              label="Zaobserwuj"
              @click="toggleFollow()"
              class="!text-xs !py-[0.5rem] !px-3"
              icon="pi pi-user-plus"
              outlined
            />
          </div>
        </template>
        <template #content>
          <div class="flex flex-col items-center justify-center gap-[1rem]">
            <div class="editable-line">
              <b>Lokalizacja: </b>
              <span v-if="!isEditingLocation">{{ userProfileInfo.location || "Brak" }}</span>
              <InputText
                v-if="isEditingLocation"
                v-model="tempLocation"
                @blur="saveLocation"
                placeholder="Edytuj lokalizację"
                :maxlength="100"
              />
              <i
                v-if="editMode"
                class="pi pi-pencil ml-[0.5rem]"
                @click="isEditingLocation = true"
              ></i>
            </div>

            <div class="editable-line">
              <b>Data urodzenia: </b>
              <span v-if="!isEditingBirthdate">{{
                userProfileInfo.birthdate
                  ? formatDateWithoutWords(userProfileInfo.birthdate)
                  : "Brak"
              }}</span>
              <Calendar
                v-if="isEditingBirthdate"
                v-model="tempBirthdate"
                @hide="saveBirthdate"
                :locale="plLocale"
                :max-date="new Date()"
                date-format="yy-mm-dd"
                placeholder="Edytuj datę urodzenia"
              />
              <i
                v-if="editMode"
                class="pi pi-pencil ml-[0.5rem]"
                @click="isEditingBirthdate = true"
              ></i>
              <EditDescriptionPopup
                v-if="isEditDescriptionDialogVisible"
                :userId="userId"
                :description="userProfileInfo.description"
                @close="closeEditDescriptionDialog"
              />
            </div>

            <span
              ><b>Dołączył(a): </b
              >{{ userInfo.userSince ? formatDateWithoutTime(userInfo.userSince) : "Brak" }}</span
            >
          </div>
        </template>
      </Card>

      <Card class="text-center description-card" style="min-width: 30rem; max-width: 50rem">
        <template #title>
          <div class="flex flex-col items-center justify-center">
            <div class="flex relative items-center gap-[0.5rem]">
              <h2 class="p-0 my-2">O mnie</h2>
              <i v-if="editMode" class="pi pi-pencil" @click="openEditDescriptionDialog"></i>
            </div>
          </div>
        </template>
        <template #content>
          <p>{{ userProfileInfo.description ? userProfileInfo.description : "Brak opisu" }}</p>
        </template>
      </Card>

      <Card v-if="editMode" class="text-center" style="min-width: 30rem; max-width: 50rem">
        <template #title>
          <h2 class="p-0 my-2">Ustawienia</h2>
        </template>
        <template #content>
          <div class="flex flex-col items-center justify-center">
            <div class="flex items-center gap-2 mt-6">
              <InputSwitch
                v-if="editMode"
                v-model="userProfileInfo.emailNotificationsEnabled"
                :true-value="1"
                :false-value="0"
                @change="saveEmailNotificationsPreference"
                class="align-middle"
              />
              <span class="text-md font-medium">Powiadomienia E-Mail</span>
            </div>
            <Button
              v-if="editMode"
              icon="pi pi-times-circle"
              label="Usuń konto"
              severity="danger"
              class="mt-8"
              @click="openDeleteAccountDialog"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
  <UploadProfilePicturePopup
    v-if="isUploadProfilePictureDialogVisible"
    :userId="userId"
    @close="closeUploadProfilePictureDialog"
  />
  <DeleteAccountPopup
    v-if="isDeleteAccountDialogVisible"
    :userId="userId"
    @close="closeDeleteAccountDialog"
  />
</template>

<style scoped>
.background-shape {
  position: absolute;
  width: 100%;
  height: 30vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 85%);
  z-index: -1;
}

::v-deep(.p-avatar img) {
  border-radius: 10px;
}

.p-avatar.p-avatar-xl {
  width: 8rem;
  height: 8rem;
  font-size: 4rem;
}

.p-avatar.p-avatar-xl .p-avatar-icon {
  font-size: 4rem;
}

::v-deep(.p-card-body) {
  gap: 0;
}

.pi-pencil {
  cursor: pointer;
  color: #007ad9;
  transition: opacity 0.2s;
  opacity: 0;
  z-index: 1;
}

.editable-line:hover .pi-pencil {
  opacity: 1;
}

.description-card:hover .pi-pencil {
  opacity: 1;
}

.profile-avatar {
  border-radius: 10px;
}

.profile-avatar:hover .pi-pencil {
  opacity: 1;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 8rem;
  height: 8rem;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0.5rem;
  color: #007ad9;
  font-size: 2rem;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 10px;
}

.profile-avatar:hover .avatar-overlay {
  opacity: 1;
}
</style>
