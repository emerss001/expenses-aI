"use client";

import { createStripeCheckout } from "@/app/_actions/create-stripe-checkout";
import { createStripePortal } from "@/app/_actions/stripe-customer-portal";
import { ActionMessage } from "@/app/_components/ui/action-message";
import { Button } from "@/app/_components/ui/button";
import { CONNECTION_ERROR_MESSAGE } from "@/app/_lib/action-result";
import { useState } from "react";

interface AcquirePlanButtonProps {
  /** Rótulo de aquisição definido pelo card (ex.: "Adquirir plano anual"). */
  title?: string;
  priceId?: string;
  buttonType: "manage" | "upgrade" | "downgrade";
}

const AcquirePlanButton = ({
  title,
  priceId,
  buttonType,
}: AcquirePlanButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAcquirePlanClick = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await createStripeCheckout(priceId);

      if (!result.success) {
        setErrorMessage(result.message);
        setIsLoading(false);
        return;
      }

      // redireciona para o Stripe; a tela sai do ar, então o loading continua
      window.location.href = result.data.sessionUrl;
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_MESSAGE);
      setIsLoading(false);
    }
  };

  const handleManageClick = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await createStripePortal();

      if (!result.success) {
        setErrorMessage(result.message);
        setIsLoading(false);
        return;
      }

      window.location.href = result.data.portalUrl;
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_MESSAGE);
      setIsLoading(false);
    }
  };

  const buttonClassName =
    "h-auto min-h-11 w-full whitespace-normal rounded-full font-semibold";

  return (
    <div className="space-y-2">
      {buttonType === "manage" && (
        <Button
          variant="outline"
          className={`${buttonClassName} text-primary`}
          onClick={handleManageClick}
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Gerenciar plano"}
        </Button>
      )}

      {buttonType === "downgrade" && (
        <Button variant="outline" className={`${buttonClassName} text-red-300`}>
          Fazer downgrade para este plano
        </Button>
      )}

      {buttonType === "upgrade" && (
        <Button
          className={`${buttonClassName} shadow-sm`}
          onClick={handleAcquirePlanClick}
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : (title ?? "Adquirir plano")}
        </Button>
      )}

      <ActionMessage message={errorMessage} />
    </div>
  );
};

export default AcquirePlanButton;
