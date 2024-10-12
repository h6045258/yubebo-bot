class Song {
  constructor(track, user) {
      if (!track) throw new Error('Track is not provided');
      this.encoded = track.encoded;
      this.info = {
          ...track.info,
          requester: user,
      };
  }
}

class Dispatcher {
  constructor(options) {
      this.history = [];
      this.client = options.client;
      this.guildId = options.guildId;
      this.channelId = options.channelId;
      this.player = options.player;
      this.queue = [];
      this.stopped = false;
      this.previous = null;
      this.current = null;
      this.loop = 'off';
      this.repeat = 0;
      this.node = options.node;
      this.shuffle = false;
      this.paused = false;
      this.filters = [];
      this.autoplay = false;
      this.nowPlayingMessage = null;
      this.player
          .on('start', () => this.client.shoukaku.emit('trackStart', this.player, this.current, this))
          .on('end', () => {
              if (!this.queue.length) this.client.shoukaku.emit('queueEnd', this.player, this.current, this);
              this.client.shoukaku.emit('trackEnd', this.player, this.current, this);
          })
          .on('stuck', () => this.client.shoukaku.emit('trackStuck', this.player, this.current))
          .on('closed', (...arr) => {
              this.client.shoukaku.emit('socketClosed', this.player, ...arr);
          });
  }

  get exists() {
      return this.client.queue.has(this.guildId);
  }

  get volume() {
      return this.player.volume;
  }

  async play() {
      if (!this.exists || (!this.queue.length && !this.current)) {
          return;
      }
      this.current = this.queue.length !== 0 ? this.queue.shift() : this.queue[0];
      if (!this.current) return;
      this.player.playTrack({ track: this.current?.encoded });
      if (this.current) {
          this.history.push(this.current);
          if (this.history.length > 100) {
              this.history.shift();
          }
      }
  }

  pause() {
      if (!this.player) return;
      if (!this.paused) {
          this.player.setPaused(true);
          this.paused = true;
      } else {
          this.player.setPaused(false);
          this.paused = false;
      }
  }

  remove(index) {
      if (!this.player) return;
      if (index > this.queue.length) return;
      this.queue.splice(index, 1);
  }

  previousTrack() {
      if (!this.player) return;
      if (!this.previous) return;
      this.queue.unshift(this.previous);
      this.player.stopTrack();
  }

  destroy() {
      this.queue.length = 0;
      this.history = [];
      this.client.shoukaku.leaveVoiceChannel(this.guildId);
      this.client.queue.delete(this.guildId);
      if (this.stopped) return;
      this.client.shoukaku.emit('playerDestroy', this.player);
  }

  setShuffle(shuffle) {
      if (!this.player) return;
      this.shuffle = shuffle;
      if (shuffle) {
          const current = this.queue.shift();
          this.queue = this.queue.sort(() => Math.random() - 0.5);
          this.queue.unshift(current);
      } else {
          const current = this.queue.shift();
          this.queue = this.queue.sort((a, b) => a - b);
          this.queue.unshift(current);
      }
  }

  async skip(skipto = 1) {
      if (!this.player) return;
      if (skipto > 1) {
          if (skipto > this.queue.length) {
              this.queue.length = 0;
          } else {
              this.queue.splice(0, skipto - 1);
          }
      }
      this.repeat = this.repeat == 1 ? 0 : this.repeat;
      this.player.stopTrack();
  }

  seek(time) {
      if (!this.player) return;
      this.player.seekTo(time);
  }

  stop() {
      if (!this.player) return;
      this.queue.length = 0;
      this.history = [];
      this.loop = 'off';
      this.autoplay = false;
      this.repeat = 0;
      this.stopped = true;
      this.player.stopTrack();
  }

  setLoop(loop) {
      this.loop = loop;
  }

  buildTrack(track, user) {
      return new Song(track, user);
  }

  async isPlaying() {
      if (this.queue.length && !this.current && !this.player.paused) {
          this.play();
      }
  }

  async smartSearch(queries) {
      const searchEngines = ['ytmsearch', 'spotify', 'ytsearch', 'soundcloud'];
      for (const query of queries) {
          for (const engine of searchEngines) {
              const resolve = await this.node.rest.resolve(`${engine}:${query}`);
              if (resolve && resolve?.data && Array.isArray(resolve.data) && resolve.data.length > 0) {
                  return resolve.data;
              }
          }
      }
      return null;
  }

  async Autoplay(song) {

      const queries = [
          song.info.author,
          song.info.title,
          `${song.info.author} ${song.info.title}`
      ];

      let metadata = await this.smartSearch(queries);
      let choosed = null;
      const maxAttempts = 50;
      let attempts = 0;
      while (attempts < maxAttempts) {
          const potentialChoice = this.buildTrack(
              metadata[Math.floor(Math.random() * Math.floor(metadata.length))],
              this.client.user,
          );
          if (
              !this.queue.some(
                  (s) => s.encoded === potentialChoice.encoded,
              ) &&
              !this.history.some((s) => s.encoded === potentialChoice.encoded)
          ) {
              choosed = potentialChoice;
              break;
          }
          attempts++;
      }
      if (choosed) {
          this.queue.push(choosed);
          return await this.isPlaying();
      }
      return this.destroy();
  }


  async setAutoplay(autoplay) {
      this.autoplay = autoplay;
      if (autoplay) {
          this.Autoplay(this.current ? this.current : this.queue[0]);
      }
  }
}

module.exports = Dispatcher;
