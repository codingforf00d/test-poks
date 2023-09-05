

### Описание задания - [тык](./rx-js-test-challenge%20(2).md)

### Запуск

`docker compose build && docker compose up -d` в корне. Порт 3000 должен быть свободен, на нём работает наш "новый" сервис.
Дальше подключаемся на этот порт по вебсокету и отправляем сообщение с названием `subscribe` и следующим телом:
```
type MsgBody = {
    tableFilter?: TableFilter;
    playerFilter?: PlayerFilter;
}
```
`TableFilter` и `PlayerFilter` можно посмотреть [здесь](./new/src/filter.engine.ts)
