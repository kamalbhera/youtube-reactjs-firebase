export function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function validateEmail(email) {
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(String(email).toLowerCase());
}

export function timeConvert(s) {
  const seconds = Math.floor(s);
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return (`${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`)
}

export function getDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${day}-${month}-${year}`;
}

export function changeThemeColors(theme) {
  let bgColor, textColor, bgColor2, headerColor, hovColor, titColor, fontCol, searchCol, searchBord, tColor, bColor, gColor;

  switch (theme) {
    case 'dark':
      bgColor = '#181818';
      bgColor2 = '#202020';
      textColor = '#000';
      headerColor = '#e3e3e3';
      hovColor = '#383838';
      titColor = '#dfdfdf';
      fontCol = '#9d9d9d';
      searchCol = '#323232';
      searchBord = '#2c2c2c';
      tColor = '#ffffff';
      bColor = '#3c9ff4';
      gColor = '#717171';
      break;
    case 'light':
      bgColor = '#f9f9f9';
      bgColor2 = '#ffffff';
      headerColor = '#606060';
      hovColor = '#f2f2f2';
      titColor = '#030303';
      fontCol = '#858585';
      searchCol = '#f8f8f8';
      searchBord = '#dadada';
      tColor = '#181818';
      bColor = '#5993e0';
      gColor = '#828282';
      break;
    default:
      bgColor = '#181818';
      bgColor2 = '#202020';
      textColor = '#000'; // white
      headerColor = '#e3e3e3'; // sidebar text color
      hovColor = '#383838';
      titColor = '#dfdfdf'; // titles
      fontCol = '#9d9d9d';
      searchCol = '#323232';
      searchBord = '#2c2c2c';
      tColor = '#ffffff';
      bColor = '#3c9ff4';
      gColor = '#717171';
  }

  const body = document.body;
  body.style.setProperty('--bg-color', bgColor);
  body.style.setProperty('--text-color', textColor);
  body.style.setProperty('--bg-color-32', bgColor2);
  body.style.setProperty('--header-color', headerColor);
  body.style.setProperty('--hov-color', hovColor);
  body.style.setProperty('--tit-color', titColor);
  body.style.setProperty('--font-color', fontCol);
  body.style.setProperty('--search-color', searchCol);
  body.style.setProperty('--search-bord', searchBord);
  body.style.setProperty('--t-color', tColor);
  body.style.setProperty('--b-color', bColor);
  body.style.setProperty('--g-color', gColor);
}