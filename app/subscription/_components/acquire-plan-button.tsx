"use client";

import { createStripeCheckout } from "@/app/_actions/create-stripe-checkout";
import { createStripePortal } from "@/app/_actions/stripe-customer-portal";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";

interface AcquirePlanButtonProps {
  title?: string;
  priceId?: string;
  buttonType: "manage" | "upgrade" | "downgrade";
}

const AcquirePlanButton = ({ priceId, buttonType }: AcquirePlanButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAcquirePlanClick = async () => {
    try {
      setIsLoading(true);

      // A action retorna a URL de checkout
      if (!priceId) {
        throw new Error("Price ID não fornecido.");
      }

      const { sessionUrl } = await createStripeCheckout(priceId);

      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        throw new Error("Não foi possível gerar a URL de pagamento.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao redirecionar para o pagamento.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageClick = async () => {
    try {
      setIsLoading(true);
      const { portalUrl } = await createStripePortal();

      if (portalUrl) {
        window.location.href = portalUrl; // Redirecionamento nativo
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao acessar o portal do cliente.");
      setIsLoading(false);
    }
  };

  if (buttonType === "manage") {
    return (
      <Button
        variant="outline"
        className="h-11 w-full rounded-full font-semibold text-primary"
        onClick={handleManageClick}
        disabled={isLoading}
      >
        Gerenciar plano
      </Button>
    );
  }

  if (buttonType === "downgrade") {
    return (
      <Button
        variant="outline"
        className="h-11 w-full rounded-full font-semibold text-red-300"
      >
        Fazer downgrade para este plano
      </Button>
    );
  }

  return (
    <Button
      className="h-11 w-full rounded-full font-semibold shadow-sm"
      onClick={handleAcquirePlanClick}
      disabled={isLoading}
    >
      {isLoading ? "Carregando..." : "Adquirir plano"}
    </Button>
  );
};

export default AcquirePlanButton;
