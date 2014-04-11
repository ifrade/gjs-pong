/*jshint moz: true, camelcase: false, nomen: false */
/*global imports, print*/

imports.gi.versions.Gst = '1.0';

const Lang = imports.lang;
const Gst = imports.gi.Gst;
const Gio = imports.gi.Gio;

Gst.init(null, 0);

const SoundBox = new Lang.Class({
    Name: "SoundBox",

    _init: function (pongFilename) {
        let file = Gio.file_new_for_path(pongFilename);
        this.playPong = new Gst.Pipeline({ name: "pong"});

        this.fileSrc = Gst.ElementFactory.make("filesrc", "fileSrc");
        this.fileSrc.set_property("location", file.get_path());

        this.wavparse = Gst.ElementFactory.make("wavparse", "wavparse");
        this.panorama = Gst.ElementFactory.make("audiopanorama", "p");
        this.panorama.set_property("panorama", 0);

        this.volume = Gst.ElementFactory.make("volume", "v");
        this.volume.set_property("volume", 1);

        this.sink = Gst.ElementFactory.make("pulsesink", "sink");

        this.playPong.add(this.fileSrc);
        this.playPong.add(this.wavparse);
        this.playPong.add(this.panorama);
        this.playPong.add(this.volume);
        this.playPong.add(this.sink);

        this.fileSrc.link(this.wavparse);
        this.wavparse.link(this.panorama);
        
        this.panorama.link(this.volume);
        this.volume.link(this.sink);
    },

    pong: function (inputPos) {
        print("Sound on", inputPos);
        let pos = inputPos || 0;
        if (pos < -1 || pos > 1) {
            print("[WARN] sound position must have values in [-1, 1]");
            return;
        }

        this.panorama.set_property("panorama", pos || 0);
        //this.volume.set_property("volume", 1 - Math.abs(pos));
        this.playPong.set_state(Gst.State.NULL);

        let ret = this.playPong.set_state(Gst.State.PLAYING);
        if (ret === Gst.StateChangeReturn.FAILURE) {
            print('Unable to play recording');
        }
    }

});
