export function formatDateTime(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // const hour = date.getHours();
  // const minute = date.getMinutes();
  // const second = date.getSeconds();
  return `${year}/${pad(month)}/${pad(day)}`;
}

function pad(num: number) {
  return num.toString().padStart(2, '0');
}

export function loadScript(url: string) {
  return new Promise<void>(resolve => {
    const script: any = document.createElement('script');
    script.type = 'text/javascript';

    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;
          resolve();
        }
      };
    } else {
      script.onload = function () {
        resolve();
      };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  });
}

export function renderCount(count: number) {
  const lang = window.navigator.language;
  if (/zh/i.test(lang)) {
    return count > 9999
      ? `${parseFloat(`${count / 10000}`)
          .toFixed(3)
          .slice(0, -2)}万`
      : count;
  }
  return count > 9999
    ? `${parseFloat(`${count / 1000}`)
        .toFixed(3)
        .slice(0, -2)}k`
    : count;
}

export function formatSecondsToTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (num: number) => String(num).padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  } else {
    return `${pad(minutes)}:${pad(secs)}`;
  }
}
