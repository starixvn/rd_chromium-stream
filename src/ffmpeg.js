const FfmpegCommand = require("fluent-ffmpeg");

const useGPU = true || process.env.USE_GPU === "true";

function ffmpeg(stream) {
  const resolutions = [
    {
      size: "854x480",
      name: "480p60",
      fps: "60",
      videoBitrate: "256k",
      audioBitrate: 0,
    },
  ];

  const cudaOptions = useGPU ? ["-hwaccel cuda"] : [];
  const command = FfmpegCommand()
    .input(stream)
    .inputOption(cudaOptions)
    .on("start", console.log);

  resolutions.forEach(({ size, name, fps }) => {
    const hlsOptions = [
      "-hls_list_size 3",
      "-hls_delete_threshold 1",
      "-hls_flags delete_segments",
      "-strftime 1",
    ];
    const codec = useGPU ? "hevc_nvenc" : "libx265";

    command
      .size(size)
      .videoCodec(codec)
      .fps(fps)
      .format("hls")
      .output(`hls/${name}.m3u8`)
      .outputOption(hlsOptions);
  });

  command.on("error", (error) => {
    console.error(error);

    command.run();
  });

  command.run();
}

module.exports = ffmpeg;
