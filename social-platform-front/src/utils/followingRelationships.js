import apiClient from "@/axios";

export const getFollowedUsers = async (userId) => {
  try {
    const response = await apiClient.get(`following-relationships/followed/${userId}`);
    return response.data;
  } catch (error) {
    console.log("Błąd pobierania id oberwowanych:", error);
  }
};

export const getNotFollowedUsers = async (userId) => {
  try {
    const response = await apiClient.get(`following-relationships/notFollowed/${userId}`);
    return response.data;
  } catch (error) {
    console.log("Błąd pobierania id nieoberwowanych:", error);
  }
};

export const checkIfFollowing = async (userId, followedId) => {
  try {
    const response = await apiClient.get(
      `following-relationships/checkIfFollowed/${userId}/${followedId}`
    );
    return response.data;
  } catch (error) {
    console.log("Błąd pobierania obserwacji:", error);
  }
};

export const followUser = async (userId, followedId) => {
  try {
    const response = await apiClient.put(
      `following-relationships/followUser/${userId}/${followedId}`
    );
    return response.data;
  } catch (error) {
    console.log("Błąd dodania obserwacji:", error);
  }
};

export const unfollowUser = async (userId, followedId) => {
  try {
    const response = await apiClient.delete(
      `following-relationships/unfollowUser/${userId}/${followedId}`
    );
    return response.data;
  } catch (error) {
    console.log("Błąd usunięcia obserwacji:", error);
  }
};

export const getFollowersCount = async (userId) => {
  try {
    const response = await apiClient.get(`following-relationships/countFollowers/${userId}`);
    return response.data;
  } catch (error) {
    console.log("Błąd pobierania liczby obserwatorów:", error);
  }
};
