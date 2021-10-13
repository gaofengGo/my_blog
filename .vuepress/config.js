const sidebar = require("./sidebar");
module.exports = {
  title: "博客",
  description: "gaofeng的博客",
  base: "/",
  theme: "reco",
  themeConfig: {
    // 类型为博客
    type: "blog",
    // 是否自动展开右侧子导航
    subSidebar: "auto",
    nav: [
      { text: "主页", link: "/", icon: "reco-home" },
      { text: "时间轴", link: "/timeline/", icon: "reco-date" },
    ],
    sidebar,
    // 博客信息
    author: "gaofeng",
    authorAvatar: "/avatar.jpg",
    logo: "/logo.png",
    startYear: "2021",
    // 博客配置
    blogConfig: {
      category: {
        location: 2,
        text: "目录索引",
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: "标签索引", // 默认文案 “标签”
      },
      socialLinks: [
        { icon: "reco-github", link: "https://github.com/GaoFengGo" },
        {
          icon: "reco-juejin",
          link: "https://juejin.cn/user/1116759542728798",
        },
      ],
    },
  },
};
