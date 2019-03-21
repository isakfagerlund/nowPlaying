export function readCookie(k, r) { return (r = RegExp(`(^|; )${encodeURIComponent(k)}=([^;]*)`).exec(document.cookie)) ? r[2] : null; }
