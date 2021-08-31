'use strict'

import { app, BrowserWindow } from 'electron'
import '../renderer/store'
// import pkg from '../../package.json'

// if (process.platform === 'win32') {
//   app.setAppUserModelId(pkg.build.appId)
// }

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// function createMenu () {
//   const template = [{
//     label: 'Edit',
//     submenu: [
//       { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
//       { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
//       { type: 'separator' },
//       { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
//       { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
//       { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
//       { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
//       {
//         label: 'Quit',
//         accelerator: 'CmdOrCtrl+Q',
//         click () {
//           app.quit()
//         }
//       }
//     ]
//   }]
//   let menu = Menu.buildFromTemplate(template)
//   Menu.setApplicationMenu(menu)
// }

function createWindow () {
  /**
   * Initial window options
   */
  const options = {
    // icon: '',
    height: 413,
    useContentSize: true,
    width: 600,
    autoHideMenuBar: true,
    title: 'wordDrawer',
    show: false, // 创建后是否显示
    frame: false, // 是否创建frameless窗口
    center: true, // 是否出现在屏幕居中的位置
    backgroundColor: '#3f3c37', // 背景色，用于transparent和frameless窗口
    titleBarStyle: 'hidden', // 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等
    resizable: false, // 是否允许拉伸大小
    transparent: true, // 是否是透明窗口（仅macOS）
    // vibrancy: 'ultra-dark', // 窗口模糊的样式（仅macOS）
    webPreferences: {
      webSecurity: false, // 解决跨域
      backgroundThrottling: false, // 当页面被置于非激活窗口的时候是否停止动画和计时器
      nodeIntegration: true, // 设置开启nodejs环境
      contextIsolation: false
    }
  }
  if (process.platform === 'win32') { // 针对windows平台做出不同的配置
    options.show = true // 创建即展示
    options.backgroundColor = '#3f3c37' // 背景色
  }

  mainWindow = new BrowserWindow(options)

  mainWindow.loadURL(winURL)

  mainWindow.once('ready-to-show', function () {
    mainWindow.show()
  })

  // 引入ipcMain
  require('./ipcMain.js')
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 去掉顶部菜单
  mainWindow.setMenu(null)
}

// 当electron完成初始化后触发
app.on('ready', createWindow)

// 所有窗口都关闭的时候触发
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // 当操作系统不是darwin（macOS）的话
    app.quit() // 退出应用
  }
})

// （仅macOS）当应用处于激活状态时
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// tray.on('right-click', () => {
//   tray.popUpContextMenu(contextMenu)
// })

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
