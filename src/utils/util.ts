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
