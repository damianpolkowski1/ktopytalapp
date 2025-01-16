export function formatLikesCount(likesCount) {
  if (likesCount === 1) {
    return `${likesCount} polubienie`;
  } else if (
    likesCount % 10 >= 2 &&
    likesCount % 10 <= 4 &&
    !(likesCount >= 12 && likesCount <= 14)
  ) {
    return `${likesCount} polubienia`;
  } else {
    return `${likesCount} polubień`;
  }
}

export function formatCommentsCount(commentsCount) {
  if (commentsCount === 1) {
    return `${commentsCount} komentarz`;
  } else if (commentsCount > 1 && commentsCount < 5) {
    return `${commentsCount} komentarze`;
  } else {
    return `${commentsCount} komentarzy`;
  }
}

export function formatFollowersCount(followersCount) {
  if (followersCount === 1) {
    return `${followersCount} obserwujący`;
  } else {
    return `${followersCount} obserwujących`;
  }
}

export function formatViewsCount(viewsCount) {
  if (viewsCount === 1) {
    return `${viewsCount} wyświetlenie`;
  } else if (viewsCount % 10 >= 2 && viewsCount % 10 <= 4 && viewsCount > 15) {
    return `${viewsCount} wyświetlenia`;
  } else {
    return `${viewsCount} wyświetleń`;
  }
}

export function filterTextFromUnnecessaryEndlines(inputText) {
  return inputText
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");
}

export function formatFileSize(bytes, $primevue) {
  const k = 1024;
  const dm = 0;
  const sizes = $primevue.config.locale.fileSizeTypes;

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
}
