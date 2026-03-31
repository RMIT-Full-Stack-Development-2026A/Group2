import Counter from "../models/Counter.js";

export async function getNextSequence(sequenceName) {
  const doc = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { nextValue: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return doc.nextValue;
}