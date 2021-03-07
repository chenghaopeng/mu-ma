const itemsNode = document.querySelector('#items .list')
const itemNodesDo = fn => Array.prototype.forEach.call(itemsNode.children, fn)
const view = document.querySelector('#view')
itemsNode.addEventListener('click', e => {
  if (e.target === itemsNode) return
  let item = e.target
  while (item.parentNode !== itemsNode) {
    item = item.parentNode
  }
  itemNodesDo(node => node.classList.remove('checked'))
  item.classList.add('checked')
  const language = item.dataset.language.toLowerCase()
  fetch('/code/' + item.dataset.path).then(res => {
    res.text().then(data => {
      const html = Prism.highlight(data, Prism.languages[language], language)
      view.className = 'language-' + language
      view.innerHTML = '<code class="language-' + language + '">' + html + '</code>'
    })
  })
})
