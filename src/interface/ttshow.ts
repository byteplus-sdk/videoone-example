// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
export interface IVideo {
  caption: string;
  comment: number;
  coverUrl: string;
  createTime: Date;
  duration: number;
  width: number;
  height: number;
  like: number;
  name: string;
  playAuthToken: string;
  playTimes: number;
  subtitle: string;
  vid: string;
  ref: any;
}

export interface IPlayer {
  index: number;
  data: IVideo;
  ref: any;
}

export interface IComment {
  content: string;
  name: string;
  uid: number;
  createTime: Date;
  like: number;
}
