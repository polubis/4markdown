import { useEffect } from "react";
import { toast } from "design-system/toast";
import { type Facade } from "../core/facade";

export const useToastDisplay = (facade: Facade) => {
  useEffect(() => {
    const subscription = facade.onBusEvent((event) => {
      if (event.type === "success") {
        toast.success({ title: event.message });
      } else {
        toast.error({ title: event.message });
      }
    });

    return () => subscription.unsubscribe();
  }, [facade]);
};
