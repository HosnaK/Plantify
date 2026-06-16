type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  /**
   * Hero-style background: aggressive no-chrome params, no fullscreen,
   * transparent overlay above the iframe (pointer-events per prop).
   */
  backgroundMode?: boolean;
};

export function YouTubeEmbed({
  videoId,
  title,
  autoplay = false,
  mute = false,
  loop = false,
  controls = false,
  className = "",
  backgroundMode = false,
}: YouTubeEmbedProps) {
  const params = new URLSearchParams();

  if (backgroundMode) {
    params.set("autoplay", "1");
    params.set("mute", "1");
    params.set("loop", "1");
    params.set("playlist", videoId);
    params.set("controls", "0");
    params.set("showinfo", "0");
    params.set("rel", "0");
    params.set("modestbranding", "1");
    params.set("playsinline", "1");
    params.set("enablejsapi", "1");
    params.set("iv_load_policy", "3");
    params.set("fs", "0");
    params.set("disablekb", "1");
    params.set("cc_load_policy", "0");
  } else {
    params.set("autoplay", autoplay ? "1" : "0");
    params.set("mute", mute ? "1" : "0");
    params.set("controls", controls ? "1" : "0");
    params.set("modestbranding", "1");
    params.set("rel", "0");
    params.set("playsinline", "1");
    params.set("iv_load_policy", "3");
    params.set("fs", controls ? "1" : "0");
    if (loop) {
      params.set("loop", "1");
      params.set("playlist", videoId);
    }
  }

  const allow = backgroundMode
    ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        title={title}
        allow={allow}
        allowFullScreen={!backgroundMode}
        className="absolute inset-0 z-0 h-full w-full border-0"
      />
      {backgroundMode ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-transparent"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
