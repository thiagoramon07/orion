/**
 * Autenticação — MOCK. Nenhuma chamada de rede real ainda.
 * TODO: integrar com o backend e os SDKs de login social.
 */
export type SocialProvider = 'apple' | 'google' | 'facebook';

export async function signInWithProvider(provider: SocialProvider): Promise<{ ok: boolean }> {
  // TODO: implementar login social real (expo-apple-authentication / Google / Facebook).
  console.log('[mock] signInWithProvider', provider);
  return { ok: true };
}

export async function startEmailSignUp(email: string): Promise<{ ok: boolean }> {
  // TODO: chamar backend para iniciar cadastro do responsável.
  console.log('[mock] startEmailSignUp', email);
  return { ok: true };
}
