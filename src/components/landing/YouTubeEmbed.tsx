type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
};

export function YouTubeEmbed({
  videoId,
  title,
  autoplay = false,
  mute = false,
  loop = false,
  controls = false,
  className = "",
}: YouTubeEmbedProps) {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: mute ? "1" : "0",
    controls: controls ? "1" : "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    iv_load_policy: "3",
    fs: "0",
  });

  if (loop) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }

  return (
    <div className={`relative h-full w-full min-h-0 overflow-hidden ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0 object-cover"
      />
    </div>
  );
}
