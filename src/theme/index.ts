export const dark = {
  html: {
    color: `#fff`,
    background: `#3C3F45`
  },

  layout: {
    background: `#3C3F45`
  },

  header: {
    color: `#fff`,
    background: `#3C3F45`
  },

  icon: {
    color: `#fff`
  },

  punctuation: {
    color: `#fff`
  },

  lineNumber: {
    color: `#fff`
  },

  coverMeta: {
    color: `#fff`
  },

  quote: {
    background: `#000`,
    color: `#fff`
  },

  outerLink: {
    color: `#0087ff`
  },

  copyright: {
    color: `#fff`
  }
}

export const white = {
  html: {
    color: `#3C3F45`,
    background: `#fff`
  },

  layout: {
    background: `#fff`
  },

  header: {
    color: `#3C3F45`,
    background: `#fff`
  },

  icon: {
    color: `rgb(60, 63, 69)`
  },

  punctuation: {
    color: `#24292e`
  },

  lineNumber: {
    color: `rgba(27,31,35,.3)`
  },

  coverMeta: {
    color: `rgba(0, 0, 0, 0.65)`
  },

  quote: {
    background: `rgb(239, 243, 245)`,
    color: `#fff`
  },

  outerLink: {
    color: `#0087ff`
  },

  copyright: {
    color: `#3C3F45`
  }
}

const isDarkMode = () => window.localStorage.getItem('dark-mode') === '1'

function insertCSS(css: any) {
  const bef = document.head.querySelector('#theme-style')

  if (bef) {
    bef.innerHTML = css

    return
  }

  const style = document.createElement('style')

  style.id = 'theme-style'
  style.type = 'text/css'
  style.innerHTML = css
  document.head.appendChild(style)
}

const clutter = () => {
  try {
    const isDark = isDarkMode()

    // 使用 styled-component 使用主题变量替换切换的下一个主题需要触发跳转才会生效
    // I do not know why.

    const css = `
      html,
      .theme-header,
      .theme-layout {
        background: ${isDark ? '#3C3F45' : '#fff'};
        color: ${isDark ? '#fff' : '#3C3F45'};
      }
      .theme-post {
        color: ${isDark ? '#3C3F45' : '#fff'};
      }

      .theme-code {
        color: ${isDark ? '#fff' : '#3C3F45'};
        background: ${isDark ? '#000' : 'rgb(239,243,245)'};
      }

      .theme-quote {
        background: ${isDark ? '#000' : 'rgb(239, 243, 245)'};
      }

      .theme-copyright,
      .theme-logo,
      .theme-coverMeta {
        color: ${isDark ? '#fff' : '#3C3F45'};
      }

      .line-numbers-rows span:before {
        color: ${isDark ? 'rgba(34, 134, 58)' : 'rgba(27,31,35,.3)'};
      }

      .punctuation {
        color: ${isDark ? '#fff' : '#24292e'};
      }
    `

    insertCSS(css)
  } catch (e) {}
}

export const changeThemeMode = () => () => {
  try {
    const darkMode = window.localStorage.getItem('dark-mode')

    window.localStorage.setItem('dark-mode', `${darkMode === '1' ? 0 : 1}`)

    clutter()

    // window.location.reload()
  } catch (e) {
    // console.log(e)
  }
}

export const theme = (function() {
  let theme = white

  try {
    const darkMode = isDarkMode()
    theme = darkMode ? dark : white
  } catch (e) {
    theme = white
    // console.log(e)
  }

  return theme
})()

try {
  setTimeout(clutter, 1)
} catch (e) {}
