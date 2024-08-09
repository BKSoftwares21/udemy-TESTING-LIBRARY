import Alert from "react-bootstrap/Alert";
import React from "react";

interface AlertProps {
  message: string,
   variant :string
}
export default function AlertBanner({ message, variant }:AlertProps) {
  const alertMessage =
    message || "An unexpected error occurred. Please try again later.";
  const alertVariant = variant || "danger";

  return (
    <Alert variant={alertVariant} style={{ backgroundColor: "red" }}>
      {alertMessage}
    </Alert>
  );
}
