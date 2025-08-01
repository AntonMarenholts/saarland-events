import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eventsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = Number(params.id);
    const { status } = await req.json();

    if (!eventId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid event ID or status." },
        { status: 400 }
      );
    }

    const [updatedEvent] = await db
      .update(eventsTable)
      .set({ status })
      .where(eq(eventsTable.id, eventId))
      .returning();

    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Event not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `Event status updated to ${status}.` },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update event status." },
      { status: 500 }
    );
  }
}