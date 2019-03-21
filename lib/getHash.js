export const getHashParams = () => {
  const hashParams = {};
  let e; const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  e = r.exec(q);
  while (e) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
    e = r.exec(q);
  }
  return hashParams;
}
;