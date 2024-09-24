import React from "react";
import { Button, ButtonProps } from "./button";
import { Loader2 } from "lucide-react";

interface ButtonLoadingProps extends ButtonProps {
  loading?: boolean;
  icon?: React.ElementType;
}

const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  loading = false,
  icon: Icon,
  children,
  ...props
}) => {
  return (
    <Button {...props} disabled={loading}>
      <div className="flex items-center gap-2">
        {children}
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          Icon && <Icon className="size-4" />
        )}
      </div>
    </Button>
  );
};

export default ButtonLoading;
