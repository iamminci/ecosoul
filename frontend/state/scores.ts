import { get, ref, remove, set } from "firebase/database";

import database from "./database";

// export function initBalloon(gameID: string, balloon: Balloon) {
//   if (!gameID || !balloon) return;
//   set(ref(database, `games/${gameID}/balloons/${balloon.id}`), {
//     ...balloon,
//   });
// }

// export function updateBalloon(gameID: string) {
//   if (!gameID || !balloon) return;
//   set(ref(database, `games/${gameID}/balloons/${balloon.id}`), {
//     ...balloon,
//   });
// }

// export function removeBalloon(gameID: string, balloonID: string) {
//   if (!balloonID) return;
//   remove(ref(database, `games/${gameID}/balloons/${balloonID}`));
// }

export async function getAllScores() {
  const snapshot = await get(ref(database, "scores/"));
  const scores = snapshot.val();

  return scores;
}

export async function getScores(minerId: string) {
  const snapshot = await get(ref(database, "scores/" + minerId));
  const scores = snapshot.val();

  return scores;
}
