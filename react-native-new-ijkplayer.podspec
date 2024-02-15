require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name            = "react-native-new-ijkplayer"
  s.version         = package["version"]
  s.summary         = package["description"]
  s.description     = package["description"]
  s.homepage        = package["homepage"]
  s.license         = package["license"]
  s.platforms       = { :ios => "8.0" }
  s.author          = package["author"]
  s.source          = { :git => package["repository"], :tag => "#{s.version}" }

  s.source_files    = "ios/**/*.{h,m,mm,swift}"
  s.dependency "React"
  s.dependency "IJKMediaFramework" '~>0.1.5'

  s.frameworks = "AVFoundation", "CoreMedia", 'VideoToolbox', 'AudioToolbox', 'Foundation','GLKit','CoreGraphics','CoreVideo','OpenGLES','QuartzCore','MediaPlayer','MobileCoreServices','UIKit'

  s.libraries = 'c++','bz2','z'

  install_modules_dependencies(s)
end
