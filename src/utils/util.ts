// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
export function formatDateTime(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${pad(month)}/${pad(day)}`;
}

function pad(num: number) {
  return num.toString().padStart(2, '0');
}

export function renderCount(count: number) {
  const lang = window.navigator.language;
  const isZh = /zh/i.test(lang);

  return count > 9999
    ? `${parseFloat(`${count / (isZh ? 10000 : 1000)}`)
        .toFixed(3)
        .slice(0, -2)}${isZh ? '万' : 'k'}`
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
