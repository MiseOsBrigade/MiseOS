import { Search } from 'lucide-react';
import { usePlaygroundStore } from '../store/usePlaygroundStore';

export function SearchBar() {
  const query = usePlaygroundStore((s) => s.query);
  const setQuery = usePlaygroundStore((s) => s.setQuery);

  return (
    <label className="search-bar">
      <Search size={18} />
      <span className="sr-only">Search repository</span>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search records, IDs, tags, or authors"
      />
    </label>
  );
}
