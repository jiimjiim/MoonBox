import fetch from '@system.fetch';
import market from './market.js';

export default {
  /**
   * 核心更新逻辑
   * @param {Array} coins - 完整的币种数组（包含已选和未选）
   * @param {Function} callback - 每次数据回来后的回调，用于更新 UI
   */
  updateAll(coins, callback) {
    // 遍历所有币种，但通常可以在这里先过滤一下 if(item.selected)
    coins.forEach((item, i) => {
      // 依然保持 150ms 逐个请求的延迟，防止高频访问触发 API 封禁
      setTimeout(() => {
        this.getSinglePrice(item, (newData) => {
          callback(newData);
        });
      }, i * 150);
    });
  },

  getSinglePrice(item, successCallback) {
    fetch.fetch({
      url: 'https://data.gateapi.io/api2/1/ticker/' + item.id,
      success: (response) => {
        try {
          const res = (typeof response.data === 'object') ? response.data : JSON.parse(response.data);
          
          // Gate.io 返回 result: "false" 时代表请求的 ID 有误
          if (res.result === "false") {
             successCallback({ ...item, price: 'ERRID', change: 0 });
             return;
          }

          if (res.last) {
            const precision = market.getPrecision(item.name);
            const cleanData = market.parseTicker(res, precision);
            // 正常返回数据
            successCallback({ ...item, ...cleanData });
          } else {
            // 数据结构异常
            successCallback({ ...item, price: 'NODAT', change: 0 });
          }
        } catch (e) {
          console.error("API解析失败:", e);
          successCallback({ ...item, price: 'PARSE', change: 0 });
        }
      },
      fail: (data, code) => {
        /**
         * 捕捉网络层错误
         * code 429: 请求太频繁 (Too Many Requests)
         * code 403: 拒绝访问 (IP被封)
         * code 0: 网络不可用或超时
         */
        successCallback({ ...item, price: code === 0 ? 'OFFLN' : `E${code}`, change: 0 });
      }
    });
  }
}