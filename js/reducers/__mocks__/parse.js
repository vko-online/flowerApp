/**
 * @flow
 */

'use strict';

class ParseObjectMock {
  id: string;
  createdAt: Date;
  _fields: Object;

  constructor(fields: Object) {
    this._fields = fields;
    this.id = Math.ceil(Math.random() * 0xFFFFFF).toString(16);
    this.createdAt = new Date();
  }

  get(name: string): any {
    return this._fields[name];
  }
}

class ParseFileMock {
  _url: string;

  constructor(url: string) {
    this._url = url;
  }

  url(): string {
    return this._url;
  }
}

module.exports = {
  Object: ParseObjectMock,
  File: ParseFileMock,
};
