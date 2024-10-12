module.exports = {
    event: 'trackEnd',
    run: async (client, player, track, dispatcher) => {
        dispatcher.previous = dispatcher.current;
        dispatcher.current = null;
        const m = await dispatcher.nowPlayingMessage?.fetch().catch(() => {});
        if (dispatcher.loop === "repeat") dispatcher.queue.unshift(track);
        if (dispatcher.loop === "queue") dispatcher.queue.push(track);
        await dispatcher.play();
        if (dispatcher.autoplay) {
        await dispatcher.Autoplay(track);
        }
        if (m && m.deletable) await                       m.delete().catch(() => {});
    }
};