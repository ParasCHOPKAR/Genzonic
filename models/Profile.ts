import mongoose, { Schema, Document, models } from "mongoose";

export interface IAddress {
  fullName: string;
  phone: string;
  pinCode: string;
  city: string;
  state: string;
  streetAddress: string;
  isDefault: boolean;
}

export interface IProfile extends Document {
  userEmail: string;
  addresses: IAddress[];
}

const AddressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  pinCode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: "Maharashtra" },
  streetAddress: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const ProfileSchema = new Schema<IProfile>({
  userEmail: { type: String, required: true, unique: true },
  addresses: [AddressSchema], // Now stores an array of addresses
}, { timestamps: true });

export default models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
