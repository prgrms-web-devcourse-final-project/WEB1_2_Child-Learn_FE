import { http, HttpResponse } from 'msw';
import { AvatarResponseDto } from '@/features/avatar/types/avatarTypes';
import { EquipRequestDto, EquipResponseDto } from '@/features/avatar/types/equipTypes';
import { Item } from '@/features/avatar/types/itemTypes';
import { PurchaseRequestDto, PurchaseResponseDto } from '@/features/avatar/types/purchaseTypes';
import { ReadRequestDto, ReadResponseDto } from '@/features/avatar/types/readTypes';
import { RemoveRequestDto, RemoveResponseDto } from '@/features/avatar/types/removeTypes';

// Mock 데이터
let mockCoins = 1000; // 회원의 초기 코인 잔액

let mockItems: Item[] = [
  { id: 1, name: '미래 도시', price: 20, category: 'BACKGROUND', imageUrl: '/img/future-city.png', description: '미래 도시 배경' },
  { id: 2, name: '수중 세계', price: 50, category: 'BACKGROUND', imageUrl: '/img/underwater.png', description: '수중 세계 배경' },
  { id: 3, name: '우주', price: 50, category: 'BACKGROUND', imageUrl: '/img/space.png', description: '우주 배경' },
  { id: 4, name: '스위트 공장', price: 50, category: 'BACKGROUND', imageUrl: '/img/sweet-factory.png', description: '스위트 공장 배경' },
  { id: 5, name: '유령 성', price: 50, category: 'BACKGROUND', imageUrl: '/img/spooky-castle.png', description: '유령 성 배경' },
  { id: 11, name: '불꽃 펫', price: 20, category: 'PET', imageUrl: '/img/fire.png', description: '불꽃 펫' },
  { id: 12, name: '물방울 펫', price: 50, category: 'PET', imageUrl: '/img/water.png', description: '물방울 펫' },
  { id: 13, name: '별똥별 펫', price: 50, category: 'PET', imageUrl: '/img/starlight.png', description: '별똥별 펫' },
  { id: 14, name: '식물 펫', price: 50, category: 'PET', imageUrl: '/img/plant.png', description: '식물 펫' },
  { id: 15, name: '구름 펫', price: 50, category: 'PET', imageUrl: '/img/cloud.png', description: '구름 펫' },
  { id: 21, name: '마법사 모자', price: 200, category: 'HAT', imageUrl: '/img/wizard.png', description: '마법사 모자' },
  { id: 22, name: '신사 모자', price: 50, category: 'HAT', imageUrl: '/img/gentleman.png', description: '신사 모자' },
  { id: 23, name: '밀짚모자', price: 50, category: 'HAT', imageUrl: '/img/farmer.png', description: '밀짚 모자' },
  { id: 24, name: '야구 모자', price: 50, category: 'HAT', imageUrl: '/img/baseball.png', description: '야구 모자' },
  { id: 25, name: '왕관', price: 50, category: 'HAT', imageUrl: '/img/tiara.png', description: '왕관' },
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

   // 아이템 전체 조회
   http.get('/api/v1/member/avatar/read-all', async () => {
    // 아이템 상태 계산
    const enrichedItems = mockItems.map((item) => {
      const isPurchased =
        mockAvatar.hat?.id === item.id ||
        mockAvatar.pet?.id === item.id ||
        mockAvatar.background?.id === item.id;

      const isEquipped = isPurchased && (
        (mockAvatar.hat && mockAvatar.hat.id === item.id) ||
        (mockAvatar.pet && mockAvatar.pet.id === item.id) ||
        (mockAvatar.background && mockAvatar.background.id === item.id)
      );

      return {
        ...item,
        isPurchased,
        isEquipped,
      };
    });

    // 응답 데이터 반환
    return HttpResponse.json(enrichedItems, { status: 200 });
  }),
];
