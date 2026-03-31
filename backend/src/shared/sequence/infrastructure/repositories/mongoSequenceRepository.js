import CounterModel from "../models/CounterModel.js";

class MongoSequenceRepository {
  async getNextValue(sequenceName) {
    const doc = await CounterModel.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { nextValue: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return doc.nextValue;
  }
}

export const mongoSequenceRepository = new MongoSequenceRepository();
