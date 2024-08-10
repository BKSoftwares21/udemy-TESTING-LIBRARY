import React from "react";
import SummaryForm from "./SummaryForm";
import { useOrderDetails } from "../../contexts/OrderDetails";
import { formatCurrency } from "../../utilities";

interface OrderSummaryProps {
  setOrderPhase: (phase: string) => void;
}

export default function OrderSummary({ setOrderPhase }: OrderSummaryProps) {
  const { totals, optionCounts } = useOrderDetails();

  const scoopArray = Object.entries(optionCounts.scoops);
  const scoopList = scoopArray.map(([key, value]) => (
    <li key={key}>
      {value} {key}
    </li>
  ));

  const hasToppings = totals.toppings > 0;
  const toppingsDisplay = hasToppings && (
    <>
      <h2>Toppings: {formatCurrency(totals.toppings)}</h2>
      <ul>
        {Object.keys(optionCounts.toppings).map((key) => (
          <li key={key}>{key}</li>
        ))}
      </ul>
    </>
  );

  return (
    <div>
      <h1>Order Summary</h1>
      <h2>Scoops: {formatCurrency(totals.scoops)}</h2>
      <ul>{scoopList}</ul>
      {toppingsDisplay}
      <SummaryForm setOrderPhase={setOrderPhase} />
    </div>
  );
}
