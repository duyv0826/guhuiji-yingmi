/* ============================================================
   骨灰级 · 单文件构建
   把 css/main.css 与 js/config.js、js/engine.js 内联进 index.html，
   产出 dist/guhuiji.html——发给任何人，双击即玩，零目录依赖。
   用法：node build.mjs
   ============================================================ */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST_NAME = "guhuiji.html";

const html = await readFile(join(ROOT, "index.html"), "utf8");
const css = await readFile(join(ROOT, "css", "main.css"), "utf8");
const configJs = await readFile(join(ROOT, "js", "config.js"), "utf8");
const engineJs = await readFile(join(ROOT, "js", "engine.js"), "utf8");

let out = html.replace(
  /<link rel="stylesheet" href="css\/main.css">/,
  `<style>\n${css}\n</style>`
);

const scripts = [
  ["js/config.js", configJs],
  ["js/engine.js", engineJs]
];
for (const [src, code] of scripts) {
  const tag = `<script src="${src}"></script>`;
  if (!out.includes(tag)) {
    throw new Error(`index.html 中找不到 ${tag}，构建终止`);
  }
  // </script> 内联时必须转义，否则会提前闭合标签
  out = out.replace(tag, `<script>\n${code.replace(/<\/script>/g, "<\\/script>")}\n</script>`);
}

if (/<link rel="stylesheet"|<script src=/.test(out)) {
  throw new Error("仍有未内联的外部引用，构建终止");
}

await mkdir(join(ROOT, "dist"), { recursive: true });
await writeFile(join(ROOT, "dist", DIST_NAME), out, "utf8");
console.log(`构建完成: dist/${DIST_NAME} (${(out.length / 1024).toFixed(1)} KB)`);
