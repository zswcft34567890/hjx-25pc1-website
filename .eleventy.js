module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/style");
    eleventyConfig.addWatchTarget("src/style/");

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
