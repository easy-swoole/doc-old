## onReceive

When the primary service is SERVER, this event is triggered when client data is received.

### Function prototype
```php
public static function onReceive(\swoole_server $server, int $fd, int $reactor_id, string $data): void
{
}
```