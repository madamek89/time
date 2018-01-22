# time [![Build Status](https://travis-ci.org/arutkowski00/time.svg?branch=master)](https://travis-ci.org/arutkowski00/time) [![npm (scoped)](https://img.shields.io/npm/v/@arutkowski00/time.svg)](https://www.npmjs.com/package/@arutkowski00/time) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/54e59b313f7844009bb6edcf9ecb509d)](https://www.codacy.com/app/arutkowski00/time?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=arutkowski00/time&amp;utm_campaign=Badge_Coverage)
JS utilities &amp; tools for time-related stuff with no dependencies!

## Installation
Yarn:
```sh
yarn add @arutkowski00/time
```

npm:
```
npm install --save @arutkowski00/time
```

## Usage
Simply import `Time` class and use it:
```js
import { Time } from '@arutkowski00/time';

let time = new Time(8, 20);
// time.toString() === "08:20"

time = Time.fromString("9:40");
// time.toString() === "09:40"
