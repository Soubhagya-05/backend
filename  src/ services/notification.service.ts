import { getIO } from "../utils/websocket";

export function notifyAll(event: string, payload: any) {
  try {
    getIO().emit(event, payload);
  } catch (err) {
    console.error("notifyAll error:", err);
  }
}
