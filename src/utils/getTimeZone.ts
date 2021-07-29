export default function getTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
