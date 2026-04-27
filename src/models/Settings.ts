import { Settings } from "@/types/Settings";

export function createSettings (): Settings {
  return {
    dealCount: 1,
    backfaceId: 'A1',
    showScore: true,
    showTimer: true,
    autoplayWhenClicked: false,
    showDialog: false
  }
}
