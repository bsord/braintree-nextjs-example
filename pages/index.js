import BraintreeDropIn from "../components/BraintreeDropIn";
import { Container, TableContainer, Table, Thead, Tr, Tbody, Td, Input, Button, Tabs, TabList, TabPanels, Tab, TabPanel, Center} from "@chakra-ui/react";
import { generateClientToken } from '../pages/api/clientToken';
import {useState} from "react";

export async function getServerSideProps(context) {
  const clientToken = await generateClientToken()
  console.log(clientToken)
  return {
    props: {clientToken: clientToken.clientToken},
  }
}

export default function Home({clientToken}) {
  const [showBraintreeDropIn, setShowBraintreeDropIn] = useState(false);
  const [numberOfProducts, setNumberOfProducts] = useState(1);
  const [paymentMethodData, setPaymentMethodData] = useState(undefined)
  const [transactionData, setTransactionData] = useState(undefined)
  const [processingTransaction, setProcessingTransaction] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const PRICE = 10;

  const startOver = () => {
    setTransactionData(undefined)
    setPaymentMethodData(undefined)
    setShowBraintreeDropIn(false)
    setTabIndex(0)

  }
  const createTransaction = () => {
    setProcessingTransaction(true)
    fetch('/api/checkout', {
      body: JSON.stringify({
        nonce: paymentMethodData.nonce,
        deviceData: paymentMethodData.deviceData,
        amount: PRICE
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }).then(transactionResponse=>{ return transactionResponse.json()}).then(transactionResults => {
      console.log(transactionResults.transaction)
      setTransactionData(transactionResults.transaction)
      setProcessingTransaction(false)
      setTabIndex(2)
    })
  }

  return (
    <Container maxW='container.xl'>

      <Tabs isFitted variant='enclosed' index={tabIndex}>

        <TabList mb='1em'>
          <Tab >Shop</Tab>
          <Tab >Checkout</Tab>
          <Tab >Receipt</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Td>Product</Td>
                  <Td>Price</Td>
                  <Td>Quantity</Td>
                  <Td>Total</Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Foo Product</Td>
                  <Td>${PRICE}</Td>
                  <Td>
                    <Input
                      placeholder="0"
                      min={1}
                      max={100}
                      type="number"
                      step="1"
                      value={numberOfProducts}
                      onChange={((e) => {
                          setNumberOfProducts(e.target.value)
                      })}
                    />
                  </Td>
                  <Td>${numberOfProducts * PRICE}</Td>
                  <Td>
                    
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            <Center>
              <Button
                onClick={() => {setShowBraintreeDropIn(true); setTabIndex(1)}}
                disabled={showBraintreeDropIn}
              >
                Checkout
              </Button>
            </Center>
          </TabPanel>


          <TabPanel >
            <BraintreeDropIn
                show={showBraintreeDropIn}
                onPaymentMethodConfirmed={(paymentMethodData) => {
                    setShowBraintreeDropIn(false);
                    setNumberOfProducts(1);
                    setPaymentMethodData(paymentMethodData)
                    console.log(paymentMethodData.nonce)
                    
                }}
                onPaymentMethodError={(error) => {
                  console.log(error)
                }}
                clientToken={clientToken}
            />
            <Button hidden={paymentMethodData === undefined} onClick={(e)=>{createTransaction(); }}> {processingTransaction? "Processing" : "Complete Payment"}</Button>
          </TabPanel>


          <TabPanel>
            {transactionData? <div>
              {transactionData.id}
            </div>:null}
            <Button
              onClick={() => {startOver()}}
              disabled={showBraintreeDropIn}
            >
              Start Over
            </Button>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <TableContainer>
          

          
          
      </TableContainer>
    </Container>
  )
}
