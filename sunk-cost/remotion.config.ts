import { Config } from '@remotion/cli/config';
// @ts-ignore
import { webpackOverride } from './tools/webpack-override.mjs';
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(2);
Config.overrideWebpackConfig(webpackOverride);
