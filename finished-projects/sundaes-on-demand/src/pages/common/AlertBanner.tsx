import React, { FunctionComponent } from "react";
import Alert, { AlertProps } from "react-bootstrap/Alert";

interface AlertBannerProps extends Omit<AlertProps, 'children'> {
  message?: string;
}

const AlertBanner: FunctionComponent<AlertBannerProps> = ({ message, variant = 'danger', ...props }) => {
  const alertMessage = message || "An unexpected error occurred. Please try again later.";

  return (
    <Alert variant={variant} style={{ backgroundColor: "red" }} {...props}>
      {alertMessage}
    </Alert>
  );
};

export default AlertBanner;