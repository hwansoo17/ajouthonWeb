// store/activityFormDataStore.ts (새로 만들거나 기존 스토어에 추가)
import { create } from 'zustand';

// Member 타입은 HomePage.tsx에 정의된 것을 재사용하거나 import 합니다.
type Member = {
  memberId: string;
  name: string;
  email: string;
  role: string;
};

interface ActivityFormDataState {
  membersForSelection: Member[];
  setMembersForSelection: (members: Member[]) => void;
  clearMembersForSelection: () => void; // 페이지 벗어날 때 데이터 클리어용
}

const useActivityFormDataStore = create<ActivityFormDataState>((set) => ({
  membersForSelection: [],
  setMembersForSelection: (members) => set({ membersForSelection: members }),
  clearMembersForSelection: () => set({ membersForSelection: [] }),
}));

export default useActivityFormDataStore;
