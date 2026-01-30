export default {
    getPrecision(coinName) {
      const name = coinName.toUpperCase();
      if (["TON", "XRP", "AVAX"].includes(name)) return 3;
      if (["DOGE", "TRX", "ADA"].includes(name)) return 4;
      return 2;
    },
    parseTicker(res, precision) {
      const last = parseFloat(res.last || 0);
      const high = parseFloat(res.high24hr || 0);
      const low = parseFloat(res.low24hr || 0);
      const change = parseFloat(res.percentChange || 0);
  
      return {
        price: "$" + last.toFixed(precision),
        high: high.toFixed(precision),
        low: low.toFixed(precision),
        change: change.toFixed(2),
        amp: low > 0 ? ((high - low) / low * 100).toFixed(2) : "0.00"
      };
    }
  }