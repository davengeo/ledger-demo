## Ledger demo

This is a brief demo of the meaning of block-chain and how to adapt this technology to supply chain problems.

This example is not intended to be:

 - A proposal for implementation. 
 - A complete mapping of any domain business.
 - A guideline
 
 For this demo we use the web-ledger proposal coming from W3C
 
 + [W3C web ledger](https://w3c.github.io/web-ledger/)
 
 And A github as repository for the distributed ledger.

 + [Ledger repository](https://github.com/davengeo/ledger-repo)
 
 In the ledger repository there is webhook for all the push events.
 
 This webhook is currently installed in heroku and accessible as 
 
 + [Heroku webhook](https://ledger-demo.herokuapp.com/webhook)
 
## Configuration

It is only needed to start the app as a node app. 

```bash
$ npm install
$ node app

0 "memento OK" => loaded
1 "logger OK" => loaded
2 "Express OK" => loaded
3 "Git repository cloned" => loaded
======= pre initialized =======
0 "1 blocks added to index OK" => loaded
====== post initialized =======
Server listening on port 3000
```

You have to copy any valid github public and private keys in the config directory
 
```bash
$ ls config/*

default.json        id_rsa              storage-block.json
genesis.json        id_rsa.pub
``` 

## REST Api

### Create a block, view the block

POST http://localhost:3000/ledger with payload

```json
{
	"claim": {
		"verb": "order",
		"name": "paper",
		"value": 1000
	},
	"recipient": "david"
}
```

produces a new block in the ledger

```json
{
  "message": "block appended",
  "block_id": "did:5c8f0290-4788-11e7-96c5-0dbe70981869"
}
```
GET http://localhost:3000/ledger/did:5c8f0290-4788-11e7-96c5-0dbe70981869

renders the content of the block

```json
{
  "@context": [
    "https://w3id.org/web-ledger/v1",
    "EA-Davengeo"
  ],
  "id": "did:5c8f0290-4788-11e7-96c5-0dbe70981869",
  "type": "LedgerStorageBlock",
  "setObject": [
    {
      "claim": {
        "verb": "order",
        "name": "paper",
        "value": 10
      },
      "recipient": "david",
      "tm": 1496403665209
    }
  ],
  "previousBlock": {
    "id": "did:f6ea280f-8011-4502-a29f-464954de3427",
    "hash": "urn:sha256:f8cc683279303aa75d823aa03b97f6e053e69c415d2ac3d0ee69b040f7bd7f19"
  },
  "signature": ""
}
```

### Groups and queries

```bash
curl -X GET \
  'http://localhost:3000/group/david?name=paper&verb=consume'  
```

Calculate the amount of *consume* of *paper* made by the actor *david*.


```bash
curl -X GET \
  'http://localhost:3000/group/warehouse?name=paper&verb=inventory'  
```

Calculates the *inventory* state of the actor *warehouse*. Inventory is defined as *delivery* - *consume*.


### Pull and Push

```bash
curl -X POST http://localhost:3000/git/pull
```
produces the sync between the local repo and the remote repo in github.

```bash
curl -X POST http://localhost:3000/git/push
```
makes an automatic push of the new blocks into the remote ledger. This fails whether there is nothing to push.



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

Deploy the app to Heroku using maven (activate 'heroku' spring-profile):

```bash
git push heroku master
```

## Viewing Your Application

Viewing the logs:

```bash
heroku logs --tail --app $APP_NAME
```

## Further Reading

+ [How Blockchain Technology Is Reinventing Global Trade Efficiency](https://distributed.com/news/how-blockchain-technology-is-reinventing-global-trade-efficiency/)
+ [Hyperledger transaction family spec](http://intelledger.github.io/transaction_family_specifications.html)
+ [Toyota pushes into blockchain tech to enable the next generation of cars](https://techcrunch.com/2017/05/22/toyota-pushes-into-blockchain-tech-to-enable-the-next-generation-of-cars/)
+ [Blockchain as distributed database](https://medium.com/@sbmeunier/blockchain-technology-a-very-special-kind-of-distributed-database-e63d00781118)

