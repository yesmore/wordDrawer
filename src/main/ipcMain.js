// 接收渲染进程广播的数据执行最小化、关闭的操作
const { ipcMain, BrowserWindow } = require('electron')

// 获取当前的窗口对象   BrowserWindow.getFocusedWindow();
const mainWindow = BrowserWindow.getFocusedWindow()

ipcMain.on('window-min', () => {
  console.log('window-min')
  mainWindow.minimize()
})

ipcMain.on('window-close', () => {
  mainWindow.close()
})
