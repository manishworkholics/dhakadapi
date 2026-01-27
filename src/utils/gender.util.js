export const getOppositeGender = (gender) => {
  if (!gender) return null;

  const g = gender.toLowerCase();

  if (g === "male") return "female";
  if (g === "female") return "male";

  return null;
};
