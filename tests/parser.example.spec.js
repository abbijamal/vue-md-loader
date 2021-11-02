const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const Parser = require('../src/parser')
const anchor = require('markdown-it-anchor')

const markdown = fs.readFileSync(
  path.resolve(__dirname, '../example/src/markdown.md'),
  'UTF-8'
)

const options = {
  afterProcessLiveTemplate: function (template) {
    return `<div class="live-wrapper">${template}</div>`
  },
  rules: {
    table_open: () => '<div class="table-responsive"><table class="table">',
    table_close: () => '</table></div>',
  },
  plugins: [
    [
      anchor,
      {
        permalink: anchor.permalink.headerLink({
          symbol: '&#128279;',
        }),
      },
    ],
  ],
}

describe('#example', () => {
  let html, parser, $

  beforeEach(() => {
    parser = new Parser(options)
    html = parser.parse(markdown)
    $ = cheerio.load(html)
  })

  it('should assemble correct script', () => {
    // 1 script tag at the end.
    expect($('script').length).toEqual(1)
  })

  it('should assemble correct styles', () => {
    // 1 script tag at the end.
    expect($('style').length).toBeGreaterThan(1)
  })

  it('should be ale to use `afterProcessLiveTemplate`', () => {
    const match = /<div class=[\\]?"live-wrapper[\\]?">[\s\S]*?<\/div>/
    expect(match.exec(html)).toBeDefined()
  })

  it('should be ale to use `markdown-it-anchor` plugin', () => {
    const anchors = $('[id]:header')
    const link = anchors.find('a.header-anchor')
    expect(anchors.length).toBeGreaterThan(0)
    expect(anchors.length).toEqual(link.length)
  })
})
