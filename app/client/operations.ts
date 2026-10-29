// Loads and explicit refreshes share this counter. A delayed response can never
// replace a newer operation, while each season retains its own cached snapshot.
export class SeasonOperations {
  private generations = new Map<number, number>();
  begin(season: number): number {
    const generation = (this.generations.get(season) ?? 0) + 1;
    this.generations.set(season, generation);
    return generation;
  }
  isCurrent(season: number, generation: number): boolean {
    return this.generations.get(season) === generation;
  }
}
