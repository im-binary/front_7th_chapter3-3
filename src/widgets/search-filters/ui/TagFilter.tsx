import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui";
import { Tag } from "../../../entities/tag";

interface TagFilterProps {
  value: string;
  onChange: (value: string) => void;
  tags: Tag[];
}

/**
 * 태그 필터 컴포넌트
 * 단일 책임: 태그 선택만 담당
 */
export const TagFilter = ({ value, onChange, tags }: TagFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {tags.map((tag) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
