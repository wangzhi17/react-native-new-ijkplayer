package cn.wangzhi.ijkplayer;

import android.app.Activity;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class RCTIJKPlayerViewManager extends ViewGroupManager<RCTIJKPlayerView> {
    private final String REACT_CLASS = "RCTIJKPlayerManager";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public RCTIJKPlayerView createViewInstance(ThemedReactContext context) {
        return new RCTIJKPlayerView(context);
    }

}
