// The core Asset entity — represents a crypto asset held in a portfolio.
// Every field is readonly so assets can only be modified through the repository,
// never by mutating the object directly.

export interface Asset {
  readonly id: string;
  readonly symbol: string;        // Ticker symbol, always uppercase (e.g. "BTC", "ETH")
  readonly name: string;          // Human-readable name (e.g. "Bitcoin", "Ethereum")
  readonly quantity: number;       // Amount of the asset held
  readonly purchasePrice: number;  // Price per unit at time of purchase (USD)
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// DTO = Data Transfer Object
// These define what the outside world sends IN to the API.
// They intentionally exclude id, createdAt, updatedAt — those are set internally.

export interface CreateAssetDto {
  readonly symbol: string;
  readonly name: string;
  readonly quantity: number;
  readonly purchasePrice: number;
}

// All fields optional — the client sends only what they want to change.
export interface UpdateAssetDto {
  readonly symbol?: string;
  readonly name?: string;
  readonly quantity?: number;
  readonly purchasePrice?: number;
}
