import "./App.css";
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk, { waitForConfirmation } from "algosdk";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ReactDOM from 'react-dom/client';
import { useEffect, useState } from "react";

//const crypto = require("crypto");

const peraWallet = new PeraWalletConnect();

// The app ID on testnet
// RPS app
const appIndex = 205065607;
const appAddress = "YQLJYL7WEXYHO353MK7DBRKGLU4YVNZ7DNX4UI3LXEHRMLA73IFZ6DUTCQ";

// connect to the algorand node
// token, address(server), port
const algod = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  443
);

function App() {
  const [accountAddress, setAccountAddress] = useState('');
  const [local_farmer, set_local_farmer] = useState('');
  const [local_coffee_guid, set_local_coffee_guid] = useState('');
  const [local_coffee_type, set_local_coffee_type] = useState('');
  const [local_coffee_roaster, set_local_coffee_roaster] = useState('');
  const [local_coffee_batch_number, set_local_coffee_batch_number] = useState('');
  const [local_coffee_batch_size, set_local_coffee_batch_size] = useState('');

  const isConnectedToPeraWallet = !!accountAddress; //convert string to boolean

  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
        console.log(accounts);
        if (accounts.length) {
          setAccountAddress(accounts[0]);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <Container style={{backgroundColor: "#3A86B7"}}>
      <meta name="name" content="Testing frontend for PyTeal" />
      <h1> PyTeal: Coffee traceability smart contract </h1>
      <Row>
        <Col>
          <Button
            onClick={
              isConnectedToPeraWallet
                ? handleDisconnectWalletClick
                : handleConnectWalletClick
            }
          >
            {isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"}
          </Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <Button onClick={() => optInRpsApp()}>OptIn</Button>
        </Col>
      </Row>
      <br />
      <br />
      <form>
      <label>Coffee guid :
        <input
          type="number" 
          value={local_coffee_guid}
          onChange={(e) => set_local_coffee_guid(e.target.value)}
        />
      </label>
    </form>
    <br />
      <form>
      <label>Coffee Type :
        <input
          type="number" 
          value={local_coffee_type}
          onChange={(e) => set_local_coffee_type(e.target.value)}
        />
      </label>
    </form>
    <br />
      <form>
      <label>Coffee Roaster :
        <input
          type="number" 
          value={local_coffee_roaster}
          onChange={(e) => set_local_coffee_roaster(e.target.value)}
        />
      </label>
    </form>
    <br />
      <form>
      <label>Coffee Batch Number :
        <input
          type="number" 
          value={local_coffee_batch_number}
          onChange={(e) => set_local_coffee_batch_number(e.target.value)}
        />
      </label>
    </form>
    <br />
      <form>
      <label>Coffee Batch Size :
        <input
          type="number" 
          value={local_coffee_batch_size}
          onChange={(e) => set_local_coffee_batch_size(e.target.value)}
        />
      </label>
    </form>
    <br />
    <br />

    <Row>
        <Col>
          <Button onClick={() => createCoffeeApplication()}>Create Coffee Application</Button>
        </Col>
        <Col>
          <Button onClick={() => receiveCoffee()}>Receive coffee</Button>
        </Col>
        <Col>
          <Button onClick={() => processCoffee()}>Process coffee</Button>
        </Col>
        <Col>
          <Button onClick={() => packCoffee()}>Pack coffee</Button>
        </Col>
        <Col>
          <Button onClick={() => shipCoffee()}>Ship coffee</Button>
        </Col>
        <Col>
          <Button onClick={() => receiveAtPort()}>Receive at port</Button>
        </Col>
        <Col>
          <Button onClick={() => roastCoffee()}>Roast coffee</Button>
        </Col>
        <Col>
          <Button onClick={() => exportCoffee()}>Export coffee</Button>
        </Col>

</Row>




    </Container>
    
  );

  


  function handleConnectWalletClick() {
    peraWallet
      .connect()
      .then((newAccounts) => {
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
        setAccountAddress(newAccounts[0]);
      })
      .catch((error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error);
        }
      });
  }

  function handleDisconnectWalletClick() {
    peraWallet.disconnect();
    setAccountAddress(null);
  }

  async function optInRpsApp() {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();

      const actionTx = algosdk.makeApplicationOptInTxn(
        accountAddress,
        suggestedParams,
        appIndex
      );

      const actionTxGroup = [{ txn: actionTx, signers: [accountAddress] }];

      const signedTx = await peraWallet.signTransaction([actionTxGroup]);
      console.log(signedTx);
      const { txId } = await algod.sendRawTransaction(signedTx).do();
      const result = await waitForConfirmation(algod, txId, 2);
    } catch (e) {
      console.error(`There was an error calling the app: ${e}`);
    }
  }


async function createCoffeeApplication() {
      try {
        //   setRealHand(hand);
        // get suggested params
        const suggestedParams = await algod.getTransactionParams().do();
        const appArgs = [
            new Uint8Array(Buffer.from("accept")), 
            new Uint8Array(Buffer.from(JSON.stringify(local_farmer))),
            new Uint8Array(Buffer.from(JSON.stringify(local_coffee_guid))),
            new Uint8Array(Buffer.from(JSON.stringify(local_coffee_guid))),
            new Uint8Array(Buffer.from(JSON.stringify(local_coffee_roaster))),
            new Uint8Array(Buffer.from(JSON.stringify(local_coffee_batch_size))),
            new Uint8Array(Buffer.from(JSON.stringify(local_coffee_batch_number)))



    
        ];
  
        const accounts = ["VPFT5JEZ6SKPTMTSMJUATZZHNYDCMMG6IXHY3U6333U5GWGOZWOK6CXC7M"];
  
        let actionTx = algosdk.makeApplicationNoOpTxn(
          accountAddress,
          suggestedParams,
          appIndex,
          appArgs,
          accounts
        );
        
        let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: accountAddress,
          to: appAddress,
          amount: 100000,
         suggestedParams: suggestedParams,
        });
        let txns = [actionTx, payTx];
        algosdk.assignGroupID(txns);
  
        const actionTxGroup = [
          { txn: actionTx, signers: [accountAddress] },
          { txn: payTx, signers: [accountAddress] }
        ];
  
        const signedTxns = await peraWallet.signTransaction([actionTxGroup]);
  
        console.log(signedTxns);
        const { txId } = await algod.sendRawTransaction(signedTxns).do();
        const result = await waitForConfirmation(algod, txId, 4);
        // checkCounterState();
      } catch (e) {
        console.error(`There was an error calling the app: ${e}`);
      }
    }
  
  

async function receiveCoffee(local_farmer, local_coffee_roaster) {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
        const appArgs = [
        new Uint8Array(Buffer.from("accept")), // naziv dugmeta za receiveCoffee
        new Uint8Array(Buffer.from(JSON.stringify(local_farmer))),
        new Uint8Array(Buffer.from(JSON.stringify(local_coffee_roaster)))

      ];

      const accounts = ["D2PNCTZN2NDLMGP6ZLRGW6OPXK7QG22AO5EIQL2H254USDU3AQCFCCV6DA"];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        accounts,
        appArgs
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] }
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  async function processCoffee(local_coffee_batch_size) {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
        const appArgs = [
        new Uint8Array(Buffer.from("accept")), // naziv dugmeta za processCoffee
        new Uint8Array(Buffer.from(JSON.stringify(local_coffee_batch_size)))

      ];

      const accounts = ["VPFT5JEZ6SKPTMTSMJUATZZHNYDCMMG6IXHY3U6333U5GWGOZWOK6CXC7M"];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        accounts,
        appArgs
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] }
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  async function packCoffee(local_coffee_batch_size) {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
        const appArgs = [
        new Uint8Array(Buffer.from("accept")), // naziv dugmeta za packCoffee
        new Uint8Array(Buffer.from(JSON.stringify(local_coffee_batch_size)))

      ];

      const accounts = ["VPFT5JEZ6SKPTMTSMJUATZZHNYDCMMG6IXHY3U6333U5GWGOZWOK6CXC7M"];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        accounts,
        appArgs
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] }
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  async function shipCoffee(local_coffee_batch_number) {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
        const appArgs = [
        new Uint8Array(Buffer.from("accept")), // naziv dugmeta za shipCoffee
        new Uint8Array(Buffer.from(JSON.stringify(local_coffee_batch_number)))

      ];

      const accounts = ["VPFT5JEZ6SKPTMTSMJUATZZHNYDCMMG6IXHY3U6333U5GWGOZWOK6CXC7M"];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        accounts,
        appArgs
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] }
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

 async function receiveAtPort(local_coffee_batch_size, local_coffee_batch_number, local_coffee_roaster) {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
        const appArgs = [
        new Uint8Array(Buffer.from("accept")), // naziv dugmeta za receive
        new Uint8Array(Buffer.from(JSON.stringify(local_coffee_batch_size))),
        new Uint8Array(Buffer.from(JSON.stringify(local_coffee_batch_number))),
        new Uint8Array(Buffer.from(JSON.stringify(local_coffee_roaster)))


      ];

      const accounts = ["D2PNCTZN2NDLMGP6ZLRGW6OPXK7QG22AO5EIQL2H254USDU3AQCFCCV6DA"];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        accounts,
        appArgs
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] }
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  async function roastCoffee(local_coffee_roaster) {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
        const appArgs = [
        new Uint8Array(Buffer.from("accept")), // naziv dugmeta za roastCoffee
        new Uint8Array(Buffer.from(JSON.stringify(local_coffee_roaster)))

      ];

      const accounts = ["VPFT5JEZ6SKPTMTSMJUATZZHNYDCMMG6IXHY3U6333U5GWGOZWOK6CXC7M"];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        accounts,
        appArgs
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] }
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  async function exportCoffee(local_coffee_guid, local_coffee_roaster) {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
        const appArgs = [
        new Uint8Array(Buffer.from("accept")), // naziv dugmeta za exportCoffee
        new Uint8Array(Buffer.from(JSON.stringify(local_coffee_guid))),
        new Uint8Array(Buffer.from(JSON.stringify(local_coffee_roaster)))


      ];

    

      const accounts = ["VPFT5JEZ6SKPTMTSMJUATZZHNYDCMMG6IXHY3U6333U5GWGOZWOK6CXC7M"];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        accounts,
        appArgs
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] }
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }
}
export default App;
