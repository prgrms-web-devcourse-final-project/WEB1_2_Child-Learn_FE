import { http, HttpResponse } from 'msw';
import { AvatarResponseDto } from '@/features/avatar/types/avatarTypes';
import { EquipRequestDto, EquipResponseDto } from '@/features/avatar/types/equipTypes';
import { Item } from '@/features/avatar/types/itemTypes';
import { PurchaseRequestDto, PurchaseResponseDto } from '@/features/avatar/types/purchaseTypes';
import { ReadRequestDto, ReadResponseDto } from '@/features/avatar/types/readTypes';
import { RemoveRequestDto, RemoveResponseDto } from '@/features/avatar/types/removeTypes';

// Mock 데이터
let mockCoins = 1000; // 회원의 초기 코인 잔액

let mockItems = [
  { id: 1, name: 'Red Hat', price: 200, category: 'HAT', imageUrl: '/images/red-hat.png', description: 'A stylish red hat.' },
  { id: 2, name: 'Blue Background', price: 500, category: 'BACKGROUND', imageUrl: '/images/blue-background.png', description: 'A calming blue background.' },
];

let mockAvatar: {
  id: number;
  memberId: number;
  hat: Item | null;
  pet: Item | null;
  background: Item | null;
} = {
  id: 1,
  memberId: 1,
  hat: null,
  pet: null,
  background: null,
};

// Handlers
export const avatarHandlers = [
  // 아이템 구매
  http.post('/api/v1/member/avatar/purchase', async ({ request }) => {
    const body = (await request.json() as PurchaseRequestDto);
    const { itemId } = body;

    const item = mockItems.find((i) => i.id === itemId);
    if (!item) {
      return HttpResponse.json<PurchaseResponseDto>({ message: '아이템을 찾을 수 없습니다.' }, { status: 404 });
    }

    if (mockCoins < item.price) {
      return HttpResponse.json<PurchaseResponseDto>({ message: '코인이 부족합니다.' }, { status: 400 });
    }

    mockCoins -= item.price;
    return HttpResponse.json<PurchaseResponseDto>({ message: '아이템을 성공적으로 구매했습니다.', remainingCoins: mockCoins }, { status: 200 });
  }),

  // 아이템 장착
  http.post('/api/v1/member/avatar/isEquipped', async ({ request }) => {
    const body = (await request.json() as EquipRequestDto);
    const { itemId } = body;

    const item = mockItems.find((i) => i.id === itemId);
    if (!item) {
      return HttpResponse.json<EquipResponseDto>({ message: '아이템을 찾을 수 없습니다.', itemImageUrl: '' }, { status: 404 });
    }

    switch (item.category) {
      case 'HAT':
        mockAvatar.hat = item;
        break;
      case 'BACKGROUND':
        mockAvatar.background = item;
        break;
      case 'PET':
        mockAvatar.pet = item;
        break;
      default:
        return HttpResponse.json<EquipResponseDto>({ message: '잘못된 아이템 카테고리입니다.', itemImageUrl: '' }, { status: 400 });
    }

    return HttpResponse.json<EquipResponseDto>({ message: '아이템이 성공적으로 장착되었습니다.', itemImageUrl: item.imageUrl }, { status: 200 });
  }),

  // 아이템 해제
  http.post('/api/v1/member/avatar/remove', async ({ request }) => {
    const body = (await request.json() as RemoveRequestDto);
    const { itemId } = body;

    const item = mockItems.find((i) => i.id === itemId);
    if (!item) {
      return HttpResponse.json<RemoveResponseDto>({ message: '아이템을 찾을 수 없습니다.', itemImageUrl: '' }, { status: 404 });
    }

    switch (item.category) {
      case 'HAT':
        mockAvatar.hat = null;
        break;
      case 'BACKGROUND':
        mockAvatar.background = null;
        break;
      case 'PET':
        mockAvatar.pet = null;
        break;
      default:
        return HttpResponse.json<RemoveResponseDto>({ message: '잘못된 아이템 카테고리입니다.', itemImageUrl: '' }, { status: 400 });
    }

    return HttpResponse.json<RemoveResponseDto>({ message: '아이템이 성공적으로 해제되었습니다.', itemImageUrl: '/images/default.png' }, { status: 200 });
  }),

  // 아이템 조회
  http.post('/api/v1/member/avatar/read', async ({ request }) => {
    const body = (await request.json() as ReadRequestDto);
    const { id } = body;

    const item = mockItems.find((i) => i.id === id);
    if (!item) {
      return HttpResponse.json<ReadResponseDto | { message: string }>({ message: '아이템을 찾을 수 없습니다.' }, { status: 404 });
    }

    return HttpResponse.json<ReadResponseDto>(item, { status: 200 });
  }),

  // 아바타 상태 조회
  http.get('/api/v1/member/avatar', async () => {
    return HttpResponse.json<AvatarResponseDto>(mockAvatar, { status: 200 });
  }),
];
