import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui";
import type { User } from "../../../entities/user";

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  userLoading: boolean;
  userError: boolean;
}

export const UserModal = ({ open, onOpenChange, user, userLoading, userError }: UserModalProps) => {
  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        {(() => {
          if (userLoading) {
            return <div className="flex justify-center p-4 text-gray-500">사용자 정보 로딩 중...</div>;
          }

          if (userError) {
            return (
              <div className="flex flex-col items-center p-4 text-red-600 space-y-2">
                <p>사용자 정보를 불러오는데 실패했습니다.</p>
                <button onClick={() => window.location.reload()} className="text-sm underline hover:no-underline">
                  다시 시도
                </button>
              </div>
            );
          }

          return (
            <div className="space-y-4">
              <img src={user.image} alt={user.username} className="w-24 h-24 rounded-full mx-auto" />
              <h3 className="text-xl font-semibold text-center">{user.username}</h3>
              <div className="space-y-2">
                <p>
                  <strong>이름:</strong> {user.firstName} {user.lastName}
                </p>
                <p>
                  <strong>나이:</strong> {user.age}
                </p>
                <p>
                  <strong>이메일:</strong> {user.email}
                </p>
                <p>
                  <strong>전화번호:</strong> {user.phone}
                </p>
                <p>
                  <strong>주소:</strong> {user.address?.address}, {user.address?.city}, {user.address?.state}
                </p>
                <p>
                  <strong>직장:</strong> {user.company?.name} - {user.company?.title}
                </p>
              </div>
            </div>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
};
