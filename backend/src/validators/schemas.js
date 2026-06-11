export const authRegisterSchema = {
  name: { required: true },
  email: { required: true },
  password: { required: true },
};
export const authLoginSchema = { email: { required: true }, password: { required: true } };
export const ledgerEntrySchema = {
  date: { required: true },
  type: { required: true, enum: ["credit", "expense"] },
  category: { enum: ["Rent", "Travel", "Electricity", "Purchase", "Maintenance", "Salary", "Miscellaneous", "Other", null] },
  amount: { required: true, type: "number", min: 0 },
  paymentMethod: { enum: ["Cash", "UPI", null] },
  description: {},
};
