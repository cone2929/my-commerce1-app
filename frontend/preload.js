const { contextBridge, ipcRenderer } = require('electron');
// 렌더러 프로세스에서 사용할 API 노출
contextBridge.exposeInMainWorld('electronAPI', {
  // 상품 관리 API
  getProducts: () => ipcRenderer.invoke('db-get-products'),
  createProduct: (product) => ipcRenderer.invoke('db-create-product', product),
  updateProduct: (product) => ipcRenderer.invoke('db-update-product', product),
  deleteProduct: (id) => ipcRenderer.invoke('db-delete-product', id),
  // 주문 관리 API
  getOrders: () => ipcRenderer.invoke('db-get-orders'),
  createOrder: (order) => ipcRenderer.invoke('db-create-order', order),
  updateOrder: (order) => ipcRenderer.invoke('db-update-order', order),
  deleteOrder: (id) => ipcRenderer.invoke('db-delete-order', id),
  // 자동화 기능 API
  parseProducts: (data) => ipcRenderer.invoke('parse-products', data),
  extractProductImages: (data) => ipcRenderer.invoke('extract-product-images', data),
  // 브라우저 정리 API
  cleanupBrowsers: () => ipcRenderer.invoke('cleanup-browsers'),

  // 업데이트 관련 API (추가)
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (event, data) => callback(data)),
  onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (event, data) => callback(data)),
  onUpdateInstalling: (callback) => ipcRenderer.on('update-installing', (event, data) => callback(data)),
  onUpdateError: (callback) => ipcRenderer.on('update-error', (event, data) => callback(data))
});
