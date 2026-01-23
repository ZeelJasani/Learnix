import { Webhook } from "svix";
import { headers } from "next/headers";

import { env } from "@/lib/env";
import { getOrCreateDbUserFromClerkUser } from "@/lib/clerk-db";

type ClerkWebhookEvent = {
  data: any;
  object: "event";
  type: string;
};

export async function POST(req: Request) {
  const secret = env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("CLERK_WEBHOOK_SECRET is not set", { status: 500 });
  }

  const payload = await req.text();

  const headersList = await headers();
  const svixId = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const u = event.data;

    await getOrCreateDbUserFromClerkUser({
      id: u.id,
      emailAddresses: (u.email_addresses || []).map((e: any) => ({ emailAddress: e.email_address })),
      firstName: u.first_name ?? null,
      lastName: u.last_name ?? null,
      imageUrl: u.image_url ?? "",
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
