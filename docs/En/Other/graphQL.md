---
title: GraphQL
meta:
  - name: description
    content: easyswoole,GraphQL
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|GraphQL
---
## GraphQL
This document assumes that you are familiar with the concept of GraphQL. If this is not the case, please first understand GraphQL on the official website.

## Dependent class library
```php
composer require webonyx/graphql-php
```

## Used in EasySwoole Http
In fact, the essence of the use in the EasySwoole Http server is how to get the json data from RAW_POST. We paste the code directly:
```php
namespace App\HttpController;


use EasySwoole\Http\AbstractInterface\Controller;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\GraphQL;
use GraphQL\Type\Schema;

class Index extends Controller
{

    function index()
    {
        $queryType = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'echo' => [
                    'type' => Type::string(),
                    'args' => [
                        'message' => Type::nonNull(Type::string()),
                    ],
                    'resolve' => function ($root, $args) {
                        return $root['prefix'] . $args['message'];
                    }
                ],
            ],
        ]);
        $schema = new Schema([
            'query' => $queryType
        ]);

        $input = $this->json();
        $query = $input['query'];
        $variableValues = isset($input['variables']) ? $input['variables'] : null;
        try {
            $rootValue = ['prefix' => 'You said: '];
            $result = GraphQL::executeQuery($schema, $query, $rootValue, null, $variableValues);
            $output = $result->toArray();
        } catch (\Exception $e) {
            $output = [
                'errors' => [
                    [
                        'message' => $e->getMessage()
                    ]
                ]
            ];
        }

        $this->writeJson(200,$output);
    }
}
```
