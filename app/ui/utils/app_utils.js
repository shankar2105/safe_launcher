const LOCAL_STORAGE_KEYS = {
  SAFE_LAUNCHER_PROXY: 'safe_launcher_proxy',
};

export let getProxy = () => {
  return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.SAFE_LAUNCHER_PROXY));
};

export let setProxy = (status) => {
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.SAFE_LAUNCHER_PROXY, JSON.stringify({ 'status' : status }))
};

export let openExternal = (url) => {
  window.msl.openExternal(url);
};
