import { Search } from "lucide-react";
import { Input } from "../../../shared/ui";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

/**
 * 검색 입력 컴포넌트
 * 단일 책임: 검색어 입력만 담당
 */
export const SearchInput = ({ value, onChange, onSearch, placeholder = "게시물 검색..." }: SearchInputProps) => {
  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-8"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && onSearch()}
        />
      </div>
    </div>
  );
};
