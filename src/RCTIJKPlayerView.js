import React, { PureComponent } from "react";
import { NativeAppEventEmitter, NativeModules, requireNativeComponent, StyleSheet, View } from "react-native";

const { RCTIJKPlayerModule } = NativeModules;
const IJKPlayerView = requireNativeComponent("RCTIJKPlayerManager");

function convertNativeProps(props) {
  return { ...props };
}

export default class RCTIJKPlayerView extends PureComponent {

  static PlayBackState = {
    IJKMPMoviePlaybackStateStopped: 0,
    IJKMPMoviePlaybackStatePlaying: 1,
    IJKMPMoviePlaybackStatePaused: 2,
    IJKMPMoviePlaybackStateInterrupted: 3,
    IJKMPMoviePlaybackStateSeekingForward: 4,
    IJKMPMoviePlaybackStateSeekingBackward: 5,
  };

  static propTypes = {
    ...View.propTypes,
    // push_url: PropTypes.string,
    // onLiveStateChange: PropTypes.func,
  };

  static defaultProps = {};

  setNativeProps(props) {
    this.IjkPlayerRef.setNativeProps(props);
  }

  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: false,
      isRecording: false,
    };
  }

  _onPlayBackStateChange = () => {

  };

  componentDidMount() {
    this.playBackStateChangeListener = NativeAppEventEmitter.addListener("PlayBackState", this._onPlayBackStateChange);
  }

  componentWillUnmount() {
    this.playBackStateChangeListener.remove();
    this.stop();
    this.shutdown();
  }

  render() {
    const style = [styles.base, this.props.style];
    const nativeProps = convertNativeProps(this.props);

    return <IJKPlayerView ref={ref => this.IjkPlayerRef = ref} {...nativeProps} />;
  }

  start(options) {
    console.log("ijkplayer index start begin");
    return RCTIJKPlayerModule.start(options);
  }

  stop() {
    console.log("stop");
    RCTIJKPlayerModule.stop();
  }

  resume() {
    console.log("resume");
    RCTIJKPlayerModule.resume();
  }

  pause() {
    console.log("pause");
    RCTIJKPlayerModule.pause();
  }

  shutdown() {
    console.log("shutdown");
    RCTIJKPlayerModule.shutdown();
  }

  seekTo(currentPlaybackTime) {
    console.log("seekTo ", currentPlaybackTime);
    RCTIJKPlayerModule.seekTo(currentPlaybackTime);
  }

  playbackInfo() {
    let self = this;
    return RCTIJKPlayerModule.playbackInfo()
      .then(data => {
        for (var k in data) {
          if (data.hasOwnProperty(k)) {
            data[k] = +data[k];
          }

        }
        // console.log(data);
        if (self.props.onPlayBackInfo) self.props.onPlayBackInfo(data);
      }).catch(error => console.log("error", error));
  }
}


const styles = StyleSheet.create({
  base: {},
});
