/*{pkgs}: {
  deps = [
    pkgs.postgresql
    pkgs.ffmpeg_6-full
    pkgs.gt
   ];
} */
{ pkgs }: {
  deps = [
    pkgs.libuuid       # Adding the libuuid dependency
    pkgs.cmake         # If you need cmake for building native modules
    pkgs.ffmpeg_6-full
    pkgs.gt       # If you need Python for any reason.
  ];
}