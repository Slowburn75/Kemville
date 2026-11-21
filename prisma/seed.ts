import { PrismaClient } from "@prisma/client";
import { services } from "../src/lib/catalog";
const db = new PrismaClient();
async function main() {
  if (
    process.env.ALLOW_DEV_SEED !== "true" ||
    process.env.NODE_ENV === "production"
  )
    throw new Error(
      "Development seed requires ALLOW_DEV_SEED=true outside production",
    );
  await db.$transaction(async (tx) => {
    const promo = await tx.promotion.upsert({
      where: { code: "LAUNCH50" },
      update: {},
      create: { code: "LAUNCH50", percent: 50, active: true },
    });
    for (const service of services) {
      const saved = await tx.consultationService.upsert({
        where: { code: service.id },
        update: {},
        create: {
          code: service.id,
          name: service.name,
          enabled: false,
          prices: { create: { amountKobo: service.regular } },
        },
      });
      await tx.promotionService.upsert({
        where: {
          promotionId_serviceId: { promotionId: promo.id, serviceId: saved.id },
        },
        update: {},
        create: { promotionId: promo.id, serviceId: saved.id },
      });
    }
  });
}
main()
  .catch(() => {
    console.error(
      "Seed failed; inspect database configuration without logging credentials",
    );
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
