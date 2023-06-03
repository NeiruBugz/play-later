export function statusToReadable(value: string) {
  switch (value) {
    case "in-progress":
      return "In progress";
    default:
      return value;
  }
}
