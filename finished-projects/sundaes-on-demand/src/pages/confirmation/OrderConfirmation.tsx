import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Button from "react-bootstrap/Button";
import { useOrderDetails } from "../../contexts/OrderDetails";
import AlertBanner from "../common/AlertBanner";
import React from "react";

interface OrderResponse {
  orderNumber: number;
}

export default function OrderConfirmation({ setOrderPhase }: { setOrderPhase: (phase: string) => void }) {
  const { resetOrder } = useOrderDetails();
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .post<OrderResponse>(`http://localhost:3030/order`)
      .then((response: AxiosResponse<OrderResponse>) => {
        setOrderNumber(response.data.orderNumber);
      })
      .catch(() => setError(true));
  }, []);

  function handleClick() {
    resetOrder();
    setOrderPhase("inProgress");
  }

  const newOrderButton = (
    <Button onClick={handleClick}>Create new order</Button>
  );

  if (error) {
    return (
      <>
        <AlertBanner message={null} variant={null} />
        {newOrderButton}
      </>
    );
  }

  if (orderNumber !== null) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Thank You!</h1>
        <p>Your order number is {orderNumber}</p>
        <p style={{ fontSize: "25%" }}>
          as per our terms and conditions, nothing will happen now
        </p>
        {newOrderButton}
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}