## Ledger demo



## Production Deployment

Export the target name of the heroku app into a local system environment variable as the side-cared application 'dash' sidecar.
The side-cared application will be in this example 'node-demo'.

```bash
export APP_NAME=ledger-demo
```

Take in account the organization name for the deployment. In the following example code we will use "vot-dev".
Create a Heroku application by running this command:

```bash
heroku create $APP_NAME --no-remote -o vot-dev
```

Create a configuration variable for the side-cared application name, host and port.
In this case we use a given node-demo app in heroku

```bash
heroku config:set --app $APP_NAME GITHUB_TOKEN=d9899285b47f0555a60f35f21bc8473b2f4d887b
```

Deploy the app to Heroku using maven (activate 'heroku' spring-profile):

```bash
mvn clean install -P heroku -DskipTests
```

## Viewing Your Application

```bash
heroku open --app $APP_NAME
```

Viewing the logs:

```bash
heroku logs --tail --app $APP_NAME
```

## Checking in Eureka

if you have curl installed try with the following, you probably have to build the authorization token depending the Eureka credentials
I have used node-vault-demo for the snippet.

```bash
curl -X GET \
  https://tme-eureka-dev.herokuapp.com/eureka/apps/NODE-VAULT-DEMO-SIDECAR \
  -H 'accept: application/json' \
  -H 'authorization: Basic dXNlcjpjaGFuZ2VpdA=='
```

the result should resemble like this:

```json
{
  "application": {
    "name": "NODE-VAULT-DEMO-SIDECAR",
    "instance": [
      {
        "instanceId": "92a59736-c122-431c-8465-f36398791c33.prvt.dyno.rt.heroku.com:node-vault-demo-sidecar:57613",
        "hostName": "node-vault-demo.herokuapp.com",
        "app": "NODE-VAULT-DEMO-SIDECAR",
        "ipAddr": "172.16.44.198",
        "status": "UP",
        "overriddenstatus": "UNKNOWN",
        "port": {
          "$": 80,
          "@enabled": "true"
        },
        "securePort": {
          "$": 443,
          "@enabled": "false"
        },
        "countryId": 1,
        "dataCenterInfo": {
          "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
          "name": "MyOwn"
        },
        "leaseInfo": {
          "renewalIntervalInSecs": 10,
          "durationInSecs": 90,
          "registrationTimestamp": 1495537447691,
          "lastRenewalTimestamp": 1495537967854,
          "evictionTimestamp": 0,
          "serviceUpTimestamp": 1495537447691
        },
        "metadata": {
          "@class": "java.util.Collections$EmptyMap"
        },
        "homePageUrl": "http://node-vault-demo.herokuapp.com:80/",
        "statusPageUrl": "http://node-vault-demo.herokuapp.com:57613/info",
        "healthCheckUrl": "http://node-vault-demo.herokuapp.com:57613/health",
        "vipAddress": "node-vault-demo-sidecar",
        "secureVipAddress": "node-vault-demo-sidecar",
        "isCoordinatingDiscoveryServer": "false",
        "lastUpdatedTimestamp": "1495537447691",
        "lastDirtyTimestamp": "1495537447130",
        "actionType": "ADDED"
      }
    ]
  }
}
```

Enjoy you service discovery.

## Further Reading

+ [Spring could sidecar reference](http://projects.spring.io/spring-cloud/spring-cloud.html#_polyglot_support_with_sidecar)
+ [Spring cloud sidecar in DZone](https://dzone.com/articles/spring-cloud-sidecar)
+ [Spring cloud sidecar github repo](https://github.com/spring-cloud/spring-cloud-netflix/tree/master/spring-cloud-netflix-sidecar)
