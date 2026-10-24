// 本机装的是 TypeScript 7（原生版），没有旧的 ts.sys 接口，Remotion 的 esbuild-loader 读取 tsconfig 时会报错。
// 这里直接给 loader 一个 tsconfigRaw，让它跳过读取步骤。用 TypeScript 5.x 的电脑上这段不起作用，也不影响。
export const webpackOverride = (config) => {
  const patch = (rules) => rules?.forEach((r) => {
    if (!r || typeof r !== 'object') return;
    const uses = Array.isArray(r.use) ? r.use : r.use ? [r.use] : [];
    uses.forEach((u) => { if (u && typeof u === 'object' && String(u.loader).includes('esbuild-loader')) u.options = { ...u.options, tsconfigRaw: {} }; });
    if (r.oneOf) patch(r.oneOf);
    if (r.rules) patch(r.rules);
  });
  patch(config.module?.rules);
  return config;
};
