В рамках тестового задания кандидату предлагается спроектировать и написать "новый" сервис
для гипотетического приложения в котором уже есть реактивное веб-приложение и сервис статистики.

Веб клиент будет использовать "новый" сервис для отображения состояния системы на отдельной странице.
Сервис статистики будет высчитывать метрики активности игроков на игровой площадке по событиям от "нового" сервиса.

Так же в нашем гипотетическом приложении уже есть 2 сервиса, являющихся источниками данных для "нового".

Далее приведены тайпинги сущностей с точки зрения нетехнических специалистов (бизнеса/пользователей/менеджмента),
метаданные при желании/необходимости можно определить самостоятельно.

1. Сервис игроков, отдающий по websocket состояния игроков:
```
{
  playerId: string,
  name: string,
  balanceAtCents: number
}
```
1. Сервис игр, отдающий по websocket состояния игровых столов:
```
{
  gameType: 'NLH' | 'PLO'
  bbInCents: number,
  anteInCents?: number,
  organizationId: string,
  size: number,
  seats: Array<{playerId: string, stackAtCents: number, cards: string[]}>
}
```

"Новый" сервис должен по websocket отдавать объекты вида
```
{
  // отдается, если подходит под фильтр
  occupiedTable?: {
    gameType: 'NLH' | 'PLO'
    bbAtCents: number,
    anteAtCents?: number,
    organizationId: string,
    size: number,
    occupiedSeatsCount: number
  },
  // отдается, если подходит под фильтр
  freeTable?: {
    gameType: 'NLH' | 'PLO'
    bbInCents: number,
    anteInCents?: number,
    organizationId: string,
    size: number,
  },
  // отдается, если подходит под фильтр
  inGamePlayer?: {
    playerId: string,
    name: string,
    totalOnlineTables: number,
    organizations: Array<{id: string, inGameTables: numbers}>,
  },
  // отдается, если подходит под фильтр
  offlinePlayer?: {
    playerId: string,
    name: string,
    balanceAtCents: number
  }
}
```
Метод подписки должен принимать объект подписчика с параметрами фильтрации (т.е. клиент без пересоздания подписки может изменить фильтры).
Клиент может подписаться одновременно на несколько фильтров
Нужно использовать тайпскрипт.
Нужно написать интеграционный тест (например на jest) для "нового" сервиса.
RxJs использовать нельзя.

Будет плюсом:
Контейнеризация.
Документация.
Добавление каких-то своих идей в тестовое, при желании продемонстрировать какие-то еще умения.