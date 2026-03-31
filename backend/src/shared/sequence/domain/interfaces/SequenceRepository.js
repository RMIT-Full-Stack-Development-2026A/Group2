export class SequenceRepository {
  async getNextValue(_sequenceName) {
    throw new Error("getNextValue must be implemented by infrastructure repository.");
  }
}
