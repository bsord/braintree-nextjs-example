import React, {useEffect, useState} from 'react'
import dropin from "braintree-web-drop-in"
import {Button} from "@chakra-ui/react";


export default function BraintreeDropIn(props) {
  const { show, onPaymentMethodConfirmed, onPaymentMethodError, clientToken } = props;
  const [braintreeInstance, setBraintreeInstance] = useState(undefined)
  const [hideButton, setHideButton] = useState(true)

  

  useEffect(() => {
    if (show) {
      const initializeBraintree = () => dropin.create({
        authorization: clientToken, 
        container: '#braintree-drop-in-div',
        dataCollector: true,
        paypal: {
          flow: 'vault'
        }
      }, function (error, instance) {
        if (error)
          console.error(error)
        else
          setBraintreeInstance(instance);
          setHideButton(false)
      });

      if (braintreeInstance) {
        braintreeInstance
          .teardown()
          .then(() => {
            initializeBraintree();
          });
      } else {
        initializeBraintree();
      }
    }
  }, [show])

  return (
    <>
      <div id="braintree-drop-in-div" />

      <Button
        hidden={hideButton}
        disabled={!braintreeInstance}
        onClick={() => {
          if (braintreeInstance) {
            
            braintreeInstance.requestPaymentMethod(
              (error, paymentMethod) => {
                if (error) {
                  onPaymentMethodError(error)
                } else {
                  onPaymentMethodConfirmed(paymentMethod);

                }
              }
            );
          }
        }}
      >
        { "Confirm Payment Method" }
      </Button>
    </>
  )
}

