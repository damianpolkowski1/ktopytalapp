import apiClient from "@/axios";

export const postComment = async (userId, tweetId, text) => {
    try {
        const response = await apiClient.post(`comments/add/`, {
            userId: userId,
            tweetId: tweetId,
            text: text,
        });
        return response.data;
    } catch (error) {
        console.log('Błąd publikacji komentarza:', error);
    }
};

export const deleteComment = async (commentId) => {
    try {
        const response = await apiClient.delete(`comments/delete/${commentId}`);
        return response.data;
    } catch (error) {
        console.log('Błąd usunięcia komentarza:', error);
    }
};

export const getCommentsForPost = async (postId) => {
    try {
        const response = await apiClient.get(`comments/commentsForPost/${postId}`);
        return response.data;
    } catch (error) {
        console.log('Błąd pobierania danych komentarzy:', error);
        return [];
    }
}