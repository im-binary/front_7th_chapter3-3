import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui";

interface PaginationControlsProps {
  skip: number;
  limit: number;
  total: number;
  onLimitChange: (value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const PaginationControls = ({
  skip,
  limit,
  total,
  onLimitChange,
  onPrevious,
  onNext,
}: PaginationControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>

        <Select value={limit.toString()} onValueChange={(value) => onLimitChange(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>

      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={onPrevious}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
};
