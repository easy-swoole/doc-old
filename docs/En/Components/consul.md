---
title: Consul coroutine client
meta:
  - name: description
    content: Easyswoole provides a coroutine secure console version client
  - name: keywords
    content: swoole|swoole extension|swoole framework|easyswoole|consul|Consul coroutine version client
---

# Consul

Easyswoole provides a coroutine secure console version client that facilitates distributed microservice development.

## Installation
```
composer require easyswoole/consul
```
## Way of use
* Use the following interface methods, you need to first inject Config configuration into Consul.
* Interfaces only show usage, specific namespaces need to be introduced by developers themselves
```php
use EasySwoole\Consul\Config;
use EasySwoole\Consul\Consul;

// Config default  127.0.0.1:8500/v1
$config = new Config([
    'IP'       => '127.0.0.1',
    'port'     => '8500',
    'version'  => 'v1',
]);
$consul = new Consul($config);

// Two ways to write the same result
$config = new Config();
$config->setIP('127.0.0.1');
$config->setPort('8500');
$config->setVersion('v1');    

$consul = new Consul($config);
```

## ACLs
```php
// Bootstrap ACLs
$bootstrap = new Bootstrap();
$this->consul->acl()->bootstrap($bootstrap);

// Check ACL Replication
$replication = new Replication();
$this->consul->acl()->replication($replication);

// Translate Rules
// Translate a Legacy Token's Rules
$translate = new Translate([
    'accessor_id' => $accessor_id
]);
$this->consul->acl()->translate($translate);

// Login to Auth Method
$login = new Login([
    "authMethod" => $authMethod,
    "bearerToken" => $bearerToken
]);
$this->consul->acl()->login($login);

// Logout from Auth Method
$logout = new Logout([
    'token' => $header['token']
]);
$this->consul->acl()->logout($logout);
```
### Tokens
```php
// Create a Token
$token = new Token([
    "description" => "Agent token for 'node1'",
    "Policies" => [
        ["ID" => "165d4317-e379-f732-ce70-86278c4558f7"],
        ["Name" => "node-read"],
    ],
    "Local" => false,
]);
$this->consul->acl()->token($token);

// Read a Token
$token = new Token([
    "AccessorID" => "6a1253d2-1785-24fd-91c2-f8e78c745511"
]);
$this->consul->acl()->readToken($token);

// Read Self Token
$self = new Token\GetSelf([
    'token' => "6a1253d2-1785-24fd-91c2-f8e78c745511"
]);
$this->consul->acl()->self($self);

// Update a Token
$update = new Token([
    'accessorID' => '6a1253d2-1785-24fd-91c2-f8e78c745511',
    "Description" => "Agent token for 'node1'",
    "Policies" => [],
    "local" => false
]);
$this->consul->acl()->updateToken($update);

// Clone a Token
$clone = new Token\CloneToken([
    'accessorID' => '8f246b77-f3e1-ff88-5b48-8ec93abf3e05',
    "description" => "Clone of Agent token for 'node1'",
]);
$this->consul->acl()->cloneToken($clone);

// Delete a Token
$delete = new Token([
    'AccessorID' => '8f246b77-f3e1-ff88-5b48-8ec93abf3e05'
]);
$this->consul->acl()->delete($delete);

// List Tokens
$token = new Tokens();
$this->consul->acl()->tokens($token);
```
### Legacy Tokens
```php
// Create ACL Token
$create = new Create([
    "Name" => "my-app-token",
    "Type" => "client",
    "rules" => "a"
]);
$this->consul->acl()->create($create);

// Update ACL Token
$update = new Update([
    "id" => "adf4238a-882b-9ddc-4a9d-5b6758e4159e",
    "Name" => "my-app-token-updated",
    "Type" => "client",
    "Rules" => "# New Rules",
]);
$this->consul->acl()->update($update);

// Delete ACL Token
$delete = new Destroy([
    'uuid' => '8f246b77-f3e1-ff88-5b48-8ec93abf3e05'
]);
$this->consul->acl()->destroy($delete);

// Read ACL Token
$info = new Info([
    'uuid' => '8f246b77-f3e1-ff88-5b48-8ec93abf3e05'
]);
$this->consul->acl()->info($info);

// Clone ACL Token
$cloneAclToken = new CloneACLToken([
    'uuid' => '8f246b77-f3e1-ff88-5b48-8ec93abf3e05'
]);
$this->consul->acl()->cloneAclToken($cloneAclToken);

// List ACLs
$getList = new Lists();
$this->consul->acl()->getList($getList);
$this->assertEquals('x','x');
```
### Policies
```php
// Create a Policy
$policy = new Policy([
    "Name" => "node-read",
    "Description" => "Grants read access to all node information",
    "Rules" => "node_prefix \"\" { policy = \"read\"}",
    "datacenters" => ["dc1"]
]);
$this->consul->acl()->policy($policy);

// Read a Policy
$policy = new Policy([
    'id' => 'c01a1f82-44be-41b0-a686-685fb6e0f485',
]);
$this->consul->acl()->readPolicy($policy);

// Update a Policy
$policy = new Policy([
    "ID" => "c01a1f82-44be-41b0-a686-685fb6e0f485",
    "Name" => "register-app-service",
    "Description" => "Grants write permissions necessary to register the 'app' service",
    "Rules" => "service \"app\" { policy = \"write\"}",
]);
$this->consul->acl()->updatePolicy($policy);

// Delete a Policy
$policy = new Policy([
    'id' => 'c01a1f82-44be-41b0-a686-685fb6e0f485'
]);
$this->consul->acl()->deletePolicy($policy);

// List Policies
$policies = new Policies();
$this->consul->acl()->policies($policies);
```
### Roles
```php
// Create a Role
$role = new Role([
    "name" => "example-role",
    "description" => "Showcases all input parameters",
]);
$this->consul->acl()->role($role);

// Read a Role
$role = new Role([
    'id' => 'aa770e5b-8b0b-7fcf-e5a1-8535fcc388b4'
]);
$this->consul->acl()->readRole($role);

// Read a Role by Name
$name = new Role([
    'name' => 'example-role'
]);
$this->consul->acl()->readRoleByName($name);

// Update a Role
$role = new Role([
    'id' => 'aa770e5b-8b0b-7fcf-e5a1-8535fcc388b4',
    "name" => "example-two",
]);
$this->consul->acl()->updateRole($role);

// Delete a Role
$role = new Role([
    'id' => 'aa770e5b-8b0b-7fcf-e5a1-8535fcc388b4'
]);
$this->consul->acl()->deleteRole($role);

// List Roles
$roles = new Roles();
$this->consul->acl()->roles($roles);
```
### Auth Method
```php
// Create an Auth Method
$method = new AuthMethod([
    "Name" => "minikube",
    "Type" => "kubernetes",
    "Description" => "dev minikube cluster",
    "Config" => [
        "Host" => "https://192.0.2.42:8443",
        "CACert" => "-----BEGIN CERTIFICATE-----\n...-----END CERTIFICATE-----\n",
        "ServiceAccountJWT" => "eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9..."
    ]
]);
$this->consul->acl()->authMethod($method);

// Read an Auth Method
$method = new AuthMethod([
    'name' => 'minikube',
]);
$this->consul->acl()->readAuthMethod($method);

// Update an Auth Method
$method = new AuthMethod([
    "Name" => "minikube",
    "Type" => "kubernetes",
    "Description" => "dev minikube cluster",
    "Config" => [
        "Host" => "https://192.0.2.42:8443",
        "CACert" => "-----BEGIN CERTIFICATE-----\n...-----END CERTIFICATE-----\n",
        "ServiceAccountJWT" => "eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9..."
    ]
]);
$this->consul->acl()->updateAuthMethod($method);

// Delete an Auth Method
$method = new AuthMethod([
    "Name" => "minikube",
]);
$this->consul->acl()->deleteAuthMethod($method);

// List Auth Methods
$method = new AuthMethods();
$this->consul->acl()->authMethods($method);
```
### Binding Rules
```php
// Create a Binding Rule
$bindingRule = new BindingRule([
    "description" => "example rule",
    "authMethod" => "minikube",
    "Selector" => "serviceaccount.namespace==default",
    "BindType" => "service",
    "BindName" => "{{ serviceaccount.name }}"
]);
$this->consul->acl()->bindingRule($bindingRule);

// Read a Binding Rule
$bindingRule = new BindingRule([
    'id' => '000ed53c-e2d3-e7e6-31a5-c19bc3518a3d',
]);
$this->consul->acl()->readBindingRule($bindingRule);

// Update a Binding Rule
$bindingRule = new BindingRule([
    'id' => '000ed53c-e2d3-e7e6-31a5-c19bc3518a3d',
    "Description" => "updated rule",
    "authMethod" => "minikube",
    "Selector" => "serviceaccount.namespace=dev",
    "BindType" => "role",
    "BindName" => "{{ serviceaccount.name }}",
]);
$this->consul->acl()->updateBindingRule($bindingRule);

// Delete a Binding Rule
$bindingRule = new BindingRule([
    'id' => '000ed53c-e2d3-e7e6-31a5-c19bc3518a3d',
]);
$this->consul->acl()->deleteBindingRule($bindingRule);

// List Binding Rules
$bindingRules = new BindingRules();
$this->consul->acl()->bindingRules($bindingRules);
```
## Agent 
```php
// List Members
$this->consul->agent()->members(new Members([
    'wan' => 'a',
    'segment' => 'b',
]));

// Read Configuration
$self = new SelfParams();
$this->consul->agent()->self($self);

// Reload Agent
$reload = new Reload();
$this->consul->agent()->reload($reload);

// Enable Maintenance Mode
$maintenance = new Maintenance([
    'enable' => true,
    'reason' => 'whatever',
]);
$this->consul->agent()->maintenance($maintenance);

// View Metrics
$metrics = new Metrics([
    'format' => 'prometheus',
]);
$this->consul->agent()->metrics($metrics);

// Stream Logs
$monitor = new Monitor([
    'loglevel' => 'info',
]);
$this->consul->agent()->monitor($monitor);

// Join Agent
$join = new Join([
    'address' => '1.2.3.4',
    'wan' => false
]);
$this->consul->agent()->join($join);

// Graceful Leave and Shutdown
$leave = new Leave();
$this->consul->agent()->leave($leave);

// Force Leave and Shutdown
$forceLeave = new ForceLeave([
    'node' => 'consul'
]);
$this->consul->agent()->forceLeave($forceLeave);

// Update ACL Tokens
$token = new Token([
    'action' => 'acl_agent_token',
    'token' => 'token'
]);
$this->consul->agent()->token($token);
```
### Checks
```php
// List Checks
$checks = new Checks([
    'filter' => '',
]);
$this->consul->agent()->checks($checks);

// Register Check
$register = new Register([
    'name' => 'Memory_utilization', // No special characters such as spaces or other urls are allowed. Otherwise, the unchecked check_id will report 400 error.
    "notes" => "Ensure we don't oversubscribe memory",
    "DeregisterCriticalServiceAfter" => "90m",
    "Args" => ["/usr/local/bin/check_mem.py"],
    "DockerContainerID" => "f972c95ebf0e",
    "Shell" => "/bin/bash",
    "HTTP" => "https://example.com",
    "Method" => "POST",
    "Header" => ["x-foo" => ["bar", "baz"]],
    "TCP" => "example.com:22",
    "Interval" => "10s",
    "TTL" => "15s",
    "TLSSkipVerify" => true,
]);
$this->consul->agent()->register($register);

// Deregister Check
$deRegister = new DeRegister([
    'check_id' => 'Memory_utilization'
]);
$this->consul->agent()->deRegister($deRegister);

// TTL Check Pass
$pass = new Pass([
    'check_id' => 'Memory_utilization',
    'note' => 'consul',
]);
$this->consul->agent()->pass($pass);

// TTL Check Warn
$warn = new Warn([
    'check_id' => 'Memory_utilization',
    'note' => 'consul',
]);
$this->consul->agent()->warn($warn);

// TTL Check Fail
$fail = new Fail([
    'check_id' => 'Memory_utilization',
    'note' => 'consul',
]);
$this->consul->agent()->fail($fail);

// TTL Check Update
$update = new Update([
    'check_id' => 'Memory_utilization',
    'Status' => 'passing',
    'Output' => 'update success'
]);
$this->consul->agent()->update($update);
```
### Services
```php
// List Services
$services = new Services([
    'filter' => '',
]);
$this->consul->agent()->services($services);

// Get Service Configuration
 $service = new Service([
    'service_id' => "consul"
]);
$this->consul->agent()->service($service);

// Get local service health
$name = new Name([
    'service_name' => 'consul',
    'format' => 'text',
]);
$this->consul->agent()->name($name);

// Get local service health by its ID
$id = new ID([
    'service_id' => 'consul',
    'format' => 'text',
]);
$this->consul->agent()->id($id);

// Register Service
 $register = new Service\Register([
    "ID" => "redis1",
    "name" => "redis",
    "Tags" => [
        "primary",
        "v1"
    ],
    "Address" => "127.0.0.1",
    "Port" => 8000,
    "meta" => [
        "redis_version" => "4.0",
    ],
    "EnableTagOverride" => false,
    "Check" => [
        "DeregisterCriticalServiceAfter" => "90m",
    "Args" => ["/usr/local/bin/check_redis.py"],
    "HTTP" => "http://localhost:5000/health",
    "Interval" => "10s",
    "TTL" => "15s"
    ],
    "weights" => [
        "Passing" => 10,
    "Warning" => 1
    ]
]);
$this->consul->agent()->serviceRegister($register);

// Deregister Service
$deregister = new Service\DeRegister([
    'service_id' => 'consul',
]);
$this->consul->agent()->serviceDeregister($deregister);

// Enable Maintenance Mode
$maintenance= new Service\Maintenance([
    'service_id' => 'consul',
    'enable' => true,
    'reason' => ''
]);
$this->consul->agent()->serviceMaintenance($maintenance);
```
### Connect
```php
// Authorize
$authorize = new Authorize([
    "target" => "db",
    "clientCertURI" => "spiffe://dc1-7e567ac2-551d-463f-8497-f78972856fc1.consul/ns/default/dc/dc1/svc/web",
    "clientCertSerial" => "04:00:00:00:00:01:15:4b:5a:c3:94"
]);
$this->consul->agent()->authorize($authorize);

// Certificate Authority (CA) Roots
$roots = new Roots();
$this->consul->agent()->roots($roots);

// Service Leaf Certificate
$leaf = new Leaf([
    'service' => 'consul'
]);
$this->consul->agent()->leaf($leaf);
```
## Catalog
```php
// Register Entity
$register = new Register([
    "datacenter" => "dc1",
    "id" => "40e4a748-2192-161a-0510-9bf59fe950b5",
    "node" => "foobar",
    "Address" => "192.168.10.10",
    "TaggedAddresses" => [
        "lan" => "192.168.10.10",
    "wan" => "10.0.10.10"
    ],
    "NodeMeta" => [
        "somekey" => "somevalue"
    ],
    "Service" => [
        "ID" => "redis1",
    "Service" => "redis",
    "Tags" => [
            "primary",
            "v1"
        ],
    "Address" => "127.0.0.1",
    "TaggedAddresses" => [
            "lan" => [
                "address" => "127.0.0.1",
        "port" => 8000,
      ],
      "wan" => [
                "address" => "198.18.0.1",
        "port" => 80
      ]
    ],
    "Meta" => [
            "redis_version" => "4.0"
    ],
    "Port" => 8000
    ],
    "Check" => [
        "Node" => "foobar",
    "CheckID" => "service:redis1",
    "Name" => "Redis health check",
    "Notes" => "Script based health check",
    "Status" => "passing",
    "ServiceID" => "redis1",
    "Definition" => [
            "TCP" => "localhost:8888",
      "Interval" => "5s",
      "Timeout" => "1s",
      "DeregisterCriticalServiceAfter" => "30s"
    ]
    ],
    "SkipNodeUpdate" => false
]);
$this->consul->catalog()->register($register);

// Deregister Entity
$deregister = new Deregister([
    "datacenter" => "dc1",
    "node" => "foobar",
    "CheckID" => "service:redis1",
]);
$this->consul->catalog()->deRegister($deregister);

// List Datacenters
$datacenters = new Datacenters();
$this->consul->catalog()->dataCenters($datacenters);

// List Nodes
$nodes = new Nodes([
    'dc' => 'dc1',
    'node-meta' => '',
    'near' => '',
    'filter' => '',
]);
$this->consul->catalog()->nodes($nodes);

// List Services
$nodes = new Nodes([
$services = new Services([
    'dc' => 'dc1',
    'node-meta' => '',
]);
$this->consul->catalog()->services($services);
]);
$this->consul->catalog()->nodes($nodes);

// List Nodes for Service
$services = new Services([
    'dc' => 'a',
    'node-meta' => 'b',
]);
$this->consul->catalog()->services($services);

// List Nodes for Connect-capable Service
$service = new Service([
    'service' => 'consul',
    'dc' => 'dc1',
    'tag' => '',
    'near' => '',
    'node-meta' => '',
    'filter' => '',
]);
$this->consul->catalog()->service($service);

// List Services for Node
$connect = new Connect([
    'service' => 'consul',
    'dc' => 'dc1',
    'tag' => '',
    'near' => '',
    'node-meta' => '',
    'filter' => '',
]);
$this->consul->catalog()->connect($connect);

// List Services for Node
$node = new Node([
    'node' => '2eb87046a6fe',
    'dc' => 'dc1',
    'filter' => '',
]);
$this->consul->catalog()->node($node);
```
## Config
```php
// Apply Configuration
$config = new \EasySwoole\Consul\Request\Config([
    'Kind' => 'service-defaults',
    'Name' => 'web',
    'Protocol' => 'Http'
]);
$this->consul->config()->config($config);

// Get Configuration
$config = new \EasySwoole\Consul\Request\Config([
    'Kind' => 'service-defaults',
    'name' => 'web',
]);
$this->consul->config()->getConfig($config);

// List Configurations
$config = new \EasySwoole\Consul\Request\Config([
    'Kind' => 'service-defaults'
]);
$this->consul->config()->listConfig($config);

// Delete Configuration
$config = new \EasySwoole\Consul\Request\Config([
    'Kind' => 'service-defaults',
    'name' => 'web',
]);
$this->consul->config()->deleteConfig($config);
```
## Connect
### Certificate Authority (CA) 
```php
// List CA Root Certificates
$roots = new Roots();
$this->consul->connect()->roots($roots);

// Get CA Configuration
$configuration = new Configuration();
$this->consul->connect()->configuration($configuration);

// Update CA Configuration
$configuration = new Configuration([
    'Provider' => 'consul',
    'Config' => [
        'LeafCertTTL' => '72h'
    ]
]);
$this->consul->connect()->updateConfiguration($configuration);
```
### Intentions
```php
// Create Intention
$intentions = new Intentions([
    'SourceName' => 'web',
    'DestinationName' => 'db',
    'SourceType' => 'consul',
    'action' => 'allow'
]);
$this->consul->connect()->intentions($intentions);

// Read Specific Intention
$intentions = new Intentions([
    'uuid' => 'e9ebc19f-d481-42b1-4871-4d298d3acd5c',
]);
$this->consul->connect()->readIntention($intentions);

// List Intentions
$intentions = new Intentions();
$this->consul->connect()->listIntention($intentions);

// Update Intention
$intentions = new Intentions([
    'uuid' => 'b40faaf3-34aa-349f-3cf2-f5d720240662',
    'description' => 'just a test description',
    'SourceName' => '',
    'DestinationName' => '',
    'Action' => 'allow'
]);
$this->consul->connect()->updateIntention($intentions);

// Delete Intention
$intentions = new Intentions([
    'uuid' => 'b40faaf3-34aa-349f-3cf2-f5d720240662',
]);
$this->consul->connect()->deleteIntention($intentions);

// Check Intention Result
$intentions = new Intentions\Check([
    'source' => 'web',
    'destination' => 'db',
]);
$this->consul->connect()->check($intentions);

// List Matching Intentions
$intentions = new Intentions\Match([
    'by' => 'source',
    'name' => 'web',
]);
$this->consul->connect()->match($intentions);
```
## Coordinate
```php
// Read WAN Coordinates
$datacenters = new Datacenters();
$this->consul->coordinates()->datacenters($datacenters);

// Read LAN Coordinates for all nodes
$nodes = new Nodes([]);
$this->consul->coordinates()->nodes($nodes);

// Read LAN Coordinates for a node
$node = new Node([
    'node' => '2456c2850382',
]);
$this->consul->coordinates()->node($node);

// Update LAN Coordinates for a node
$update = new Update([
    'dc' => 'dc1',
    'node' => '2456c2850382',
    'Segment' => 'update',
    "Coord" => [
        "Adjustment" => 0,
        "Error" => 1.5,
        "Height" => 0,
        "Vec" => [0, 0, 0, 0, 0, 0, 0, 0]
    ]
]);
$this->consul->coordinates()->update($update);
```
## Events
```php
// Fire Event
$fire = new Fire([
    'name' => 'consul',
    'dc' => 'dc1',
]);
$this->consul->event()->fire($fire);

// List Events
$listEvent = new ListEvent([
    'name' => 'consul',
]);
$this->consul->event()->listEvent($listEvent);
```
## Health
```php
// List Checks for Node
$node = new Node([
    'node' => '2456c2850382',
    'dc' => 'dc1',
]);
$this->consul->health()->node($node);

// List Checks for Service
$checks = new Checks([
   'service' => 'consul',
   'node_meta' => 'node-meta',
]);
$this->consul->health()->checks($checks);

// List Nodes for Service
$service = new Service([
    'service' => 'consul',
    'dc' => 'dc1',
]);
$this->consul->health()->service($service);

// List Nodes for Connect-capable Service
$connect = new Connect([
    'service' => 'consul'
]);
$this->consul->health()->connect($connect);

// List Checks in State
$state = new State([
    'state' => 'passing'
]);
$this->consul->health()->state($state);
```
## KV Store
```php
// Read Key
$kv = new Kv([
    'key' => 'my-key',
    'dc' => 'dc1',
]);
$this->consul->kvStore()->kv($kv);

// Create Key
$create = new kv([
    'key' => 'my-key',
    'dc' => 'dc1',
]);
$this->consul->kvStore()->create($create);

// Update Key
$update = new kv([
    'key' => 'my-key',
    'dc' => 'dc1',
]);
$this->consul->kvStore()->update($update);

// Delete Key
$delete = new Kv([
    'key' => 'my-key',
    'recurse' => false,
]);
$this->consul->kvStore()->delete($delete);
```
## Operator
### Area
```php
// Create Network Area
$area = new Area([
    'PeerDatacenter' => 'dc1',
    "RetryJoin" => [ "10.1.2.3", "10.1.2.4", "10.1.2.5" ],
    "UseTLS" => false
]);
$this->consul->operator()->area($area);

// List Network Areas
$area = new Area([
    'dc' => 'dc1',
    'uuid' => '10275a2e-aa8f-2cf3-0adf-ff03d8950902',
]);
$this->consul->operator()->areaList($area);

// List Specific Network Area
$area = new Area([
    'dc' => 'dc1',
    'uuid' => '10275a2e-aa8f-2cf3-0adf-ff03d8950902',
]);
$this->consul->operator()->areaList($area);

// Update Network Area
$area = new Area([
    'uuid' => '10275a2e-aa8f-2cf3-0adf-ff03d8950902',
    'UseTLS' => true,
    'dc' => 'dc1',
]);
$this->consul->operator()->updateArea($area);

// Delete Network Area
$area = new Area([
    'uuid' => '10275a2e-aa8f-2cf3-0adf-ff03d8950902',
]);
$this->consul->operator()->deleteArea($area);

// Join Network Area
$area = new Area([
    'uuid' => '10275a2e-aa8f-2cf3-0adf-ff03d8950902',
]);
$this->consul->operator()->joinArea($area);

// List Network Area Members
$area = new Area([
    'uuid' => '10275a2e-aa8f-2cf3-0adf-ff03d8950902'
]);
$this->consul->operator()->membersArea($area);
```
### Autopilot
```php
// Read Configuration
$configuration = new Configuration([
    'dc' => 'dc1',
    'stale' => true,
]);
$this->consul->operator()->getConfiguration($configuration);

// Update Configuration
$configuration = new Configuration([
    'dc' => 'dc1',
    'stale' => true,
    "cleanupDeadServers" => true,
    "lastContactThreshold" => "200ms",
    "MaxTrailingLogs" => 250,
    "ServerStabilizationTime" => "10s",
    "RedundancyZoneTag" => "",
    "DisableUpgradeMigration" => false,
    "UpgradeVersionTag" => "",

]);
$this->consul->operator()->updateConfiguration($configuration);

// Read Health
$health = new Health([
    'dc' => 'dc1',
]);
$this->consul->operator()->health($health);
```
### Keyring
```php
// List Gossip Encryption Keys
$keyring = new Keyring();
$keyring->setRelayFactor(0);
$keyring->setLocalOnly(false);
$this->consul->operator()->getKeyring($keyring);

// Add New Gossip Encryption Key
$keyring = new Keyring([
    "Key" => "3lg9DxVfKNzI8O+IQ5Ek+Q==",
    'relayFactor' => 1,
]);
$this->consul->operator()->addKeyring($keyring);

// Change Primary Gossip Encryption Key
$keyring = new Keyring([
    "Key" => "3lg9DxVfKNzI8O+IQ5Ek+Q==",
]);
$this->consul->operator()->changeKeyring($keyring);

// Delete Gossip Encryption Key
$keyring = new Keyring([
    "Key" => "3lg9DxVfKNzI8O+IQ5Ek+Q==",
    "relayFactor" => 1
]);
$this->consul->operator()->deleteKeyring($keyring);
```
### License
```php
// Getting the Consul License
$license = new License([
    'dc' => 'dc1',
]);
$this->consul->operator()->getLicense($license);

// Updating the Consul License
$license = new License([
    'dc' => 'dc1'
]);
$this->consul->operator()->updateLicense($license);

// Resetting the Consul License
$license = new License([
    'dc' => 'dc1'
]);
$this->consul->operator()->resetLicense($license);
```
### Raft
```php
// Read Configuration
$raft = new \EasySwoole\Consul\Request\Operator\Raft\Configuration();
$this->consul->operator()->getRaftConfiguration($raft);

// Delete Raft Peer
$peer = new Peer([
    'address' => '172.17.0.18:8301',
    'dc' => 'dc1',
]);
$this->consul->operator()->peer($peer);
```
### Segment
```php
// List Network Segments
$segment = new Segment();
$this->consul->operator()->segment($segment);
```
## Prepared Query
```php
// Create Prepared Query
$query = new Query([
    "name" => "my-query",
    "Session" => "adf4238a-882b-9ddc-4a9d-5b6758e4159e",
    "Token" => "11",
    "Service" => [
        "Service" => "redis",
        "Failover" => [
            "NearestN" => 3,
            "Datacenters" => ["dc1", "dc2"]
         ],
        "Near" => "node1",
        "OnlyPassing" => false,
        "Tags" => ["primary", "!experimental"],
        "NodeMeta" => ["instance_type" => "m3.large"],
        "ServiceMeta" => ["environment" => "production"]
    ],
    "DNS" => [
        "TTL" => "10s"
    ],
]);
$this->consul->query()->query($query);

// Read Prepared Query
$query = new Query([
    'dc' => 'dc1'
]);
$this->consul->query()->readQuery($query);

// Update Prepared Query
$query = new Query([
    'uuid' => '90dce5ca-5697-ae2f-09ae-51e9542ea58c',
    'dc' => 'dc1',
]);
$this->consul->query()->updateQuery($query);;

// Read Prepared Query
$query = new Query([
    'dc' => 'dc1'
]);
$this->consul->query()->readQuery($query);

// Delete Prepared Query
$query = new Query([
    'uuid' => '90dce5ca-5697-ae2f-09ae-51e9542ea58c'
]);
$this->consul->query()->deleteQuery($query);;

// Execute Prepared Query
$execute = new Query\Execute([
    'uuid' => '90dce5ca-5697-ae2f-09ae-51e9542ea58c',
    'dc' => 'dc1',
]);
$this->consul->query()->execute($execute);

// Explain Prepared Query
$execute = new Query\Explain([
    'uuid' => '90dce5ca-5697-ae2f-09ae-51e9542ea58c',
    'dc' => 'dc1',
]);
$this->consul->query()->explain($execute);
```
## Sessions
```php
// Create Session
$create = new Create([
    'dc' => 'dc1',
    "LockDelay" => "15s",
    "Name" => "my-service-lock",
    "Node" => "foobar",
    "Checks" => ["a", "b", "c"],
    "Behavior" => "release",
    "TTL" => "30s",
]);
$this->consul->session()->create($create);

// Delete Session
$destroy = new Destroy([
    'uuid' => 'f32a15b3-1baa-c047-bde9-bec3015ea013',
    'dc' => 'dc1',
]);
$this->consul->session()->destroy($destroy);

// Read Session
$info = new Info([
    'uuid' => 'f32a15b3-1baa-c047-bde9-bec3015ea013',
    'dc' => 'dc1',
]);
$this->consul->session()->info($info);

// List Sessions for Node
$node = new Node([
    'node' => '2456c2850382',
    'dc' => 'dc1',
]);
$this->consul->session()->node($node);

// List Sessions
$sessionList = new SessionList([
    'dc' => 'dc1'
]);
$this->consul->session()->sessionList($sessionList);

// Renew Session
$renew = new Renew([
    'uuid' => '4f6d1cf6-b60a-c929-eeb8-12f4d7eaff62',
    'dc' => 'dc1'
]);
$this->consul->session()->renew($renew);
```
## Snapshots
```php
// Generate Snapshot
$generate = new Snapshot([
    'dc' => 'dc1',
    'stale' => 'true',
]);
$this->consul->snapshot()->generate($generate);

// Restore Snapshot
$restore = new Snapshot();
$this->consul->snapshot()->restore($restore);
```

## Status
```php
// Get Raft Leader
$leader = new Leader();
$this->consul->status()->leader($leader);

// List Raft Peers
$peers = new Peers([
    'dc' => 'dc1',
]);
$this->consul->status()->peers($peers);
```
## Transactions
```php
// Create Transaction
$transaction = new Txn([]);
$this->consul->transaction()->create($transaction);
```

```php
$node = new Node([
    'node' => '44e4656a94cd',
    'dc' => 'dc1',
    'filter' => '',
]);
$consul->catalog()->node($node);

```
