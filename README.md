# customer-auth-server

Simple expressjs app illustrating how to create a customer-side http server to authenticate calls and registration attempts on the jambonz platform.

#### Configuring
This application uses the [config](https://www.npmjs.com/package/config) package for managing configuration.  A sample configuration file is shown below.  In this simple example, a list of sip credentials is maintained in the configuration file that are used for authenticating requests.  The configuration also specifies the port to listen on for incoming requests and whether to use HTTP Basic Authentication to protect the endpoint.
```
{
  "server": {
    "port": 4000,
    "path": "/auth",
    "auth": {
      "users": {
        "foo": "bar"
      }
    }
  },
  "credentials": {
    "jambonz.org": [
      {
        "username": "john",
        "password": "1234",
        "expires": 300,
        "call_hook": "http://127.0.0.1/call",
        "call_status_hook": "http://127.0.0.1/call-status"
      },
      {
        "username": "jane",
        "password": "5678",
        "expires": 45
      }
    ],
    "sip.example.com": [
      {
        "username": "todd",
        "password": "1234"
      }
    ]
  }
}
```
#### Running
Once a configuration file is in place, simply install and run the application:
```
$ npm install
$ npm start
```
Note: a docker image for the server is available at `jambonz/customer-auth-server:latest`.  When using the docker image, provide the configuration settings via the [NODE_CONFIG](https://github.com/lorenwest/node-config/wiki/Environment-Variables#node_config) environment variable.
