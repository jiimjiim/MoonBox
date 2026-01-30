import storage from '@system.storage';

const KEY = 'moonbox_v10_final';

export default {
  // 从本地存储加载并与默认列表合并
  load(defaultCoins, callback) {
    storage.get({
      key: KEY,
      success: (data) => {
        if (!data) return callback(defaultCoins);
        try {
          const saved = JSON.parse(data);
          // 逻辑搬运到这里，index.ux 就不累了
          const merged = defaultCoins.map(c => {
            const match = saved.find(s => s.id === c.id);
            return match ? { ...c, selected: match.selected } : c;
          });
          callback(merged);
        } catch (e) { callback(defaultCoins); }
      }
    });
  },

  // 仅保存必要的 ID 和选中状态，节省存储空间
  save(coins) {
    const simplified = coins.map(c => ({ id: c.id, selected: c.selected }));
    storage.set({ key: KEY, value: JSON.stringify(simplified) });
  }
}