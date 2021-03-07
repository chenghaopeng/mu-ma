/* 服务端渲染时：首屏时间 = DOMContentLoaded = domContentLoadedEventEnd - fetchStart */

/* 客户端渲染时：用 MutationObserver 监听页面，
   当页面元素变化最剧烈并达到最大的以后就是首屏初次渲染完成的时间
   需要忽略看不见的元素 */

/* 不考虑图片的情况下 */
(() => {
  /* 忽略的标签（不计算分数） */
  const ignoredTag = ['SCRIPT', 'META', 'HEAD', 'STYLE']
  /* 计算节点的分数，参数分别为当前节点、深度、父节点是否有分数 */
  const calcScore = (el, dep, parentHasScore) => {
    let score = 0
    if (ignoredTag.includes(el.tagName)) return score
    for (let i = el.children.length - 1; i >= 0; --i) {
      score += calcScore(el.children[i], dep + 1, score > 0)
    }
    /* 如果自身没有分数并且父节点也没有分数 */
    if (score <= 0 && !parentHasScore) {
      /* 如果获取不到当前节点的位置或者当前位置不在客户端高度内（看不见），则不计算当前节点的分数 */
      if (!(el.getBoundingClientRect && el.getBoundingClientRect().top < document.documentElement.clientHeight)) {
        return 0
      }
    }
    /* 当前节点的权重是 1（基础分）加上深度的权重 */
    /* 越深的节点，说明它越靠近有效的网页内容；越浅，则越靠近 body 等与内容无关的节点 */
    score += 1 + 0.5 * dep
    return score
  }
  /* 记录节点变化的情况 */
  const records = []
  /* 观察 body 节点 */
  const targetNode = document.body
  /* 观察 body 的整棵 DOM 树的变化 */
  const observerOptions = { subtree: true }
  /* DOM 变化观察者 */
  const mo = new MutationObserver(() => {
    /* 每次变化都记录当前的分数以及时刻 */
    records.push({
      score: calcScore(targetNode, 1, true),
      time: performance.now()
    })
  })
  /* 开始观察 */
  mo.observe(targetNode, observerOptions)
})()
