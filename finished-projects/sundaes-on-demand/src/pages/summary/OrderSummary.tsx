import React, { FC } from "react";
import SummaryForm from "./SummaryForm";
import { useOrderDetails } from "../../contexts/OrderDetails";
import { formatCurrency } from "../../utilities";
import { OptionCounts, Totals } from "../../interfaces";

interface OrderSummaryProps {
  setOrderPhase: (phase: string) => void;
}

const OrderSummary: FC<OrderSummaryProps> = ({ setOrderPhase }) => {
  const { totals, optionCounts } = useOrderDetails();

  const scoopArray = Object.entries(optionCounts.scoops as OptionCounts["scoops"]);
  const scoopList = scoopArray.map(([key, value]) => (
    <li key={key}>
      {value} {key}
    </li>
  ));

  // only display toppings if the toppings total is nonzero
  const hasToppings = totals.toppings > 0;
  let toppingsDisplay: React.ReactNode = null;

  if (hasToppings) {
    const toppingsArray = Object.keys(optionCounts.toppings as OptionCounts["toppings"]);
    const toppingList = toppingsArray.map((key) => <li key={key}>{key}</li>);
    toppingsDisplay = (
      <>
        <h2>Toppings: {formatCurrency(totals.toppings)}</h2>
        <ul>{toppingList}</ul>
      </>
    );
  }

  return (
    <div>
      <h1>Order Summary</h1>
      <h2>Scoops: {formatCurrency(totals.scoops)}</h2>
      <ul>{scoopList}</ul>
      {toppingsDisplay}
      <SummaryForm setOrderPhase={setOrderPhase} />
    </div>
  );
};

export default OrderSummary;