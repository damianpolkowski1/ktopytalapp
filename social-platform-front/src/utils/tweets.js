import apiClient from "@/axios";

export const postTweet = async (userId, text) => {
    try {
        const response = await apiClient.post(`tweets/create/`, {
            userId: userId,
            text: text,
        });
        return response.data;
    } catch (error) {
        console.log('Błąd publikacji posta:', error);
    }
};

export const deleteTweet = async (tweetId) => {
    try {
        const response = await apiClient.delete(`tweets/delete/${tweetId}`);
        return response.data;
    } catch (error) {
        console.log('Błąd usunięcia posta:', error);
    }
};

export const getTweetsByUserIds = async (userIds) => {
    try {
        const response = await apiClient.post(`tweets/bymultipleids/`, {
            userIds: userIds,
        });
        return response.data;
    } catch (error) {
        console.log('Błąd pobierania danych postów:', error);
        return [];
    }
}

export const likeOrUnlikeATweet = async (userId, tweetId) => {
    try {
        const response = await apiClient.post(`likes/likeorunlike/`, {
            userId: userId,
            tweetId: tweetId
        });
        return response.data;
    } catch (error) {
        console.log('Błąd modyfikacji polubienia posta:', error);
    }
}

export const getLikesCount = async (tweetId) => {
    try {
        const response = await apiClient.get(`likes/likesCount/${tweetId}`);
        return response.data;
    } catch (error) {
        console.log('Błąd pobrania liczby polubień posta:', error);
    }
}

export const getLike = async (userId, tweetId) => {
    try {
        const response = await apiClient.get(`likes/getLike/${userId}/${tweetId}`);
        return response.data;
    } catch (error) {
        console.log('Błąd pobrania polubienia:', error);
    }
}

export const getCommentsCount = async (tweetId) => {
    try {
        const response = await apiClient.get(`comments/numberOfCommentsForPost/${tweetId}`);
        return response.data;
    } catch (error) {
        console.log('Błąd pobrania liczby komentarzy posta:', error);
    }
}