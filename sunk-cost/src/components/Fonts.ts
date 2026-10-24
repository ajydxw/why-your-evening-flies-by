import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
// 字体随工程一起打包在 public/fonts，换电脑也能渲染出一样的效果
loadFont({ family: 'Noto Sans SC', url: staticFile('fonts/NotoSansSC-Bold.otf'), weight: '700' });
loadFont({ family: 'Noto Sans SC', url: staticFile('fonts/NotoSansSC-Black.otf'), weight: '900' });
