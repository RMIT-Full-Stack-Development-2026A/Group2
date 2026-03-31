import { mongoSequenceRepository } from "../../infrastructure/repositories/mongoSequenceRepository.js";

export async function getNextSequence(sequenceName) {
  return mongoSequenceRepository.getNextValue(sequenceName);
}