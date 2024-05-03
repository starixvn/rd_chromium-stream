const FfmpegCommand = require("fluent-ffmpeg");

const useGPU = false || process.env.USE_GPU === "true";

function ffmpeg(stream) {
  const resolutions = [
    {
      size: "854x480",
      name: "480p30",
      fps: 30,
      videoBitrate: "256k",
    },
    {
      size: "1280x720",
      name: "720p30",
      fps: 30,
      videoBitrate: "768k",
    },
  ];

  const cudaOptions = useGPU ? ["-hwaccel cuda"] : [];
  const command = FfmpegCommand()
    .input(stream)
    .inputOption(cudaOptions)
    .on("start", console.log);

  resolutions.forEach(({ size, name, fps, videoBitrate }) => {
    const hlsOptions = [
      "-hls_list_size 3",
      "-hls_delete_threshold 1",
      "-hls_flags delete_segments",
      "-strftime 1",
    ];
    const codec = useGPU ? "hevc_nvenc" : "libx264";

    command
      .format("hls")
      .output(`hls/${name}.m3u8`)
      .outputOption(hlsOptions)
      .videoCodec(codec)
      .videoBitrate(videoBitrate)
      .size(size)
      .fps(fps);
  });

  command.on("error", (error) => {
    console.error(error);

    command.run();
  });

  command.run();
}

module.exports = ffmpeg;
