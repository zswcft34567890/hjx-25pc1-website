const sass = require("sass");
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");

// 编译 Sass + PostCSS（Autoprefixer）函数
async function compileSass() {
    try {
        const result = sass.compile("src/style/style.scss", { style: "compressed" });
        const postcssResult = await postcss([autoprefixer()]).process(result.css, { from: "src/style/style.css" });
        fs.mkdirSync("_site/style", { recursive: true });
        fs.writeFileSync("_site/style/style.css", postcssResult.css);
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

    // Image shortcode for responsive images
    eleventyConfig.addShortcode("image", async function (src, alt, widths = [300, 600]) {
        const fullPath = path.join(path.dirname(this.page.inputPath), src);

        const options = {
            widths: widths,
            formats: ["webp", "jpeg"],
            outputDir: "_site/img/",
            urlPath: "/img/"
        };

        const stats = await Image(fullPath, options);
        const webp = stats.webp;
        const jpeg = stats.jpeg;

        return `<picture>
            ${webp.map((entry) => `<source type="image/webp" srcset="${entry.srcset}">`).join("\n")}
            <img src="${jpeg[0].url}" width="${jpeg[0].width}" height="${jpeg[0].height}" alt="${alt}" loading="lazy" decoding="async">
        </picture>`;
    });

    // 将资源文件原样复制到输出目录
    eleventyConfig.addPassthroughCopy('src/style/prism-theme.css');
    eleventyConfig.addPassthroughCopy({ 'src/js': 'js' });
    eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });

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
        pathPrefix: "/hjx-25pc1-website/",
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
