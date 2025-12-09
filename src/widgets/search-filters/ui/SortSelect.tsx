import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui";

interface SortSelectProps {
  sortBy: string;
  sortOrder: string;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
}

/**
 * 정렬 선택 컴포넌트
 * 단일 책임: 정렬 기준과 순서 선택만 담당
 */
export const SortSelect = ({ sortBy, sortOrder, onSortByChange, onSortOrderChange }: SortSelectProps) => {
  return (
    <>
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};
