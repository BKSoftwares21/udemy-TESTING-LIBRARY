import React, { createContext, useContext, useState, ReactNode } from "react";
import { pricePerItem } from "../constants/index";

// Define the structure of the option counts
interface OptionCounts {
  scoops: Record<string, number>;
  toppings: Record<string, number>;
}

// Define the context value structure
interface OrderDetailsContextType {
  optionCounts: OptionCounts;
  totals: {
    scoops: number;
    toppings: number;
  };
  updateItemCount: (itemName: string, newItemCount: number, optionType: keyof OptionCounts) => void;
  resetOrder: () => void;
}

// Create the context with a default value of undefined
const OrderDetails = createContext<OrderDetailsContextType | undefined>(undefined);

// Create custom hook to check whether we're in a provider
export function useOrderDetails(): OrderDetailsContextType {
  const contextValue = useContext(OrderDetails);

  if (!contextValue) {
    throw new Error(
      "useOrderDetails must be called from within an OrderDetailsProvider"
    );
  }

  return contextValue;
}

// Define the provider's props type
interface OrderDetailsProviderProps {
  children: ReactNode;
}

export function OrderDetailsProvider({ children }: OrderDetailsProviderProps) {
  const [optionCounts, setOptionCounts] = useState<OptionCounts>({
    scoops: {},
    toppings: {},
  });

  function updateItemCount(itemName: string, newItemCount: number, optionType: keyof OptionCounts) {
    // make a copy of existing state
    const newOptionCounts = { ...optionCounts };

    // update the copy with the new information
    newOptionCounts[optionType][itemName] = newItemCount;

    // update the state with the updated copy
    setOptionCounts(newOptionCounts);

    // Alternate way using function argument to setOptionCounts
    // setOptionCounts((previousOptionCounts) => ({
    //   ...previousOptionCounts,
    //   [optionType]: {
    //     ...previousOptionCounts[optionType],
    //     [itemName]: newItemCount,
    //   },
    // }));
  }

  function resetOrder() {
    setOptionCounts({ scoops: {}, toppings: {} });
  }

  function calculateTotal(optionType: keyof OptionCounts): number {
    const countsArray = Object.values(optionCounts[optionType]);
    const totalCount = countsArray.reduce((total, value) => total + value, 0);
    return totalCount * pricePerItem[optionType];
  }

  const totals = {
    scoops: calculateTotal("scoops"),
    toppings: calculateTotal("toppings"),
  };

  const value: OrderDetailsContextType = { optionCounts, totals, updateItemCount, resetOrder };
  return <OrderDetails.Provider value={value}>{children}</OrderDetails.Provider>;
}
