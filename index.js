import React from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Platform,
} from "react-native";

const { height, width } = Dimensions.get("window");
import RCTIJKPlayerView from "./src/RCTIJKPlayerView";

const iconSize = 120;

const styles = StyleSheet.create({
  container: {
    top: 100,
    left: 100,
  },
  controllerView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  player: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,1)",
  },
  mediaBtnView: {
    // position: 'absolute',
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  controller: {
    // flex: 1,
    // opacity: this.state.fadeAnim,
  },
  sliderView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
  },
  btn: {
    backgroundColor: "transparent",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: Math.round(height / 2 - iconSize / 2),
    left: Math.round(width / 2 - iconSize / 2),
  },
  progressView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  slider: {},
});


export default class RCTIJKPlayerWithController extends React.Component {
  state = {
    videoWidth: 0,
    videoHeight: 0,
    rotation: 0,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };

  constructor(props) {
    super(props);
    this.rctijkplayer = null;
    this.state.height = this.props.height || height;
    this.state.width = this.props.width || width;
    this.state.left = this.props.left || 0;
    this.state.top = this.props.top || 0;
    Object.assign(this.state, {
      playBackInfo: {},
      fadeAnim: new Animated.Value(1),
      hasController: false,
    });
  }

  componentDidMount() {
    let url = "http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/gear1/prog_index.m3u8";
    // let url = "/Users/cong/Downloads/111.mov";
    // this.rctijkplayer.start({url: url});
    this.playbackInfoUpdater = setInterval(this.rctijkplayer.playbackInfo.bind(this.rctijkplayer), 1000);
    // this.setState({hasController: true,});
  }

  componentWillUnmount() {
    clearInterval(this.playbackInfoUpdater);
  }

  fadeIn() {
    // this.setState({hasController: true, fadeAnim: new Animated.Value(1)});
    // this.showing = true;

    Animated.timing(
      this.state.fadeAnim,
      { toValue: 1 },
    ).start(() => {
      this.setState({ hasController: true });
      this.showing = true;
    });
  }

  fadeOut() {
    this.setState({ hasController: false, fadeAnim: new Animated.Value(0) });
    this.showing = false;
    // Animated.timing(
    //     this.state.fadeAnim,
    //     {toValue: 0}
    // ).start(() => {
    //     this.setState({hasController: false,});
    // });
  }

  hideController() {
    if (this.hideTimout) {
      clearTimeout(this.hideTimout);
    }
    this.hideTimout = setTimeout(this.fadeOut.bind(this), 3000);
  }

  resumePause() {
    if (this.state.playBackInfo.playbackState === RCTIJKPlayerView.PlayBackState.IJKMPMoviePlaybackStatePlaying) {
      this.rctijkplayer.pause();
      if (this.props.onResumePause) {
        this.props.onResumePause({ playbackState: RCTIJKPlayerView.PlayBackState.IJKMPMoviePlaybackStatePaused });
      }
      this.setState({ playBackInfo: Object.assign({}, this.state.playBackInfo, { playbackState: RCTIJKPlayerView.PlayBackState.IJKMPMoviePlaybackStatePaused }) });
    } else {
      this.rctijkplayer.resume();
      if (this.props.onResumePause) {
        this.props.onResumePause({ playbackState: RCTIJKPlayerView.PlayBackState.IJKMPMoviePlaybackStatePlaying });
      }
      this.setState({ playBackInfo: Object.assign({}, this.state.playBackInfo, { playbackState: RCTIJKPlayerView.PlayBackState.IJKMPMoviePlaybackStatePlaying }) });
    }
    this.hideController();
  }

  start(options) {
    let { width, height, rotation } = options;
    this.setState({
      videoWidth: width,
      videoHeight: height,
      rotation: rotation,
    });
    this.rctijkplayer.start(options);
  }


  getController() {
    if (!this.state.hasController) {
      return;
    }
    return (
      <Animated.View style={{ flex: 1, opacity: this.state.fadeAnim }}>
        <View style={styles.mediaBtnView}>
        </View>
        <View style={styles.sliderView}>

        </View>
      </Animated.View>
    );
  }

  onPlayBackInfo(e) {
    if (this.sliderDragging) {
      return;
    }
    this.setState({ playBackInfo: e });
  }

  onValueChange(value) {
    this.sliderDragging = true;
    this.hideController();
  }

  onSlidingComplete(value) {
    this.sliderDragging = false;
    this.rctijkplayer.seekTo(value);
    this.hideController();
  }

  showController() {
    this.fadeIn();
    this.hideController();
  }

  showHideController = () => {
    if (this.showing) {
      this.showing = false;
      this.fadeOut();
    } else {
      this.showing = true;
      this.showController();
    }
    console.log("this.showing", this.showing);
  };


  render() {
    let playerStyle;
    if (Platform.OS == "ios" && this.state.rotation && this.state.videoWidth && this.state.videoHeight) {
      playerStyle = {};
      playerStyle.transform = [{
        rotateZ: `${this.state.rotation}deg`,
      }];
      let videoWidth = this.state.videoWidth;
      let videoHeight = this.state.videoHeight;
      let videoRatio = videoWidth / videoHeight;
      let viewRatio = this.state.width / this.state.height;
      let logicWidth, logicHeight;
      if (videoRatio == viewRatio) {
        logicWidth = this.state.width;
        logicHeight = this.state.height;
      } else if (videoRatio < viewRatio) {
        logicHeight = this.state.height;
        logicWidth = videoRatio * logicHeight;
      } else {
        logicWidth = this.state.width;
        logicHeight = logicWidth / videoRatio;
      }
      if (this.state.rotation == 180) {
        playerStyle.width = logicWidth;
        playerStyle.height = logicHeight;
      } else {
        playerStyle.width = logicHeight;
        playerStyle.height = logicWidth;
      }
    } else {
      playerStyle = styles.player;
    }
    return (<View
        style={[styles.container, {
          left: this.state.left,
          top: this.state.top,
          width: this.state.width,
          height: this.state.height,
          justifyContent: "center",
          alignItems: "center",
        }]}
      >
        <RCTIJKPlayerView
          ref={ref => this.rctijkplayer = ref}
          onPlayBackInfo={(e) => this.onPlayBackInfo(e)}
          style={[playerStyle]}
        />
        <TouchableOpacity
          onPress={this.showHideController}
          style={styles.controllerView}
        >
          {this.getController()}
        </TouchableOpacity>
      </View>
    );
  }
}
