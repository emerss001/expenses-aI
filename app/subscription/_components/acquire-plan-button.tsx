"use client";

import { createStripeCheckout } from "@/app/_actions/create-stripe-checkout";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";

interface AcquirePlanButtonProps {
  title: string;
  priceId: string;
}

const AcquirePlanButton = ({ title, priceId }: AcquirePlanButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAcquirePlanClick = async () => {
    try {
      setIsLoading(true);

      // A action retorna a URL de checkout
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

  return (
    <Button
      className="h-11 w-full rounded-full font-semibold shadow-sm"
      onClick={handleAcquirePlanClick}
      disabled={isLoading}
    >
      {isLoading ? "Carregando..." : title}{" "}
    </Button>
  );
};

export default AcquirePlanButton;
