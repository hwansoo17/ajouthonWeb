// data.ts

// 기본 타입 정의
export type Photo = {
  id: string;
  url: string;
};

export type Participant = {
  id: string;
  name: string;
};

export type Activity = {
  activityId: string; // 각 활동의 고유 ID
  title: string;
  date: string; // 'YYYY-MM-DD' 형식
  content: string;
  photos: Photo[];
  participants: Participant[];
};

// 기존 Group 타입에 activities 추가
export type Group = {
  groupId: number;
  groupName: string;
  category: string;
  role: string;
};

export type GroupWithActivities = Group & {
  activities: Activity[];
};

// 샘플 데이터 (제공해주신 형식에 맞춰 확장)
export const groupsWithActivitiesData: GroupWithActivities[] = [
  {
    groupId: 1,
    groupName: '알고리즘 스터디',
    category: 'STUDY',
    role: 'LEADER',
    activities: [
      {
        activityId: 'alg_act_1',
        title: '정기모임1: DP 문제풀이',
        date: '2025-05-23',
        content:
          '오늘은 다이나믹 프로그래밍 기본 문제들을 함께 풀어보고 리뷰하는 시간을 가졌습니다. 다음 주까지 심화 문제 각자 풀어오기로 했습니다.',
        photos: [
          {
            id: 'p1',
            url: 'https://via.placeholder.com/400x250/A5B4FC/FFFFFF?Text=스터디+사진1',
          },
          {
            id: 'p2',
            url: 'https://via.placeholder.com/400x250/C7D2FE/000000?Text=화이트보드',
          },
        ],
        participants: [
          { id: 'user1', name: '김땡땡' },
          { id: 'user2', name: '이코딩' },
        ],
      },
      {
        activityId: 'alg_act_2',
        title: '정기모임2: 그래프 탐색',
        date: '2025-05-30',
        content:
          'BFS와 DFS 알고리즘을 복습하고, 관련 백준 문제들을 풀었습니다. 특히 경로 찾기 문제에 집중했습니다.',
        photos: [
          {
            id: 'p3',
            url: 'https://via.placeholder.com/400x250/818CF8/FFFFFF?Text=그래프+이론',
          },
        ],
        participants: [
          { id: 'user1', name: '김땡땡' },
          { id: 'user2', name: '이코딩' },
          { id: 'user3', name: '박알고' },
        ],
      },
    ],
  },
  {
    groupId: 2,
    groupName: '농구 동아리',
    category: 'SPORTS',
    role: 'MEMBER',
    activities: [
      {
        activityId: 'spo_act_1',
        title: '주말 정기 연습',
        date: '2025-05-21',
        content:
          '기본기 훈련 및 5대5 연습 경기를 진행했습니다. 다들 열정적으로 참여해주셔서 감사합니다!',
        photos: [
          {
            id: 'p4',
            url: 'https://via.placeholder.com/400x250/FCA5A5/FFFFFF?Text=농구코트',
          },
          {
            id: 'p5',
            url: 'https://via.placeholder.com/400x250/F87171/FFFFFF?Text=연습+모습',
          },
        ],
        participants: [
          { id: 'user4', name: '최슛터' },
          { id: 'user5', name: '강백호' },
        ],
      },
    ],
  },
  {
    groupId: 3,
    groupName: '맛집 탐방 클럽',
    category: 'CLUB',
    role: 'LEADER',
    activities: [
      {
        activityId: 'club_act_1',
        title: '5월 정모: 이탈리안 레스토랑',
        date: '2025-05-25',
        content:
          '새로 생긴 파스타 맛집에서 정모를 가졌습니다. 음식 사진과 후기는 아래에!',
        photos: [
          {
            id: 'club_p1',
            url: 'https://via.placeholder.com/400x250/FDBA74/000000?Text=파스타',
          },
          {
            id: 'club_p2',
            url: 'https://via.placeholder.com/400x250/FECACA/000000?Text=피자',
          },
        ],
        participants: [
          { id: 'user_club1', name: '김미식' },
          { id: 'user_club2', name: '박대식' },
        ],
      },
    ],
  },
];

export const categoryMap: Record<string, string> = {
  STUDY: '스터디',
  SPORTS: '2025 운동크루',
  CLUB: '소학회',
  ETC: '기타',
};

export const roleMap: Record<string, string> = {
  LEADER: '리더',
  MEMBER: '멤버',
};
