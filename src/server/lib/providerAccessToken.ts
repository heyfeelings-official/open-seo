import { and, eq, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { account } from "@/db/schema";
import { getAuth } from "@/lib/auth";

/**
 * Better Auth 1.7 mints tokens by the account row id (`account.id`). Callers
 * still know the provider subject (`account.accountId`, the Google sub).
 */
export async function getStoredProviderAccessToken(input: {
  userId: string;
  providerId: string;
  providerAccountId?: string;
}): Promise<{ accessToken?: string }> {
  const filters: SQL[] = [
    eq(account.userId, input.userId),
    eq(account.providerId, input.providerId),
  ];
  if (input.providerAccountId) {
    filters.push(eq(account.accountId, input.providerAccountId));
  }
  const rows = await db
    .select({ id: account.id })
    .from(account)
    .where(and(...filters))
    .limit(2);
  const match = input.providerAccountId
    ? rows[0]
    : rows.length === 1
      ? rows[0]
      : undefined;
  if (!match) {
    throw new Error("No stored OAuth grant for that provider");
  }
  return getAuth().api.getAccessToken({
    body: { accountId: match.id, userId: input.userId },
  });
}
