const sass = require("sass");
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigation = require("@11ty/eleventy-navigation");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");

// 编译 Sass + PostCSS（Autoprefixer）函数
// 扫描 src/style/ 下所有非 _ 前缀的 .scss 文件作为编译入口，分别输出为独立 CSS
async function compileSass() {
    try {
        const styleDir = "src/style";
        const outDir = "_site/style";
        fs.mkdirSync(outDir, { recursive: true });

        const entries = fs.readdirSync(styleDir)
            .filter(f => f.endsWith(".scss") && !f.startsWith("_"))
            .sort();

        for (const file of entries) {
            const srcPath = path.join(styleDir, file);
            const destName = file.replace(/\.scss$/, ".css");
            const result = sass.compile(srcPath, { style: "compressed" });
            const postcssResult = await postcss([autoprefixer()]).process(result.css, { from: path.join(styleDir, destName) });
            fs.writeFileSync(path.join(outDir, destName), postcssResult.css);
        }
    } catch (error) {
        console.error("[Sass/PostCSS] 编译失败:", error.message || error);
        throw error;
    }
}

module.exports = function (eleventyConfig) {
    // 允许处理的模板格式：Markdown + Nunjucks
    eleventyConfig.setTemplateFormats(['md', 'njk']);

    // 注册语法高亮插件，仅在 Markdown 文件中启用
    eleventyConfig.addPlugin(syntaxHighlight, { templateFormats: ["md"] });

    // 注册导航插件
    eleventyConfig.addPlugin(eleventyNavigation);

    // Wiki 集合：按 order 排序
    eleventyConfig.addCollection("wiki", (api) => {
        return api.getFilteredByGlob("src/wiki/*.md").sort((a, b) => {
            return (a.data.order || 999) - (b.data.order || 999);
        });
    });

    // Image shortcode for responsive images
    eleventyConfig.addShortcode("image", async function (json) {
        const { src, alt = "", widths = [300, 600] } = JSON.parse(json);
        const fullPath = path.join("src", src);

        const stats = await Image(fullPath, {
            widths,
            formats: ["webp", "jpeg"],
            outputDir: "_site/img/",
            urlPath: "/img/",
        });

        return `<picture>
                ${stats.webp.map(e => `<source type="image/webp" srcset="${e.srcset}">`).join("\n")}
                <img src="${stats.jpeg[0].url}" width="${stats.jpeg[0].width}" height="${stats.jpeg[0].height}" alt="${alt}" loading="lazy" decoding="async">
            </picture>`;
    });

    // 将资源文件原样复制到输出目录
    eleventyConfig.addPassthroughCopy('src/assets');
    eleventyConfig.addPassthroughCopy('src/js');

    // 构建前编译 Sass
    eleventyConfig.on("beforeBuild", compileSass);

    // 监听 style/ 目录变化
    eleventyConfig.addWatchTarget("src/style/");

    // .scss 文件变化时重新编译
    eleventyConfig.on("watch", async (changedFiles) => {
        if (changedFiles.some(f => f.endsWith(".scss"))) {
            await compileSass();
        }
    });

    return {
        pathPrefix: "/",
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data"
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        templateFormats: ["njk", "html", "md"]
    };
};
