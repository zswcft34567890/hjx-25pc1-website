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
    // preAttributes 给 <pre> 自动加上 line-numbers 类，让 Prism line-numbers 插件接管。
    // 注意：不要设置 codeAttributes.class = ""，否则会把默认的 "language-xxx" class 清掉，
    // 导致 line-numbers / toolbar 插件识别不到语言、拒绝注入行号和按钮。
    eleventyConfig.addPlugin(syntaxHighlight, {
        templateFormats: ["md"],
        preAttributes: {
            class: "line-numbers",
        },
    });

    // 注册导航插件
    eleventyConfig.addPlugin(eleventyNavigation);

    // Wiki 集合：递归匹配所有 .md 文件，按 order 排序
    eleventyConfig.addCollection("wiki", (api) => {
        return api.getFilteredByGlob("src/wiki/**/*.md").sort((a, b) => {
            return (a.data.order || 999) - (b.data.order || 999);
        });
    });

    // Event 集合：递归匹配 src/event/ 下的所有 .md 文件，按 order 排序
    eleventyConfig.addCollection("event", (api) => {
        return api.getFilteredByGlob("src/event/**/*.md").sort((a, b) => {
            return (a.data.order || 999) - (b.data.order || 999);
        });
    });

    // Article 集合：递归匹配 src/article/ 下的所有 .md 文件，按 order 排序
    eleventyConfig.addCollection("article", (api) => {
        return api.getFilteredByGlob("src/article/**/*.md").sort((a, b) => {
            return (a.data.order || 999) - (b.data.order || 999);
        });
    });

    // Zone 集合：匹配 src/zone/*.md 顶层文件，按 order 排序
    // 用于首页「专区入口」卡片和 zone.md 分区列表的数据驱动
    eleventyConfig.addCollection("zone", (api) => {
        return api.getFilteredByGlob("src/zone/*.md").sort((a, b) => {
            return (a.data.order || 999) - (b.data.order || 999);
        });
    });

    // Wiki 按分类分组：按父目录归类，用于侧边栏独立导航
    // 数据结构：[{ name, label, pages: [...] }, ...]
    // - name：分类标识（顶层为 "all"）
    // - label：分类显示名（取自 frontmatter 的 wikiCategory，否则用目录名）
    // - pages：该分类下的所有页面
    eleventyConfig.addCollection("wikiByCategory", (api) => {
        const all = api.getFilteredByGlob("src/wiki/**/*.md");
        const groups = new Map();

        for (const page of all) {
            // 提取分类：相对 src/wiki/ 的父目录路径
            const relPath = page.inputPath.replace(/\\/g, "/");
            const match = relPath.match(/src\/wiki\/(.*)\/[^/]+\.md$/);
            const category = match ? match[1] : "_root";

            if (!groups.has(category)) {
                groups.set(category, []);
            }
            groups.get(category).push(page);
        }

        // 转成数组并排序：分类按 wikiCategoryOrder，页内按 order
        const result = [];
        for (const [category, pages] of groups) {
            const sortedPages = pages.sort((a, b) => {
                return (a.data.order || 999) - (b.data.order || 999);
            });
            // 取分类的 label 和 order（用第一页的 frontmatter）
            const first = sortedPages[0];
            result.push({
                name: category,
                label: first.data.wikiCategory || category,
                order: first.data.wikiCategoryOrder ?? 999,
                pages: sortedPages
            });
        }
        result.sort((a, b) => a.order - b.order);
        return result;
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
            // 自适应质量：仅 webp 和 jpeg 应用，png 不受影响
            qualityFormatMap: {
                webp: 80,
                jpeg: 85,
            },
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
