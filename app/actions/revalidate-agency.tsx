"use server";

import { revalidatePath } from "next/cache";

export async function revalidateAgencyPath() {
  revalidatePath("/agency");
}
