import React, { createContext, useContext, useState, ReactNode } from "react";
import { pricePerItem } from "../constants";

interface OptionCounts {
  scoops: Record<string, number>;
  toppings: Record<string, number>;
}

interface Totals {
  scoops: number;
  toppings: number;
}

interface OrderDetailsContextType {
  optionCounts: OptionCounts;
  totals: Totals;
  updateItemCount: (itemName: string, newItemCount: number, optionType: keyof OptionCounts) => void;
  resetOrder: () => void;
}

const OrderDetails = createContext<OrderDetailsContextType | undefined>(undefined);

export function useOrderDetails(): OrderDetailsContextType {
  const contextValue = useContext(OrderDetails);

  if (!contextValue) {
    throw new Error("useOrderDetails must be used within an OrderDetailsProvider");
  }

  return contextValue;
}

interface OrderDetailsProviderProps {
  children: ReactNode;
}

export function OrderDetailsProvider({ children }: OrderDetailsProviderProps) {
  const [optionCounts, setOptionCounts] = useState<OptionCounts>({
    scoops: {},
    toppings: {},
  });

  const updateItemCount = (
    itemName: string,
    newItemCount: number,
    optionType: keyof OptionCounts
  ) => {
    setOptionCounts((prevOptionCounts) => ({
      ...prevOptionCounts,
      [optionType]: {
        ...prevOptionCounts[optionType],
        [itemName]: newItemCount,
      },
    }));
  };

  const resetOrder = () => {
    setOptionCounts({ scoops: {}, toppings: {} });
  };

  const calculateTotal = (optionType: keyof OptionCounts): number => {
    const totalCount = Object.values(optionCounts[optionType]).reduce(
      (total, value) => total + value,
      0
    );
    return totalCount * pricePerItem[optionType];
  };

  const totals = {
    scoops: calculateTotal("scoops"),
    toppings: calculateTotal("toppings"),
  };

  const value = { optionCounts, totals, updateItemCount, resetOrder };

  return <OrderDetails.Provider value={value}>{children}</OrderDetails.Provider>;
}
