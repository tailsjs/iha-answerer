# iha-answerer.js
Болталка, вырезанная из приложения `FP iHA bot`. С панелькой обучения базы!

## Пример
```js
const AnswerDatabase = require("./src/index")

const AnswerDB = new AnswerDatabase()

const question = "Привет!"

AnswerDB.getMaxValidAnswer(question) // ку-ку, епта
```

## Установка
1. Скачайте/клонируйте репозиторий.
2. `node test.js`

## Настройка.
1. Перейдите в директорию `src`
2. Откройте файл `config.js`
### В файле `config.js` можно настроить следующее:
1. `learningServerPort` - Порт для панельки обучения базы. Default: `1666`
2. `ignore02` - Игнорировать `Что?`, если степень схожести 20% и меньше. Default: `false`
3. `unknownFile` - Расположение файла с запросами, которых нет в базе ответов. **Необходимо указывать с `/` в начале!** Default: `/unknown.json`
4. `databaseFile` - Расположение вашей базы ответов. **Необходимо указывать с `/` в начале!** Default: `/databases/answer_databse.bin`
5. `synonimousFile` - Расположение вашей базы синонимов. **Необходимо указывать с `/` в начале!** Default: `/data/synonimous.txt`

## Настройка панельки обучения базы
1. Перейдите в директорию `src/learning_server`
2. Пропишите `npm install`
3. Пропишите `npm start`
4. Перейдите на [http://127.0.0.1:1666/](http://127.0.0.1:1666/)

![Панелька](screens/image.png)

## Полезная информация
* Здесь уже предоставлена базовая база ответов, идущая в приложении `FP iHA bot`. Файл: `./src/databases/answer_databse.bin`
* Базу можно обучать в панельке. Гайд по настройке выше.
* В случае, если база не сможет обнаружить подходящий ответ, она отправит запрос в файл `/src/unknown.json`

## Связь с автором
Telegram: [t.me/tailsjs](https://t.me/tailsjs)<br>
TailiumBox (Telegram): [t.me/tailiumbox_bot](https://t.me/tailiumbox_bot)