/**
 * Contrato único de retorno das server actions.
 *
 * O Next.js apaga a mensagem de erros lançados por server actions em produção,
 * então falha esperada não é exceção: é retorno. Quem chama sempre recebe
 * `success` e, quando falso, uma mensagem pronta para mostrar ao usuário.
 */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; message: string };

const GENERIC_ERROR_MESSAGE =
  "Não foi possível concluir a operação. Tente novamente em instantes.";

/** Usada por quem chama a action quando a própria requisição não completa. */
export const CONNECTION_ERROR_MESSAGE =
  "Falha de conexão. Verifique sua internet e tente novamente.";

/** Falha esperada, com mensagem escrita para o usuário final. */
export class ActionError extends Error {}

/**
 * Executa o corpo da action e normaliza o retorno. Erro esperado vira mensagem;
 * qualquer outro vira mensagem genérica e fica registrado no log do servidor.
 */
export const runAction = async <T>(
  execute: () => Promise<T>,
): Promise<ActionResult<T>> => {
  try {
    return { success: true, data: await execute() };
  } catch (error) {
    if (error instanceof ActionError) {
      return { success: false, message: error.message };
    }

    console.error(error);
    return { success: false, message: GENERIC_ERROR_MESSAGE };
  }
};
