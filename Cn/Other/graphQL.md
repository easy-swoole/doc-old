# GraphQL
本文档假定你熟悉GraphQL的概念。如果不是这样，请首先在官方网站上面了解 GraphQL。

## 依赖类库
```
composer require webonyx/graphql-php
```

## EasySwoole Http 中使用
其实在EasySwoole Http服务器中使用，本质问题在于，如何得到RAW_POST过来的json数据。我们直接贴代码：
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