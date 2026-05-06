"use server";

import { MatchStatus } from '@/lib/db-mock';

export async function sendMatchRequest(fromId: string, toId: string) {
  // Logic to save match request to Firestore 'matchRequests' collection
  console.log(`Sending match request from ${fromId} to ${toId}`);
  return { success: true };
}

export async function updateMatchStatus(requestId: string, status: MatchStatus) {
  // Logic to update state in Firestore
  console.log(`Updating request ${requestId} to ${status}`);
  return { success: true };
}