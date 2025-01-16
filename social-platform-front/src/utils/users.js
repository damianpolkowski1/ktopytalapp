import apiClient from "@/axios";
import { logout } from "./login";

export const getUsersInfo = async (ids) => {
  try {
    const response = await apiClient.post("/users/get-by-ids", {
      ids: ids,
    });

    const usersWithProfilePicturePaths = response.data.map((user) => {
      return {
        ...user,
        profilePicturePath: user.profilePictureId
          ? `http://localhost:6868/images/${user.profilePictureId}`
          : null,
      };
    });

    return usersWithProfilePicturePaths;
  } catch (error) {
    console.log("Błąd pobierania danych użytkowników:", error);
    return null;
  }
};

export const getUserInfo = async (id) => {
  try {
    const response = await apiClient.get(`/users/one/${id}`);

    const user = response.data;
    const userWithProfilePicturePath = {
      ...user,
      profilePicturePath: user.profilePictureId
        ? `http://localhost:6868/images/${user.profilePictureId}`
        : null,
    };

    return userWithProfilePicturePath;
  } catch (error) {
    console.log("Błąd pobierania danych użytkownika:", error);
    return null;
  }
};

export const getUserProfile = async (id) => {
  try {
    const response = await apiClient.get(`/users/get-profile/${id}`);
    return response.data;
  } catch (error) {
    console.log("Błąd pobierania danych profilu użytkownika:", error);
    return null;
  }
};

export const checkIfUserExists = async (id) => {
  try {
    const response = await apiClient.get(`/users/all`);

    if (response.data) {
      const exists = response.data.some((user) => user.id == id);
      if (exists) return true;
    }

    return false;
  } catch (error) {
    console.log("Błąd sprawdzenia istnienia użytkownika:", error);
    return null;
  }
};

export const updateUserProfile = async (userId, payload) => {
  try {
    const response = await apiClient.patch(`/users/updateProfile/${userId}`, {
      ...payload,
    });

    return response.data;
  } catch (error) {
    console.log("Błąd zapisywania danych profilu użytkownika:", error);
    return error.response.data.message;
  }
};

export const deleteUserAccount = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/deleteAccount/${userId}`);

    if (response.status == 200) {
      logout();
    }
  } catch (error) {
    console.log("Błąd podczas usuwania profilu użytkownika:", error);
    return error.response.data.message;
  }
};
