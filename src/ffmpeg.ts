import Command from "fluent-ffmpeg";
import { ok } from "assert";
import logger from "./logger";

export interface FFmpegOptions {
  stream: string | any;
  gpu?: boolean;
  output?: string;
  resolutions: {
    size: string;
    aspect: string;
    name: string;
    fps: number;
    videoBitrate: string;
  }[];
  onError?: (error?: Error) => void;
}

export default function ffmpeg(options: FFmpegOptions) {
  ok(!!options);
  ok(!!options.stream);
  ok(!!options.resolutions);

  const gpu = options.gpu ? ["-hwaccel cuvid"] : [];
  const codec = options.gpu ? "h264_nvenc" : "libx264";

  const output = options.output || "hls";

  const command = Command()
    .input(options.stream)
    .inputOption(gpu)
    .on("start", (command) => logger.info(command))
    .on("error", (error) => {
      logger.error(error);

      if (options.onError) {
        options.onError(error);
      }
    });

  options.resolutions.forEach(({ size, name, fps, videoBitrate, aspect }) => {
    const hlsOptions = [
      "-hls_list_size 3",
      "-hls_delete_threshold 1",
      "-hls_flags delete_segments",
      "-strftime 1",
    ];

    command
      .format("hls")
      .output(`${output}/${name}.m3u8`)
      .outputOption(hlsOptions)
      .aspect(aspect)
      .videoCodec(codec)
      .videoBitrate(videoBitrate)
      .size(size)
      .fps(fps);
  });

  command.run();
}
