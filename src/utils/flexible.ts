function flexible(window: Window, document: Document) {
  const docEl = document.documentElement;
  const dpr = window.devicePixelRatio || 1;
  window.flexible = flexible;
  // adjust body font size
  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + 'px';
    } else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize);
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit() {
    const width = docEl.clientWidth;
    const height = docEl.clientHeight;
    const realWidth = Math.min(width, height);

    const rem = (realWidth * 100) / 375;
    docEl.style.fontSize = rem + 'px';
  }

  function setVh() {
    // Use 0.01 times innerHeight as the vh css variable
    // Avoid the problem that the css vh unit cannot respond to the existence of the tool bar at the bottom of the h5 browser, causing the bottom content to be blocked
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  setRemUnit();
  setVh();

  // reset rem unit on page resize
  window.addEventListener('resize', () => {
    setTimeout(() => {
      setRemUnit();
      setVh();
    }, 100);
  });

  window.addEventListener('pageshow', e => {
    if (e.persisted) {
      setRemUnit();
    }
  });

  // detect 0.5px supports
  if (dpr >= 2) {
    const fakeBody = document.createElement('body');
    const testElement = document.createElement('div');
    testElement.style.border = '.5px solid transparent';
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody);
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines');
    }
    docEl.removeChild(fakeBody);
  }
}

export default flexible;
