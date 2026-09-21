const Video = ({ src, width, height, className, props }) => {
  return (
    <video
      src={src}
      width={width}
      height={height}
      controls
      playsInline
      className={className}
      {...props}
    >
      Your browser does not support video playback.
    </video>
  );
};

export default Video;
