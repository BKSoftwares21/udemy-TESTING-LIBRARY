import { createContext, useContext, useState } from "react";
import { pricePerDetails } from "../constants";
import React from "react";
interface OptionCount {
  [key: string]: number;
}

interface OrderDetails {
  optionCounts: {
    scoops: OptionCount;
    toppings: OptionCount;
  };
  totals: {
    scoops: number;
    toppings: number;
  };
  updateDetailsCount: (
    DetailsName: string,
    newDetailsCount: number,
    optionType: "scoops" | "toppings"
  ) => void;
  resetOrder: () => void;
}

const OrderDetails = createContext<OrderDetails | undefined>(undefined);

// create custom hook to check whether we're in a provider
export function useOrderDetails(): OrderDetails {
  const contextValue = useContext(OrderDetails);

  if (!contextValue) {
    throw new Error(
      "useOrderDetails must be called from within an OrderDetailsProvider"
    );
  }

  return contextValue;
}

export function OrderDetailsProvider(props: { children: React.ReactNode }) {
  const [optionCounts, setOptionCounts] = useState<
    OrderDetails["optionCounts"]
  >({
    scoops: {},
    toppings: {},
  });

  function updateDetailsCount(
    DetailsName: string,
    newDetailsCount: number,
    optionType: "scoops" | "toppings"
  ) {
    const newOptionCounts = { ...optionCounts };
    newOptionCounts[optionType][DetailsName] = newDetailsCount;
    setOptionCounts(newOptionCounts);
  }

  function resetOrder() {
    setOptionCounts({ scoops: {}, toppings: {} });
  }
  function calculateTotal(optionType: "scoops" | "toppings") {
    const countsArray = Object.values(optionCounts[optionType]);
    const totalCount = countsArray.reduce((total, value) => total + value, 0);
    return totalCount * pricePerDetails[optionType];
  }

  const totals = {
    scoops: calculateTotal("scoops"),
    toppings: calculateTotal("toppings"),
  };

  const value: OrderDetails = {
    optionCounts,
    totals,
    updateDetailsCount,
    resetOrder,
  };
  return <OrderDetails.Provider value={value} {...props} />;
}
