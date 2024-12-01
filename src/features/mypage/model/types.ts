export interface MenuItem {
  icon: string;
  label: string;
  path: string;
  backgroundColor: string;
  iconColor: string; // CSS filter 값
}

export const MENU_ITEMS: MenuItem[] = [
  {
    icon: '/img/user-icon.png',
    label: '친구 목록',
    backgroundColor: '#707EFF4D',
    path: '/friends',
    iconColor:
      'invert(47%) sepia(95%) saturate(1485%) hue-rotate(213deg) brightness(103%) contrast(101%)', // 보라색
  },
  {
    icon: '/img/coin-icon.png',
    label: '환전소',
    backgroundColor: '#63E9B066',
    path: '/exchange',
    iconColor:
      'invert(72%) sepia(64%) saturate(544%) hue-rotate(118deg) brightness(92%) contrast(88%)', // 더 진한 민트색
  },
  {
    icon: '/img/wallet.png',
    label: '구매내역',
    backgroundColor: '#EF54544D',
    path: '/purchases',
    iconColor:
      'invert(58%) sepia(75%) saturate(5323%) hue-rotate(328deg) brightness(98%) contrast(94%)', // 빨간색
  },
  {
    icon: '/img/megaphone.png',
    label: '공지사항',
    backgroundColor: '#369FFF66',
    path: '/notice',
    iconColor:
      'invert(48%) sepia(98%) saturate(2242%) hue-rotate(194deg) brightness(102%) contrast(101%)', // 파란색
  },
  {
    icon: '/img/question-mark.png',
    label: '고객센터',
    backgroundColor: '#FFC0464D',
    path: '/customer-service',
    iconColor:
      'invert(80%) sepia(33%) saturate(1231%) hue-rotate(323deg) brightness(101%) contrast(96%)', // 주황색
  },
];
