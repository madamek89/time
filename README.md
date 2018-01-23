# time [![Build Status](https://travis-ci.org/arutkowski00/time.svg?branch=master)](https://travis-ci.org/arutkowski00/time) [![npm (scoped)](https://img.shields.io/npm/v/@arutkowski00/time.svg)](https://www.npmjs.com/package/@arutkowski00/time) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/54e59b313f7844009bb6edcf9ecb509d)](https://www.codacy.com/app/arutkowski00/time?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=arutkowski00/time&amp;utm_campaign=Badge_Coverage)
Simple **JavaScript library** for parsing, displaying and manipulating *date-agnostic* time

## Installation
Yarn:
```sh
yarn add @arutkowski00/time
```

npm:
```sh
npm install --save @arutkowski00/time
```

## Usage
Simply import `Time` class and use it:

```js
import { Time } from '@arutkowski00/time';

let time = new Time(8, 20); // 08:20
time = Time.fromString("9:40"); // 09:40
time.addMinutes(100); // 11:20
time.setHours(16); // 16:20

```

For more see [documentation](https://arutkowski00.github.io/time/)
