export interface QuoteInputs {
  pages: number;
  booking: boolean;
  contentProvided: boolean;
  launchDate: string;
  maintenance: boolean;
}

export interface QuoteResult {
  total: number;
  breakdown: string;
}

// ⚙️ Inject your custom logic here
export function calculateQuote(inputs: QuoteInputs): QuoteResult {
  const { pages, booking, contentProvided, launchDate, maintenance } = inputs;
  let total = pages === 1 ? 200 : 200 + (pages - 1) * 75;
  if (booking) total += 100;
  if (contentProvided) total -= 75;
  const diffDays = (new Date(launchDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (diffDays < 14) total += 100;
  const breakdown = `Pages: ${pages}, Booking: ${booking}, ContentProvided: ${contentProvided}, Maintenance: ${maintenance}`;
  return { total, breakdown };
}
