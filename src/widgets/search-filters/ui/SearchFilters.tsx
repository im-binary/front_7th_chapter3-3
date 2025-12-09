import { Tag } from "../../../entities/tag";
import { SearchInput } from "./SearchInput";
import { TagFilter } from "./TagFilter";
import { SortSelect } from "./SortSelect";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  tags: Tag[];
  onTagChange: (tag: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: string;
  setSortOrder: (sortOrder: string) => void;
}

/**
 * 검색/필터 위젯 (조합 컴포넌트)
 * 작은 컴포넌트들을 조합하여 완전한 검색/필터 UI 제공
 */
export const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  selectedTag,
  setSelectedTag,
  tags,
  onTagChange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: SearchFiltersProps) => {
  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    onTagChange(value);
  };

  return (
    <div className="flex gap-4">
      <SearchInput value={searchQuery} onChange={setSearchQuery} onSearch={onSearch} />
      <TagFilter value={selectedTag} onChange={handleTagChange} tags={tags} />
      <SortSelect sortBy={sortBy} sortOrder={sortOrder} onSortByChange={setSortBy} onSortOrderChange={setSortOrder} />
    </div>
  );
};
