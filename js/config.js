/* ============================================================
   骨灰级影迷 · 全部内容配置
   与游戏版（guhuiji）共用同一引擎（engine.js 原样复制）——
   本文件是「换皮零改引擎」的全部改动量。
   ============================================================ */
window.GUIHUIJI_CONFIG = {

  /* —— 站点元信息 —— */
  meta: {
    title: "骨灰级影迷 · 资深者认证所",
    wordmark: "骨灰级影迷",
    nav: [
      { href: "#origin", label: "词源" },
      { href: "#eras", label: "影史" },
      { href: "#exam", label: "认证" }
    ],
    hero: {
      kicker: "词出录像厅与碟房年代 · 资深影迷自证之词",
      title: "骨灰级影迷",
      sub: "影迷社群里资历的最高阶。这一页把词拆开重装：一部影史刻度，一场硬考。全对，才算烧透。",
      cta: "进入影迷认证"
    }
  },

  /* —— 章节结构（类型不变，只换标题与内容） —— */
  sections: [
    { id: "origin", type: "dictionary", index: "01", title: "词源考" },
    { id: "eras", type: "timeline", index: "02", title: "影史刻度" },
    { id: "exam", type: "quiz", index: "03", title: "骨灰级影迷认证考试" }
  ],

  /* —— 主题（色板与游戏版一致：换皮不换气质） —— */
  themes: {
    default: "cartridge",
    list: {
      cartridge: {
        label: "胶片模式",
        tokens: {
          "--ink": "#1A1713",
          "--ink-soft": "#4A443C",
          "--ink-faint": "rgba(26, 23, 19, 0.38)",
          "--paper": "#F3EFE4",
          "--paper-dim": "#E9E3D3",
          "--line": "rgba(26, 23, 19, 0.16)",
          "--accent": "#C0271D",
          "--accent-deep": "#8E1D15",
          "--accent-soft": "#C98A2D",
          "--accent-glow": "#D9A441",
          "--teal": "#33685C",
          "--on-accent": "#F3EFE4",
          "--scan-ink": "rgba(243, 239, 228, 0.05)",
          "--shadow-ghost": "rgba(243, 239, 228, 0.22)",
          "--hero-bg": "#1A1713",
          "--hero-fg": "#F3EFE4"
        }
      },
      terminal: {
        label: "放映模式",
        tokens: {
          "--ink": "#CBE6CF",
          "--ink-soft": "#A3C2A6",
          "--ink-faint": "rgba(203, 230, 207, 0.35)",
          "--paper": "#0E120F",
          "--paper-dim": "#151B16",
          "--line": "rgba(203, 230, 207, 0.16)",
          "--accent": "#3FBF7F",
          "--accent-deep": "#2E8F60",
          "--accent-soft": "#8FD9AC",
          "--accent-glow": "#5FCF8E",
          "--teal": "#357963",
          "--on-accent": "#0B0F0C",
          "--scan-ink": "rgba(203, 230, 207, 0.05)",
          "--shadow-ghost": "rgba(203, 230, 207, 0.14)",
          "--hero-bg": "#0A0D0B",
          "--hero-fg": "#CBE6CF"
        }
      },
      amber: {
        label: "暗房模式",
        tokens: {
          "--ink": "#241505",
          "--ink-soft": "#5B4630",
          "--ink-faint": "rgba(36, 21, 5, 0.38)",
          "--paper": "#F2E3C8",
          "--paper-dim": "#E8D4AF",
          "--line": "rgba(36, 21, 5, 0.18)",
          "--accent": "#B4610F",
          "--accent-deep": "#8C4A0B",
          "--accent-soft": "#C07A2E",
          "--accent-glow": "#E09A3E",
          "--teal": "#7A5230",
          "--on-accent": "#F7EBD3",
          "--scan-ink": "rgba(242, 227, 200, 0.06)",
          "--shadow-ghost": "rgba(36, 21, 5, 0.18)",
          "--hero-bg": "#1C1207",
          "--hero-fg": "#F2E3C8"
        }
      }
    }
  },

  /* —— 跑马灯：影史节点 —— */
  ticker: [
    "1895 电影诞生",
    "1927 有声革命",
    "1941 现代叙事分水岭",
    "1960 新浪潮上桌",
    "1977 大片时代",
    "1994 神片大年",
    "2009 3D 世代"
  ],

  /* —— 词源考 —— */
  dictionary: {
    word: "骨灰级影迷",
    pinyin: "gǔ huī jí yǐng mí",
    pos: "名词 · 常作定语",
    labels: {
      senses: "释义",
      origin: "词源",
      usage: "用法",
      caveat: "存疑"
    },
    senses: [
      "影龄横跨胶片、录像带、DVD 到流媒体多个技术世代，观影量大且至今仍在买票进场的资深影迷。",
      "泛化用法：对电影钻研到考据癖程度的人，如骨灰级 CULT 片迷、骨灰级影史考据党。"
    ],
    origin: "通行说法承自游戏圈的「骨灰级」，约 2000 年代前后被影评论坛与碟友社群接走：碟架换了几轮，录像厅倒了又开，看到烧成灰还在买票。确切首例难以考订，特此存疑。",
    usage: "从录像厅一路熬到流媒体的那批人，才算真骨灰级影迷。",
    caveat: "「骨灰级影迷」的确切首例出处难以考订，本页不作断言；有更早的纸面用例，欢迎来打脸。"
  },

  /* —— 影史刻度（均为公开可查证事实） —— */
  eras: [
    { year: "1895", name: "电影诞生", line: "卢米埃尔兄弟在巴黎卖出门票，电影第一次收钱营业。" },
    { year: "1927", name: "有声革命", line: "《爵士歌王》开口说话，默片时代开始倒计时。" },
    { year: "1941", name: "现代叙事分水岭", line: "《公民凯恩》把闪回与景深玩成电影语言。" },
    { year: "1960", name: "新浪潮上桌", line: "《精疲力尽》跳接登场，导演从此可以署名「作者」。" },
    { year: "1977", name: "大片时代", line: "《星球大战》把 Blockbuster 变成商业模式。" },
    { year: "1994", name: "神片大年", line: "《肖申克》《阿甘》《低俗小说》同年撞车。" },
    { year: "2009", name: "3D 世代", line: "《阿凡达》让影院重新变成非去不可的地方。" }
  ],

  /* —— 认证考试 —— */
  quiz: {
    modes: [
      { id: "daily", tag: "D", name: "每日挑战", count: 10, seed: "daily", secondsPerQuestion: null,
        desc: "以当日日期为种子排片——今天，所有人同一张卷。" },
      { id: "random", tag: "R", name: "随机十题", count: 10, seed: null, secondsPerQuestion: null,
        desc: "片单随机抽十题，答错即补课。" },
      { id: "hardcore", tag: "H", name: "骨灰二十", count: 20, seed: null, secondsPerQuestion: 20,
        desc: "全片单二十题，每题限时二十秒，超时即误答。" }
    ],

    intro: {
      title: "认证考试",
      rules: [
        "题目全部是可公开查证的事实，不带观点。",
        "每题四选一；答错或超时立即公布正解与出处。",
        "全对才发认证编号；成绩档案只存在你自己的浏览器里。"
      ]
    },

    ui: {
      start: "开始考试",
      next: "下一题",
      toResult: "查看结果",
      retry: "重考",
      correct: "正解",
      wrong: "误答",
      timeout: "超时",
      source: "出处",
      certTag: "骨灰级影迷认证所",
      scoreLabel: "得分",
      modeLabel: "模式",
      serialLabel: "编号",
      dateLabel: "日期",
      serialPrefix: "YMG",
      noSerial: "未获编号——全对才有",
      share: "保存分享卡",
      statsTemplate: "这是你的第 {n} 局 · {mode} 最佳 {best} / {total}",
      progress: "{i} / {total}",
      optionFormat: "{letter}．{text}",
      optionLetters: ["A", "B", "C", "D"]
    },

    questions: [
      {
        prompt: "《公民凯恩》的导演是？",
        options: ["阿尔弗雷德·希区柯克", "奥逊·威尔斯", "斯坦利·库布里克", "黑泽明"],
        answerIndex: 1,
        fact: "奥逊·威尔斯 1941 年自导自演。"
      },
      {
        prompt: "《肖申克的救赎》改编自哪位作家的小说？",
        options: ["斯蒂芬·金", "乔治·R·R·马丁", "迈克尔·克莱顿", "威廉·吉布森"],
        answerIndex: 0,
        fact: "斯蒂芬·金中篇《丽塔·海华丝与肖申克的救赎》，电影 1994 年上映。"
      },
      {
        prompt: "《教父》的导演是？",
        options: ["马丁·斯科塞斯", "布莱恩·德·帕尔玛", "弗朗西斯·福特·科波拉", "奥利弗·斯通"],
        answerIndex: 2,
        fact: "科波拉执导，1972 年上映。"
      },
      {
        prompt: "1895 年首次售票放映电影的兄弟俩是？",
        options: ["卢米埃尔兄弟", "华纳兄弟", "科恩兄弟", "马克思兄弟"],
        answerIndex: 0,
        fact: "卢米埃尔兄弟，1895 年 12 月 28 日巴黎大咖啡馆。"
      },
      {
        prompt: "公认的第一部有声长片（对白片）是？",
        options: ["《爵士歌王》", "《雨中曲》", "《摩登时代》", "《一个国家的诞生》"],
        answerIndex: 0,
        fact: "1927 年《爵士歌王》（The Jazz Singer）。"
      },
      {
        prompt: "《星球大战》正传第一部上映年份是？",
        options: ["1975", "1976", "1977", "1979"],
        answerIndex: 2,
        fact: "1977 年 5 月 25 日北美上映。"
      },
      {
        prompt: "昆汀·塔伦蒂诺 1994 年的代表作是？",
        options: ["《落水狗》", "《低俗小说》", "《杀死比尔》", "《无耻混蛋》"],
        answerIndex: 1,
        fact: "《低俗小说》，1994 年戛纳金棕榈。"
      },
      {
        prompt: "《阿凡达》的导演是？",
        options: ["彼得·杰克逊", "乔治·卢卡斯", "詹姆斯·卡梅隆", "史蒂文·斯皮尔伯格"],
        answerIndex: 2,
        fact: "詹姆斯·卡梅隆，2009 年上映。"
      },
      {
        prompt: "黑泽明《七武士》的上映年份是？",
        options: ["1950", "1954", "1958", "1962"],
        answerIndex: 1,
        fact: "1954 年。"
      },
      {
        prompt: "希区柯克《惊魂记》（Psycho）上映于？",
        options: ["1958", "1960", "1963", "1965"],
        answerIndex: 1,
        fact: "1960 年。"
      },
      {
        prompt: "卓别林「流浪汉」形象的标志性道具是？",
        options: ["圆顶礼帽与手杖", "眼镜与烟斗", "白手套", "单片眼镜"],
        answerIndex: 0,
        fact: "圆顶礼帽、手杖、小胡子，默片喜剧的标杆造型。"
      },
      {
        prompt: "王家卫《花样年华》的男主角是？",
        options: ["张国荣", "梁朝伟", "周润发", "刘德华"],
        answerIndex: 1,
        fact: "梁朝伟凭本片获 2000 年戛纳最佳男演员。"
      },
      {
        prompt: "《泰坦尼克号》共获得几项奥斯卡奖？",
        options: ["8 项", "9 项", "11 项", "14 项"],
        answerIndex: 2,
        fact: "1998 年获 11 项，追平《宾虚》纪录。"
      },
      {
        prompt: "戈达尔《精疲力尽》上映于？",
        options: ["1958", "1960", "1962", "1964"],
        answerIndex: 1,
        fact: "1960 年，法国新浪潮代表作。"
      },
      {
        prompt: "《指环王》三部曲的导演是？",
        options: ["詹姆斯·卡梅隆", "彼得·杰克逊", "吉尔莫·德尔·托罗", "雷德利·斯科特"],
        answerIndex: 1,
        fact: "彼得·杰克逊；《王者归来》横扫 2004 年奥斯卡 11 项。"
      },
      {
        prompt: "斯坦利·库布里克生前完成的最后一部电影是？",
        options: ["《闪灵》", "《2001 太空漫游》", "《大开眼戒》", "《全金属外壳》"],
        answerIndex: 2,
        fact: "《大开眼戒》，1999 年，库布里克去世后才上映。"
      },
      {
        prompt: "「意式西部片」（Spaghetti Western）的代表导演是？",
        options: ["赛尔乔·莱昂内", "皮埃尔·保罗·帕索里尼", "米开朗基罗·安东尼奥尼", "费德里科·费里尼"],
        answerIndex: 0,
        fact: "莱昂内，《黄金三镖客》1966 年。"
      },
      {
        prompt: "费里尼《8½》的上映年份是？",
        options: ["1960", "1963", "1966", "1969"],
        answerIndex: 1,
        fact: "1963 年。"
      },
      {
        prompt: "宫崎骏《千与千寻》拿到奥斯卡最佳动画长片是在哪一年？",
        options: ["2001", "2002", "2003", "2005"],
        answerIndex: 2,
        fact: "2003 年第 75 届；影片 2001 年在日本上映。"
      },
      {
        prompt: "《这个杀手不太冷》（Léon）的导演是？",
        options: ["吕克·贝松", "让-皮埃尔·热内", "罗曼·波兰斯基", "克日什托夫·基耶斯洛夫斯基"],
        answerIndex: 0,
        fact: "吕克·贝松，1994 年。"
      }
    ]
  },

  /* —— 结果档位（得分比例区间，含端点） —— */
  tiers: [
    { min: 0, max: 0.39, title: "初来乍到", verdict: "影史课还得补，先去把刻度那节看完。" },
    { min: 0.4, max: 0.69, title: "资深影迷", verdict: "底子在，中间还缺着几个世代。" },
    { min: 0.7, max: 0.89, title: "准骨灰", verdict: "只差最后一撮灰。" },
    { min: 0.9, max: 1, title: "骨灰级影迷", verdict: "烧透了。编号已发，请妥善保管（虽然它哪也去不了）。" }
  ],

  /* —— 主题顺序（按钮循环切换） —— */
  themeOrder: ["cartridge", "terminal", "amber"],

  /* —— 成绩档案（与游戏版隔离，仅本机） —— */
  archive: {
    storageKey: "guihuiji-yingmi-archive-v1",
    maxEntries: 50
  },

  /* —— 页脚 —— */
  footer: {
    note: "本页题目均为公开可查证的事实；词源存疑处已标注。",
    colophon: "骨灰级影迷 · 词源文化实验页 — 内容全部写在 config.js，引擎不认识任何一部电影。"
  }
};
