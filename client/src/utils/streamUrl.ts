/**
 * Converts YouTube, Facebook, or custom video URLs to responsive embed URLs
 */
export function getEmbedStreamUrl(url: string, sourceType: 'youtube' | 'facebook' | 'direct' = 'youtube'): {
  embedUrl: string;
  isEmbeddable: boolean;
} {
  if (!url || !url.trim()) {
    return { embedUrl: '', isEmbeddable: false };
  }

  const trimmed = url.trim();

  // YouTube formatting
  if (sourceType === 'youtube' || trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    let videoId = '';

    // Match patterns:
    // https://www.youtube.com/watch?v=XXXX
    // https://youtu.be/XXXX
    // https://www.youtube.com/live/XXXX
    // https://www.youtube.com/embed/XXXX
    // Or direct 11-char ID
    const watchMatch = trimmed.match(/[?&]v=([^&#]+)/);
    const shortMatch = trimmed.match(/youtu\.be\/([^?&#]+)/);
    const liveMatch = trimmed.match(/youtube\.com\/live\/([^?&#]+)/);
    const embedMatch = trimmed.match(/youtube\.com\/embed\/([^?&#]+)/);

    if (watchMatch && watchMatch[1]) {
      videoId = watchMatch[1];
    } else if (shortMatch && shortMatch[1]) {
      videoId = shortMatch[1];
    } else if (liveMatch && liveMatch[1]) {
      videoId = liveMatch[1];
    } else if (embedMatch && embedMatch[1]) {
      videoId = embedMatch[1];
    } else if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      videoId = trimmed;
    }

    if (videoId) {
      return {
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1`,
        isEmbeddable: true,
      };
    }
  }

  // Facebook Live formatting
  if (sourceType === 'facebook' || trimmed.includes('facebook.com')) {
    if (trimmed.includes('facebook.com/plugins/video.php')) {
      return { embedUrl: trimmed, isEmbeddable: true };
    }
    const encoded = encodeURIComponent(trimmed);
    return {
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&autoplay=true`,
      isEmbeddable: true,
    };
  }

  // Direct HLS or iframe URL
  return {
    embedUrl: trimmed,
    isEmbeddable: true,
  };
}

export default getEmbedStreamUrl;
